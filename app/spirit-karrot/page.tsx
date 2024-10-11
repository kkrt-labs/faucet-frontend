"use client";

import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { useState } from "react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { client, KAKAROT_SEPOLIA } from "@/lib/thirdweb-client";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useGenerateImage } from "@/mutations/useGenerateImage";
import { useFaucet } from "@/hooks/useFaucet";
import { Button } from "@/components/ui/button";
import { CONFETTI_COLORS, ENV, INTENT, KAKAROT_CONTRACT_ADDRESS } from "@/lib/constants";
import mintingIcon from "@/public/assets/mining.gif";
import linkIcon from "@/public/assets/link-icon.svg";
import xIcon from "@/public/assets/x-icon-inverted.svg";
import { useClaimFunds } from "@/mutations/useClaimFunds";
import { Turnstile } from "@marsidev/react-turnstile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { upload } from "thirdweb/storage";
import { MediaRenderer, useWalletBalance } from "thirdweb/react";
import { useToggleEligibility } from "@/mutations/useToggleEligibility";

type MintState = "completed" | "pending" | "generating" | "not-started";

const SpiritKarrot = () => {
  const { wallet } = useFaucet();
  const [runConfetti, setRunConfetti] = useState(false);
  const [karrotDescription, setKarrotDescription] = useState<string>("");
  const [captchaCode, setCaptchaCode] = useState<string | null>(null);
  const [mintingProgress, setMintingProgress] = useState<MintState>("not-started");
  const [isMinting, setIsMinting] = useState(false);
  const { width: windowWidth } = useWindowSize();
  const { mutate: generateImage, data: spiritKarrot, isPending: isSpiritKarrotLoading } = useGenerateImage();
  const { mutate: claimFunds, isPending: isClaimingFunds } = useClaimFunds();
  const { mutate: toggleEligibility } = useToggleEligibility();
  const { data: walletBalance } = useWalletBalance({
    chain: KAKAROT_SEPOLIA,
    address: wallet?.address as string,
    client,
  });

  const queryClient = useQueryClient();
  const proof: string[] | undefined = queryClient.getQueryData(["isEligible", wallet?.address]);

  const karrotName = karrotDescription.split(" ")[0].replace(/,/g, "");
  const image = spiritKarrot?.imageUrl ?? "/assets/kakarot-og.png";

  if (!proof) redirect("/");

  const onTurnstileSuccess = (captchaCode: string) => {
    setCaptchaCode(captchaCode);
  };

  const generateTweet = (karrotName: string, imageURI: string) => {
    return `🧑‍🌾 I'm a @KakarotZKEVM OG, and this is ${karrotName}, the Spirit Karrot that tells the story of my journey on Kakarot Testnet, now in its final mile before mainnet.
💧 Get the drip and join me on Kakarot Starknet Sepolia
`;
  };

  const generateIntent = (tweet: string, imageUrl: string) => {
    return `https://x.com/intent/post?text=${encodeURIComponent(
      tweet
    )}&url=https://sepolia-faucet.kakarot.org/api/?ipfsUrl=${imageUrl}`;
  };

  const handleMintTransaction = async () => {
    if (!wallet || !proof || !spiritKarrot) return;
    try {
      const uris = await upload({
        client,
        files: [
          {
            name: karrotName,
            properties: spiritKarrot.walletProperties,
            description: karrotDescription,
            image: spiritKarrot.imageUrl,
          },
        ],
      });

      const contract = getContract({
        client,
        address: KAKAROT_CONTRACT_ADDRESS,
        chain: KAKAROT_SEPOLIA,
      });

      const transaction = prepareContractCall({
        contract,
        method: "function mint(bytes32[] calldata _merkleProof, string memory _tokenUri)",
        params: [proof, uris] as any,
      });

      const result = await sendTransaction({
        transaction,
        account: wallet,
      });

      toggleEligibility({ walletAddress: wallet.address });
      toast.success("Minted successfully!");
      setIsMinting(false);

      const tweet = generateTweet(karrotName, uris);
      const intent = generateIntent(tweet, uris);
      window.open(intent);
      window.location.reload();
    } catch (error) {
      toast.error("An error occurred while minting. Please try again.");
      setIsMinting(false);
    }
  };

  const handleClaim = () => {
    if (!wallet?.address || !captchaCode) return;

    claimFunds(
      { walletAddress: wallet.address, captchaCode, denomination: "eth" },
      {
        onSuccess: () => {
          toast.success("Claimed ETH, minting now ...");
          handleMintTransaction();
        },
        onError: (error) => {
          console.error("Error claiming funds, check if you have enough mainnet ETH!", error);
          toast.error("An error occurred while claiming funds. Check if you have enough mainnet ETH. Then try again!");
          setMintingProgress("not-started");
          setKarrotDescription("");
        },
      }
    );
  };

  const mintKarrot = async () => {
    if (!wallet || !captchaCode) return;

    try {
      // Check if user needs to claim funds
      setIsMinting(true);
      const balance = Number(walletBalance?.displayValue);
      const dripAmount = 0.05;
      if (balance < dripAmount) {
        handleClaim();
      } else {
        handleMintTransaction();
      }
    } catch (error) {
      console.error("Error minting Karrot:", error);
      toast.error("An error occurred during the minting process. Please try again.");
      setMintingProgress("not-started");
      setIsMinting(false);
    }
  };

  const generateSpiritKarrot = async () => {
    if (!wallet) return;
    setMintingProgress("generating");
    generateImage(
      { address: wallet.address },
      {
        onSuccess: async (data) => {
          setMintingProgress("completed");
          setRunConfetti(true);
          setKarrotDescription(data.description ?? "");
          toast.success("Karrot Summoned Successfully!");
        },
        onError: (error) => {
          console.error("Error generating image:", error);
          toast.error("An error occurred while generating your Spirit Karrot. Please try again.");
          setMintingProgress("not-started");
        },
      }
    );
  };

  return (
    <div className="flex flex-col justify-center items-center w-full py-16 px-3 rounded-md">
      <Turnstile
        siteKey={ENV.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={onTurnstileSuccess}
        options={{ size: "invisible" }}
      />
      <Confetti colors={CONFETTI_COLORS} run={runConfetti} numberOfPieces={800} recycle={false} width={windowWidth} />

      <HeaderSection mintStatus={mintingProgress} karrotName={karrotName} />
      <KarrotImage image={image} mintStatus={mintingProgress} />

      {karrotDescription && (
        <p className="text-center text-sm text-[#878794] max-w-[400px] mt-4">{karrotDescription}</p>
      )}

      <ActionButton
        mintKarrot={mintKarrot}
        minting={isMinting}
        mintingProgress={mintingProgress}
        onMintClick={generateSpiritKarrot}
        isDisabled={isClaimingFunds || isSpiritKarrotLoading || !captchaCode}
      />
    </div>
  );
};

const HeaderSection = ({ mintStatus, karrotName }: { mintStatus: MintState; karrotName: string }) => (
  <div className="flex flex-col justify-center items-center text-center max-w-xl">
    <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight md:leading-[3rem] lg:text-[52px]">
      {mintStatus === "completed" ? `${karrotName} - Spirit Karrot 🥕` : "Time to meet your Spirit Karrot 🥕"}
    </h1>
    <p className="leading-7 [&:not(:first-child)]:mt-6  text-[#878794]">
      {mintStatus === "completed"
        ? "Welcome to Kakarot Starknet Sepolia! 🎉"
        : "It represents all the activity you had on our older testnet. "}
    </p>
  </div>
);

const KarrotImage = ({ image, mintStatus }: { image: string; mintStatus: MintState }) => (
  <div className="grid items-start justify-center mt-12">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5585f1] via-[#eba1f9] to-[#9192f8] rounded-md blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <MediaRenderer
        width="400px"
        height="400px"
        src={mintStatus === "not-started" ? "/assets/kakarot-og.png" : image}
        client={client}
        className="relative rounded-md leading-none flex items-center divide-x divide-gray-600"
        alt="Spirit Karrot"
      />
    </div>
  </div>
);

const ActionButton = ({
  mintingProgress,
  onMintClick,
  isDisabled,
  mintKarrot,
  minting,
}: {
  mintingProgress: MintState;
  onMintClick: () => void;
  isDisabled: boolean;
  mintKarrot: () => void;
  minting: boolean;
}) => {
  switch (mintingProgress) {
    case "not-started":
      return (
        <Button
          variant="main"
          className="mt-4 md:mt-8 w-full max-w-[400px]"
          onClick={onMintClick}
          disabled={isDisabled}
        >
          Meet the Karrot
        </Button>
      );
    case "generating":
    case "pending":
      return (
        <Button variant="outline" className="mt-4 w-full max-w-[400px] text-[#878794] pointer-events-none">
          <Image src={mintingIcon} alt="minting" width={24} height={24} priority className="w-[30px] h-6 mr-3" />
          <span>Kreating your Karrot</span>
        </Button>
      );
    case "completed":
      return (
        <div className="flex w-full space-x-3  max-w-[400px]">
          {/* <Link rel="noopener noreferrer" target="_blank" href={INTENT} className="w-full"> */}
          <Button
            variant="outline"
            className="mt-4 w-full gap-1 !bg-black !text-white"
            onClick={mintKarrot}
            disabled={minting}
          >
            <span>Share on</span>
            <Image src={xIcon} alt="minting" width={20} height={20} priority />
            to mint this NFT
          </Button>
          {/* </Link> */}
          <Link href={"/faucet"} className="w-full">
            <Button variant="outline" className="mt-4 w-full text-[#878794] gap-1">
              <span>Go To Faucet</span>
              <Image src={linkIcon} alt="minting" width={20} height={20} priority />
            </Button>
          </Link>
        </div>
      );
  }
};

export default SpiritKarrot;
