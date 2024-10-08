"use client";

import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { redirect } from "next/navigation";
import { useState } from "react";

import { getContract, prepareContractCall, sendTransaction } from "thirdweb";

import { KAKAROT_SEPOLIA } from "@/lib/thirdweb-client";

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

type MintState = "completed" | "pending" | "generating" | "not-started";

const SpiritKarrot = () => {
  const { wallet } = useFaucet();
  const [runConfetti, setRunConfetti] = useState(false);
  const [captchaCode, setCaptchaCode] = useState<string | null>(null);
  const [mintingProgress, setMintingProgress] = useState<MintState>("not-started");

  const { width: windowWidth } = useWindowSize();
  const { mutate: generateImage, data: spiritKarrot, isPending: isSpiritKarrotLoading } = useGenerateImage();
  const { mutate: claimFunds, isPending: isClaimingFunds } = useClaimFunds();

  const queryClient = useQueryClient();
  const proof: string[] | undefined = queryClient.getQueryData(["isEligible", wallet?.address]);
  const image = !spiritKarrot ? "/assets/carrot-limit.svg" : spiritKarrot?.image.data[0].url ?? "";

  const onTurnstileSuccess = (captchaCode: string) => {
    setCaptchaCode(captchaCode);
  };

  const assignMintStateToDescription = (mintState: MintState) => {
    if (mintingProgress === "completed") return "🚀 Your Spirit Karrot Is Ready";
    if (mintingProgress === "pending") return "⏳ Claiming Some ETH";
    if (mintingProgress === "generating") return "🔄 Generating Your Spirit Karrot";
    return "";
  };

  const mintKarrot = async () => {
    // const contract = getContract({
    //   client,
    //   address: KAKAROT_CONTRACT_ADDRESS,
    //   chain: KAKAROT_SEPOLIA,
    // });

    // console.log(proof, contract);
    // const transaction = prepareContractCall({
    //   contract,
    //   method: "function mint(bytes32[] calldata _merkleProof)",
    //   params: proof as any,
    // });
    // console.log(transaction);

    // const result = await sendTransaction({
    //   transaction,
    //   account: wallet,
    // });

    // console.log(result);
    if (!wallet || !captchaCode) return;
    setMintingProgress("generating");

    generateImage(
      {
        address: wallet?.address ?? "",
      },
      {
        onSuccess: () => {
          setMintingProgress("pending");
          handleClaim();
        },
      }
    );
  };

  const handleClaim = () => {
    claimFunds(
      { walletAddress: wallet?.address ?? "", captchaCode: captchaCode ?? "", denomination: "eth" },
      {
        onSettled: () => {
          setMintingProgress("completed");
          setRunConfetti(true);
        },
      }
    );
  };

  if (!proof) redirect("/faucet");

  return (
    <div className="flex flex-col justify-center items-center w-full py-16 px-3 rounded-md mb-10">
      <Turnstile
        siteKey={ENV.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={onTurnstileSuccess}
        options={{
          size: "invisible",
        }}
      />
      <Confetti colors={CONFETTI_COLORS} run={runConfetti} numberOfPieces={500} recycle={false} width={windowWidth} />
      <div className="flex flex-col justify-center items-center text-center max-w-xl">
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight md:leading-[3rem] lg:text-[52px]">
          Claim Spirit Kakarot 🥕
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6  text-[#878794]">
          Welcome to Kakarot Starket Sepolia. <br /> To commemorate this event, claim your Spirit Karrot.
        </p>
      </div>
      <div className="grid items-start justify-center mt-12">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5585f1] via-[#eba1f9] to-[#9192f8] rounded-md blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <img
            className="relative rounded-md leading-none flex items-center divide-x divide-gray-600"
            src={image}
            width={400}
            height={400}
            alt="Free Pass"
          />
        </div>
      </div>
      <p className="text-center text-sm text-[#878794] max-w-[400px] mt-4">
        {assignMintStateToDescription(mintingProgress)}
      </p>

      {mintingProgress === "not-started" && (
        <Button
          variant="main"
          className="mt-4 md:mt-8 w-full max-w-[400px]"
          onClick={mintKarrot}
          disabled={isClaimingFunds || isSpiritKarrotLoading || !captchaCode}
        >
          Meet the Kakarot
        </Button>
      )}

      {(mintingProgress === "generating" || mintingProgress === "pending") && (
        <Button variant="outline" className="mt-4 w-full max-w-[400px] text-[#878794] pointer-events-none">
          <Image src={mintingIcon} alt="minting" width={24} height={24} priority className="w-[30px] h-6 mr-3" />
          <span>Minting in Progress</span>
        </Button>
      )}

      {mintingProgress === "completed" && (
        <div className="flex w-full space-x-3  max-w-[400px]">
          <Link rel="noopener noreferrer" target="_blank" href={INTENT} className="w-full">
            <Button variant="outline" className="mt-4 w-full gap-1 !bg-black !text-white">
              <span>Share on</span>
              <Image src={xIcon} alt="minting" width={20} height={20} priority />
            </Button>
          </Link>
          <Link href={"/faucet"} className="w-full">
            <Button variant="outline" className="mt-4 w-full text-[#878794] gap-1" onClick={() => redirect("/faucet")}>
              <span>Go To Faucet</span>
              <Image src={linkIcon} alt="minting" width={20} height={20} priority />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SpiritKarrot;
