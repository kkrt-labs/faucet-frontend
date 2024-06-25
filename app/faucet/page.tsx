"use client";

import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBlockNumber, useWalletBalance } from "thirdweb/react";
import { toast } from "sonner";

import { KAKAROT_SEPOLIA, client } from "@/lib/thirdweb-client";
import { CONFETTI_COLORS, KKRT_EXPLORER } from "@/lib/constants";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useFaucet } from "@/hooks/useFaucet";
import { useFaucetJob } from "@/queries/useFaucetJob";
import { useClaimFunds } from "@/mutations/useClaimFunds";
import { FaucetClaim } from "@/components/faucet-claim";
import { FaucetSuccess } from "@/components/faucet-success";
import { TextPair } from "@/components/text-pair";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Faucet() {
  const { wallet, faucetStats, faucetBalance, refetchFaucet, isFaucetLoading } = useFaucet();
  const { width: windowWidth } = useWindowSize();

  const blockNumber = useBlockNumber({ client, chain: KAKAROT_SEPOLIA });
  const router = useRouter();
  const { mutate: claimFunds, isPending, data: claimJobID } = useClaimFunds();
  const { data: faucetJob, isError } = useFaucetJob(claimJobID?.jobID ?? "");
  const { refetch: refetchWallet } = useWalletBalance({
    chain: KAKAROT_SEPOLIA,
    address: wallet?.address as string,
    client,
  });

  const [isProcessing, setIsProcessing] = useState(isPending);
  const [isClaimed, setIsClaimed] = useState(false);

  const available = `${faucetStats?.dripAmountInEth ?? 0.001} ETH`;
  const isCooldown = !!faucetStats && (faucetStats?.timeLeftInS !== 0 || faucetStats?.canClaim === false);

  const handleClaim = () => {
    setIsProcessing(true);
    claimFunds({ walletAddress: wallet?.address as string });
  };

  const runSuccessToast = (txHash: string) =>
    toast.message(
      <div className="flex flex-row justify-around w-full">
        <div className="flex flex-col w-full">
          <span className="text-black">Transaction Successful</span>
          <span className="w-full text-[#666D80]">
            You have successfully claimed {faucetStats?.dripAmountInEth} ETH on Kakarot Sepolia.
          </span>
        </div>
        <span className="h-20 w-[2px] bg-slate-100 -my-4"></span>
        <a
          className="text-[#f54400] flex flex-row items-center space-x-2 text-nowrap p-2"
          href={`${KKRT_EXPLORER}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="">View on Explorer</span>
          <Image src="/assets/link-icon.svg" alt="Docs" width={16} height={16} />
        </a>
      </div>
    );

  useEffect(() => {
    if (faucetJob && faucetJob[0].status === "completed") {
      runSuccessToast(faucetJob[0].transaction_hash);
      setIsProcessing(false);
      setIsClaimed(true);
      refetchFaucet();
      refetchWallet();
    }
  }, [faucetJob, refetchFaucet, refetchWallet]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to claim funds. Please try again later.");
      setIsProcessing(false);
    }
  }, [isError]);

  if (!wallet) router.replace("/");
  if (isFaucetLoading) return <SkeletonLoader />;

  return (
    <main className="flex flex-col items-center mt-10 h-full">
      <div className="flex flex-col bg-white w-full py-6 px-3 sm:px-10 lg:px-20 rounded-md mb-12">
        <Confetti
          colors={CONFETTI_COLORS}
          run={isClaimed}
          numberOfPieces={500}
          recycle={false}
          width={windowWidth}
          hidden={!isClaimed}
        />
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between">
          <DetailAndText title="Faucet Balance" text={`${faucetBalance?.faucetBalanceInEth.substring(0, 6) ?? 0}ETH`} />
          <DetailAndText title="Block Number" text={blockNumber?.toString() ?? "0x"} />
        </div>
        {isClaimed ? (
          <FaucetSuccess
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

const DetailAndText = ({ title, text }: { title: string; text: string }) => (
  <h4 className="text-[#878794] faucetDetails px-3 py-2 rounded-sm">
    {title}: <span className="text-[#f54400]">{text}</span>
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
