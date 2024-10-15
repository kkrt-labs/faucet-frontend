"use client";

import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { useEffect, useMemo, useState } from "react";
import { getContract, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
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
import { useFaucetJob } from "@/queries/useFaucetJob";
import { abi as AirdropNFTABI } from "@/lib/nftAirdropABI";
import React, { useCallback } from 'react';

type MintState = "completed" | "pending" | "generating" | "not-started";

const generateTweet = (karrotName: string, imageURI: string) => {
  console.log("imageURI", imageURI);
  return `🧑‍🌾 I'm a @KakarotZKEVM OG, and this is ${karrotName}, the Spirit Karrot that tells the story of my journey on Kakarot Testnet, now in its final mile before mainnet. 💧 Get the drip and join me on Kakarot Starknet Sepolia`;
};

const generateIntent = (tweet: string, imageUrl: string) => {
  console.log("imageUrl", imageUrl);
  return `https://x.com/intent/post?text=${encodeURIComponent(
    tweet
  )}&url=${encodeURIComponent(`https://sepolia-faucet.kakarot.org/api/spirit-karrot?ipfsUrl=${imageUrl}`)}`;
};

const MeetKarrotButton: React.FC<{ onClick: () => void; isDisabled: boolean }> = ({ onClick, isDisabled }) => (
  <Button
    variant="main"
    className="mt-4 md:mt-8 w-full max-w-[400px]"
    onClick={onClick}
    disabled={isDisabled}
  >
    Meet the Karrot
  </Button>
);

const CreatingKarrotButton: React.FC = () => (
  <Button variant="outline" className="mt-4 w-full max-w-[400px] text-[#878794] pointer-events-none">
    <Image src={mintingIcon} alt="minting" width={24} height={24} priority className="w-[30px] h-6 mr-3" />
    <span>Kreating your Karrot</span>
  </Button>
);

const ShareOnXButton: React.FC<{ href: string; disabled: boolean }> = ({ href, disabled }) => (
  <Link rel="noopener noreferrer" target="_blank" href={href} className="w-full">
    <Button variant="outline" className="mt-4 w-full gap-1 !bg-black !text-white" disabled={disabled}>
      <span>Share on</span>
      <Image src={xIcon} alt="X icon" width={20} height={20} priority />
    </Button>
  </Link>
);

const MintNFTButton: React.FC<{ onClick: () => void; disabled: boolean }> = ({ onClick, disabled }) => (
  <Button
    variant="outline"
    className="mt-4 w-full gap-1 !bg-black !text-white"
    onClick={onClick}
    disabled={disabled}
  >
    <span>Mint NFT to share on </span>
    <Image src={xIcon} alt="X icon" width={20} height={20} priority />
  </Button>
);

const GoToFaucetButton: React.FC = () => (
  <Link href="/faucet" className="w-full">
    <Button variant="outline" className="mt-4 w-full text-[#878794] gap-1">
      <span>Go To Faucet</span>
      <Image src={linkIcon} alt="link icon" width={20} height={20} priority />
    </Button>
  </Link>
);

const ActionButton: React.FC<{
  mintingProgress: MintState;
  onMintClick: () => void;
  isDisabled: boolean;
  mintKarrot: () => void;
  minting: boolean;
  intent: string;
  canShareOnX: boolean;
}> = ({
  mintingProgress,
  onMintClick,
  isDisabled,
  mintKarrot,
  minting,
  intent,
  canShareOnX,
}) => {
  const handleMintClick = useCallback(() => {
    onMintClick();
  }, [onMintClick]);

  const handleMintKarrot = useCallback(() => {
    mintKarrot();
  }, [mintKarrot]);

  switch (mintingProgress) {
    case "not-started":
      return <MeetKarrotButton onClick={handleMintClick} isDisabled={isDisabled} />;
    case "generating":
    case "pending":
      return <CreatingKarrotButton />;
    case "completed":
      return (
        <div className="flex w-full space-x-3 max-w-[400px]">
          {canShareOnX && intent ? (
            <ShareOnXButton href={intent} disabled={minting} />
          ) : (
            <MintNFTButton onClick={handleMintKarrot} disabled={minting} />
          )}
          <GoToFaucetButton />
        </div>
      );
    default:
      return null;
  }
};

const SpiritKarrot = () => {
  const { wallet } = useFaucet();
  const [runConfetti, setRunConfetti] = useState(false);
  const [karrotDescription, setKarrotDescription] = useState<string>("");
  const [captchaCode, setCaptchaCode] = useState<string | null>(null);
  const [mintingProgress, setMintingProgress] = useState<MintState>("not-started");
  const [canShareOnX, setCanShareOnX] = useState(false);
  const [shareUri, setShareUri] = useState<string>("");
  const [imageIPFSUrl, setImageIPFSUrl] = useState<string>("");
  const [isMinting, setIsMinting] = useState(false);
  const { width: windowWidth } = useWindowSize();
  const { mutate: generateImage, data: spiritKarrot, isPending: isSpiritKarrotLoading } = useGenerateImage();
  const { mutate: claimFunds, isPending: isClaimingFunds } = useClaimFunds();
  const { mutate: toggleEligibility } = useToggleEligibility();
  const [jobId, setJobId] = useState<string>("");
  const { data: faucetJob, isError } = useFaucetJob(jobId);
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

  const tweet = useMemo(() => generateTweet(karrotName, shareUri), [karrotName, shareUri]);
const intent = useMemo(() => generateIntent(tweet, shareUri), [tweet, shareUri]);

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

      setShareUri(spiritKarrot.imageUrl);

      const contract = getContract({
        client,
        address: KAKAROT_CONTRACT_ADDRESS,
        chain: KAKAROT_SEPOLIA,
        abi: AirdropNFTABI as any,
      });

      const transaction = prepareContractCall({
        contract,
        method: "function mint(bytes32[] calldata _merkleProof, string memory _tokenUri)",
        params: [proof, uris] as any,
        maxFeePerBlobGas: BigInt(10000000000000),
        gas: BigInt(1000000),
      });

      const result = await sendTransaction({
        transaction,
        account: wallet,
      });

      console.log("transaction", result);
      console.log("transaction hash", result.transactionHash);

      const receipt = await waitForReceipt({
        client,
        chain: KAKAROT_SEPOLIA,
        transactionHash: result.transactionHash,
      });

      if (receipt.status === "success") {
        toggleEligibility({ walletAddress: wallet.address });
        toast.success("Minted successfully!");
        setIsMinting(false);
        setShareUri(spiritKarrot.imageUrl); // Make sure this is set to a valid URL
        setCanShareOnX(true); // Only set this to true after setShareUri
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error minting Karrot:", error);
      toast.error("An error occurred while minting. Please try again.");
      setIsMinting(false);
    }
  };

  const handleClaim = () => {
    if (!wallet?.address || !captchaCode) return;

    claimFunds(
      { walletAddress: wallet.address, captchaCode, denomination: "eth" },
      {
        onSuccess: (data) => {
          toast.info("Claiming some ETH to cover gas fees...");
          setJobId(data.jobID);
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
      const dripAmount = 0.001;
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

  useEffect(() => {
    if (faucetJob?.[0]?.status === "completed") {
      toast.success("Claimed ETH, minting now ...");
      handleMintTransaction();
    }
  }, [faucetJob]);

  useEffect(() => {
    if (isError || faucetJob?.[0]?.status === "error") {
      toast.error("An error occurred while claiming funds. Check if you have enough mainnet ETH. Then try again!");
      setMintingProgress("not-started");
      setIsMinting(false);
    }
  }, [isError, faucetJob]);

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
        mintingProgress={mintingProgress}
        onMintClick={generateSpiritKarrot}
        isDisabled={isClaimingFunds || isSpiritKarrotLoading || !captchaCode}
        mintKarrot={mintKarrot}
        minting={isMinting}
        intent={intent}
        canShareOnX={canShareOnX}
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
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5585f1] via-[#eba1f9] to-[#9192f8] rounded-md blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt max-h-[350px]"></div>
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

export default SpiritKarrot;
