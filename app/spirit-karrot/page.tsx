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

  const image = spiritKarrot?.imageUrl ?? "/assets/kakarot-og.png";

  if (!proof) redirect("/");

  const onTurnstileSuccess = (captchaCode: string) => {
    setCaptchaCode(captchaCode);
  };

  const getMintStateDescription = () => {
    switch (mintingProgress) {
      case "completed":
        return "";
      case "pending":
        return "⏳ Claiming Some ETH";
      case "generating":
        return "🔄 Generating Your Spirit Karrot";
      default:
        return "";
    }
  };

  const handleMintTransaction = async (tokenUri: string) => {
    console.log(proof, tokenUri, "proof, tokenUri");
    if (!wallet || !proof || !tokenUri) return;

    try {
      const contract = getContract({
        client,
        address: KAKAROT_CONTRACT_ADDRESS,
        chain: KAKAROT_SEPOLIA,
      });

      const transaction = prepareContractCall({
        contract,
        method: "function mint(bytes32[] calldata _merkleProof, string memory _tokenUri)",
        params: [proof, tokenUri] as any,
      });

      await sendTransaction({
        transaction,
        account: wallet,
      });
      setRunConfetti(true);
      setMintingProgress("completed");
      toggleEligibility({ walletAddress: wallet.address });
      toast.success("Minted successfully!");
    } catch (error) {
      console.error("Error during minting transaction:", error);
      toast.error("An error occurred while minting. Please try again.");
      setMintingProgress("not-started");
    }
  };

  const handleGenerateImage = async () => {
    generateImage(
      { address: wallet?.address ?? "" },
      {
        onSuccess: async (data) => {
          setKarrotDescription(data.description ?? "");

          try {
            const uris = await upload({
              client,
              files: [
                {
                  name: data.description?.split(" ")[0] ?? "",
                  properties: data.walletProperties,
                  description: data.description,
                  image: data.imageUrl,
                },
              ],
            });

            setMintingProgress("pending");
            handleMintTransaction(uris);
          } catch (error) {
            console.error("Error uploading to IPFS:", error);
            toast.error("An error occurred while uploading metadata. Please try again.");
            setMintingProgress("not-started");
          }
        },
        onError: (error) => {
          console.error("Error generating image:", error);
          toast.error("An error occurred while generating the image. Please try again.");
          setMintingProgress("not-started");
        },
      }
    );
  };

  const handleClaim = () => {
    if (!wallet?.address || !captchaCode) return;

    claimFunds(
      { walletAddress: wallet.address, captchaCode, denomination: "eth" },
      {
        onSuccess: () => {
          setMintingProgress("generating");
          handleGenerateImage();
        },
        onError: (error) => {
          console.error("Error claiming funds:", error);
          toast.error("An error occurred while claiming funds. Please try again.");
          setMintingProgress("not-started");
        },
      }
    );
  };

  const mintKarrot = async () => {
    if (!wallet || !captchaCode) return;

    try {
      setMintingProgress("pending");
      // Check if user needs to claim funds
      const balance = Number(walletBalance?.displayValue);
      const dripAmount = 0.001;
      if (balance < dripAmount) {
        handleClaim();
      } else {
        setMintingProgress("generating");
        handleGenerateImage();
      }
    } catch (error) {
      console.error("Error minting Karrot:", error);
      toast.error("An error occurred during the minting process. Please try again.");
      setMintingProgress("not-started");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full py-16 px-3 rounded-md">
      <Turnstile
        siteKey={ENV.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={onTurnstileSuccess}
        options={{ size: "invisible" }}
      />
      <Confetti colors={CONFETTI_COLORS} run={runConfetti} numberOfPieces={800} recycle={false} width={windowWidth} />

      <HeaderSection mintStatus={mintingProgress} />
      <KarrotImage image={image} mintStatus={mintingProgress} />

      <p className="text-center text-sm text-[#878794] max-w-[400px] mt-4">
        {karrotDescription && mintingProgress === "completed" ? karrotDescription : getMintStateDescription()}
      </p>

      <ActionButton
        mintingProgress={mintingProgress}
        onMintClick={mintKarrot}
        isDisabled={isClaimingFunds || isSpiritKarrotLoading || !captchaCode}
      />
    </div>
  );
};

const HeaderSection = ({ mintStatus }: { mintStatus: MintState }) => (
  <div className="flex flex-col justify-center items-center text-center max-w-xl">
    <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight md:leading-[3rem] lg:text-[52px]">
      {mintStatus === "completed" ? "Congratulations 🚀" : "Claim Spirit Kakarot 🥕"}
    </h1>
    <p className="leading-7 [&:not(:first-child)]:mt-6  text-[#878794]">
      {mintStatus === "completed"
        ? "Welcome to Kakarot Starknet Sepolia! 🎉"
        : "To commemorate this special event, claim your unique Spirit Karrot NFT."}
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
}: {
  mintingProgress: MintState;
  onMintClick: () => void;
  isDisabled: boolean;
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
          Meet the Kakarot
        </Button>
      );
    case "generating":
    case "pending":
      return (
        <Button variant="outline" className="mt-4 w-full max-w-[400px] text-[#878794] pointer-events-none">
          <Image src={mintingIcon} alt="minting" width={24} height={24} priority className="w-[30px] h-6 mr-3" />
          <span>Minting in Progress</span>
        </Button>
      );
    case "completed":
      return (
        <div className="flex w-full space-x-3  max-w-[400px]">
          <Link rel="noopener noreferrer" target="_blank" href={INTENT} className="w-full">
            <Button variant="outline" className="mt-4 w-full gap-1 !bg-black !text-white">
              <span>Share on</span>
              <Image src={xIcon} alt="minting" width={20} height={20} priority />
            </Button>
          </Link>
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
