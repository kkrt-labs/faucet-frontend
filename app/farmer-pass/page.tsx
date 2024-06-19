"use client";

import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useRedeemCode } from "@/mutations/useRedeemCode";
import { useInviteCodeJob } from "@/queries/useInviteCodeJob";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useFaucet } from "@/hooks/useFaucet";
import { SkeletonLoading } from "@/components/skeleton-loading";
import { Button } from "@/components/ui/button";
import { CONFETTI_COLORS, INTENT } from "@/lib/constants";

import ogPass from "@/public/assets/og-pass.png";
import mintingIcon from "@/public/assets/mining.gif";
import linkIcon from "@/public/assets/link-icon.svg";
import xIcon from "@/public/assets/x-icon-inverted.svg";

type MintState = "completed" | "pending" | "error" | "not-started";

interface RedeemInviteCodeData {
  inviteCode: string;
  isClaimed: boolean;
  isValidInviteCode: boolean;
}

export default function FarmerPass() {
  const { isFaucetLoading, wallet } = useFaucet();
  const queryClient = useQueryClient();
  const redeemCodeResult: RedeemInviteCodeData | undefined = queryClient.getQueryData(["redeemCodeData"]);

  const [runConfetti, setRunConfetti] = useState(false);
  const [mintingProgress, setMintingProgress] = useState<MintState>("not-started");

  const { width: windowWidth } = useWindowSize();
  const { mutate: redeemCodeMutation, isError, data: redeemCodeID } = useRedeemCode();
  const { data: inviteCodeJob } = useInviteCodeJob(redeemCodeID?.jobID ?? "");

  const handleClaim = () => {
    if (!wallet) return;
    redeemCodeMutation({ inviteCode: redeemCodeResult?.inviteCode ?? "", walletAddress: wallet.address });
    setMintingProgress("pending");
  };

  const errorToast = () => toast.error("Uh oh, something went wrong. Please try again.");

  useEffect(() => {
    if (inviteCodeJob && inviteCodeJob[0].status === "completed") {
      setMintingProgress("completed");
      setRunConfetti(true);
    }
  }, [inviteCodeJob]);

  useEffect(() => {
    if (isError) {
      errorToast();
      setMintingProgress("not-started");
    }
  }, [isError]);

  if (isFaucetLoading) return <SkeletonLoading />;
  else if (!redeemCodeResult) redirect("/");

  return (
    <div className="flex flex-col justify-center items-center w-full py-16 px-3 rounded-md mb-10 h-svh">
      <Confetti colors={CONFETTI_COLORS} run={runConfetti} numberOfPieces={500} recycle={false} width={windowWidth} />
      <div className="flex flex-col justify-center items-center text-center max-w-xl">
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight md:leading-[3rem] lg:text-[52px]">
          {mintingProgress === "completed" ? "Congratulations 🚀 " : "Claim your Early Farmer 👨‍🌾 Pass"}
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6  text-[#878794]">
          {mintingProgress === "completed" ? (
            "You have successfully claimed your Early Farmer 👨‍🌾 Pass, do take a moment to share this on your twitter 🥕"
          ) : (
            <>
              Welcome to Kakarot&apos;s Sepolia testnet phase. <br /> To commemorate this event, claim the Early Farmer
              Pass by KKRT Labs.
            </>
          )}
        </p>

        <div className="grid items-start justify-center mt-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5585f1] via-[#eba1f9] to-[#9192f8] rounded-md blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Image
              className="relative rounded-md leading-none flex items-center divide-x divide-gray-600"
              src={ogPass}
              width={400}
              height={400}
              alt="Free Pass"
            />
          </div>
        </div>

        {mintingProgress === "not-started" && (
          <Button variant="main" className="mt-4 md:mt-8 w-full max-w-[400px]" onClick={handleClaim}>
            Claim your Pass
          </Button>
        )}

        {mintingProgress === "pending" && (
          <Button variant="outline" className="mt-4 w-full max-w-[400px] text-[#878794] pointer-events-none">
            <Image src={mintingIcon} alt="minting" width={24} height={24} priority className="w-[30px] h-6 mr-3" />
            <span>Minting in Progress</span>
          </Button>
        )}

        {mintingProgress === "completed" && (
          <div className="flex w-full space-x-3  max-w-[400px]">
            {/* <Button variant="success" className="mt-4 w-full">
              Claimed
            </Button> */}
            <Link rel="noopener noreferrer" target="_blank" href={INTENT} className="w-full">
              <Button variant="outline" className="mt-4 w-full gap-1 !bg-black !text-white">
                <span>Share on</span>
                <Image src={xIcon} alt="minting" width={20} height={20} priority />
              </Button>
            </Link>
            <Link href="/faucet" className="w-full">
              <Button variant="outline" className="mt-4 w-full text-[#878794] gap-1">
                <span>Go To Faucet</span>
                <Image src={linkIcon} alt="minting" width={20} height={20} priority />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
