import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useRedeemCode } from "@/mutations/useRedeemCode";
import { useInviteCodeJob } from "@/queries/useInviteCodeJob";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Button } from "@/components/ui/button";

import dummyFreePass from "@/public/assets/dummy-free-pass.svg";
import mintingIcon from "@/public/assets/mining.gif";
import linkIcon from "@/public/assets/link-icon.svg";
import xIcon from "@/public/assets/x-icon-inverted.svg";

type MintState = "completed" | "pending" | "error" | "not-started";

interface RedeemInviteCodeData {
  inviteCode: string;
  isClaimed: boolean;
  isValidInviteCode: boolean;
}

const CONFETTI_COLORS = ["#FDA829", "#F6F5FC", "#FF2828"];

export const FreePass = ({ shouldGoToFaucet }: { shouldGoToFaucet: () => void }) => {
  const queryClient = useQueryClient();
  const redeemCodeResult: RedeemInviteCodeData | undefined = queryClient.getQueryData(["redeemCodeData"]);

  const [runConfetti, setRunConfetti] = useState(false);
  const [mintingProgress, setMintingProgress] = useState<MintState>("not-started");

  const { width: windowWidth } = useWindowSize();
  const { mutate: redeemCodeMutation, isError, data: redeemCodeID } = useRedeemCode();
  const { data: inviteCodeJob } = useInviteCodeJob(redeemCodeID?.jobID ?? "");

  const wallet = useActiveAccount();

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

  return (
    <div
      className="flex flex-col justify-center items-center bg-white w-full py-16 px-3 rounded-md mb-10"
      style={{
        backgroundImage: `url("/assets/background.svg")`,
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      <Confetti colors={CONFETTI_COLORS} run={runConfetti} numberOfPieces={500} recycle={false} width={windowWidth} />
      <div className="flex flex-col justify-center items-center text-center max-w-xl">
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight lg:text-[52px]">
          {mintingProgress === "completed" ? "Congratulations 🚀 " : "Claim your OG Pass"}
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6  text-[#878794]">
          {mintingProgress === "completed" ? (
            "You have successfully claimed your OG Pass, do take a moment to share this on your twitter 🥕"
          ) : (
            <>
              Welcome to Kakarot&apos;s Sepolia testnet phase to commemorate this event. <br />
              Claim your OG Pass by KKRT Labs.
            </>
          )}
        </p>
        <Image src={dummyFreePass} width={400} height={400} alt="Free Pass" className="mt-12" />

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
            <Link rel="noopener noreferrer" target="_blank" href="https://x.com/intent/post" className="w-full">
              <Button variant="outline" className="mt-4 w-full gap-1 !bg-black !text-white">
                <span>Share on</span>
                <Image src={xIcon} alt="minting" width={20} height={20} priority />
              </Button>
            </Link>
            <Button variant="outline" className="mt-4 w-full text-[#878794] gap-1" onClick={shouldGoToFaucet}>
              <span>Go To Faucet</span>
              <Image src={linkIcon} alt="minting" width={20} height={20} priority />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
