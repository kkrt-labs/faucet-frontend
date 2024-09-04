"use client";

import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { useBlockNumber, useWalletBalance } from "thirdweb/react";
import { toast } from "sonner";

import { KAKAROT_SEPOLIA, client } from "@/lib/thirdweb-client";
import { CONFETTI_COLORS, KKRT_EXPLORER, RATE_LIMIT_KEY } from "@/lib/constants";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useFaucet } from "@/hooks/useFaucet";
import { useFaucetJob } from "@/queries/useFaucetJob";
import { useClaimFunds } from "@/mutations/useClaimFunds";
import { FaucetClaim } from "@/components/faucet-claim";
import { FaucetSuccess } from "@/components/faucet-success";
import { TextPair } from "@/components/text-pair";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Denomination } from "@/lib/types";

const LOCAL_STORAGE_KEY = "faucetJobStatusId";

export default function Faucet() {
  const { wallet, faucetStats, faucetBalance, refetchFaucet, isFaucetLoading, activeWallets } = useFaucet();
  const { width: windowWidth } = useWindowSize();

  const blockNumber = useBlockNumber({ client, chain: KAKAROT_SEPOLIA });
  const { mutate: claimFunds, isPending, data: claimJobID } = useClaimFunds();
  const { refetch: refetchWallet } = useWalletBalance({
    chain: KAKAROT_SEPOLIA,
    address: wallet?.address as string,
    client,
  });

  const [isProcessing, setIsProcessing] = useState(isPending);
  const [isClaimed, setIsClaimed] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [lastUsedDenomination, setLastUsedDenomination] = useState<Denomination>("eth");
  const { data: faucetJob, isError } = useFaucetJob(jobId ?? "");
  const processedJobRef = useRef<string | null>(null);

  const available = `${faucetStats?.dripAmountInEth ?? 0.001} ETH`;
  const isCooldown =
    !!faucetStats &&
    ((lastUsedDenomination === "eth" && (faucetStats.timeLeftETHInS !== 0 || !faucetStats.canClaimETH)) ||
      (lastUsedDenomination === "usdc" && (faucetStats.timeLeftUSDCInS !== 0 || !faucetStats.canClaimUSDC)) ||
      (lastUsedDenomination === "usdt" && (faucetStats.timeLeftUSDTInS !== 0 || !faucetStats.canClaimUSDT)));

  const handleClaim = (captchaCode: string, denomination: "eth" | "usdt" | "usdc") => {
    setIsProcessing(true);
    setLastUsedDenomination(denomination);
    claimFunds({ walletAddress: wallet?.address as string, captchaCode, denomination });
  };

  const runSuccessToast = useCallback(
    (txHash: string, denomination: Denomination) =>
      toast.message(
        <div className="flex flex-row justify-around w-full">
          <div className="flex flex-col w-full">
            <span className="text-black">Transaction Successful</span>
            <span className="w-full text-[#666D80]">
              You have successfully claimed{" "}
              {denomination === "eth" ? `${faucetStats?.dripAmountInEth} ETH` : `1 ${denomination.toUpperCase()}`} on
              Kakarot Sepolia.
            </span>
          </div>
          <span className="h-20 w-[2px] bg-slate-100 -my-4"></span>
          <a
            className="text-kkrtOrange flex flex-row items-center space-x-2 text-nowrap p-2"
            href={`${KKRT_EXPLORER}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="">View on Explorer</span>
            <Image src="/assets/link-icon.svg" alt="Docs" width={16} height={16} />
          </a>
        </div>
      ),
    [faucetStats]
  );

  useEffect(() => {
    const isRateLimited = localStorage.getItem(RATE_LIMIT_KEY);
    if (isRateLimited) redirect("/rate-limit");
  });

  useEffect(() => {
    if (claimJobID) {
      const currentJobId = claimJobID.jobID;
      localStorage.setItem(LOCAL_STORAGE_KEY, currentJobId);
      setJobId(currentJobId);
    }
  }, [claimJobID]);

  useEffect(() => {
    const savedJobId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedJobId && faucetJob) {
      const createdAt = new Date(faucetJob[0].created_at);
      const now = new Date();
      const diff = (now.getTime() - createdAt.getTime()) / 1000; // difference in seconds

      // 300 seconds === 5 minutes
      if (diff > 300) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } else {
      setJobId(savedJobId);
    }
  }, [faucetJob]);

  useEffect(() => {
    if (faucetJob && faucetJob[0].status === "completed" && faucetJob[0].job_id !== processedJobRef.current) {
      processedJobRef.current = faucetJob[0].job_id;
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      runSuccessToast(faucetJob[0].transaction_hash, lastUsedDenomination);
      setIsProcessing(false);
      setIsClaimed(true);
      refetchFaucet();
      refetchWallet();
    }
  }, [faucetJob, refetchFaucet, refetchWallet, runSuccessToast, lastUsedDenomination]);

  useEffect(() => {
    if (isError || faucetJob?.[0].status === "error") {
      toast.error("Failed to claim funds. Please try again later.");
      setIsProcessing(false);
    }
  }, [faucetJob, isError]);

  if (isFaucetLoading) return <SkeletonLoader />;
  if (!wallet || !activeWallets) redirect("/");

  return (
    <main className="flex flex-col items-center mt-10 h-full">
      <div className="flex flex-col bg-white w-full py-6 px-3 sm:px-10 lg:px-20 rounded-md mb-12 border border-[#2e2e342e]">
        <Confetti
          colors={CONFETTI_COLORS}
          run={isClaimed}
          numberOfPieces={500}
          recycle={false}
          width={windowWidth}
          hidden={!isClaimed}
        />
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between">
          <DetailAndText
            title={`Faucet Balance (${lastUsedDenomination.toUpperCase()})`}
            text={
              lastUsedDenomination === "eth"
                ? `${faucetBalance?.faucetBalanceInEth.substring(0, 6) ?? 0} ETH`
                : lastUsedDenomination === "usdc"
                ? `${faucetBalance?.usdcBalance.substring(0, 6) ?? 0} USDC`
                : `${faucetBalance?.usdtBalance.substring(0, 6) ?? 0} USDT`
            }
          />
          <DetailAndText title="Block Number" text={blockNumber?.toString() ?? "0x"} isBlock />
        </div>
        {isClaimed ? (
          <FaucetSuccess
            denomination={lastUsedDenomination}
            txHash={(faucetJob && faucetJob[0].transaction_hash) ?? ""}
            navigateToClaim={() => setIsClaimed(false)}
          />
        ) : (
          <FaucetClaim
            isOutOfFunds={
              parseFloat(faucetBalance?.faucetBalanceInEth ?? "0") < parseFloat(faucetStats?.dripAmountInEth ?? "0")
            }
            isCooldown={isCooldown}
            isProcessing={isProcessing}
            available={available}
            handleClaim={handleClaim}
            faucetStats={faucetStats}
            faucetJob={faucetJob}
            currentDenomination={lastUsedDenomination}
            setDenomination={setLastUsedDenomination}
          />
        )}
      </div>
      <TextPair
        heading="Need more testnet ETH?"
        description="Reach out to us on Discord and raise a ticket if you need large amount of testnet ETH."
      />
      <Link href="https://discord.gg/kakarotzkevm" rel="noopener noreferrer" target="_blank" className="pb-10">
        <Button className="space-x-2 max-w-[120px] mt-6" variant="outline" size="withIcon">
          <span>Reach Out</span>
          <Image src="/assets/link-icon.svg" alt="Docs" width={16} height={16} />
        </Button>
      </Link>
    </main>
  );
}

const DetailAndText = ({ title, text, isBlock = false }: { title: string; text: string; isBlock?: boolean }) => (
  <h4 className="text-[#878794] faucetDetails px-3 py-2 rounded-sm">
    {title}: <span className={cn(isBlock ? "text-[#0A846C]" : "text-kkrtOrange", "font-medium")}>{text}</span>
  </h4>
);

const SkeletonLoader = () => (
  <main className="flex flex-col items-center mt-10 h-[50svh]">
    <div className="flex flex-col bg-white w-full py-6 px-3 sm:px-10 lg:px-20 rounded-md mb-12">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between">
        <Skeleton className="w-full md:w-1/4 h-14 bg-slate-200 rounded-md" />
        <Skeleton className="w-full md:w-1/4 h-14 bg-slate-200 rounded-md" />
      </div>
      <div className="flex flex-col justify-center items-center pt-16">
        <Skeleton className="w-full md:w-2/5 h-16 bg-slate-200 rounded-md" />
        <Skeleton className="w-full md:w-2/5 h-12 bg-slate-200 rounded-md mt-4" />
      </div>
    </div>
  </main>
);
