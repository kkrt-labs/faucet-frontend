import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useActiveAccount, useBlockNumber, useWalletBalance } from "thirdweb/react";
import { toast } from "sonner";

import { KAKAROT_SEPOLIA, client } from "@/lib/thirdweb-client";
import { CONFETTI_COLORS } from "@/lib/constants";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useFaucetJob } from "@/queries/useFaucetJob";
import { useFaucetStats } from "@/queries/useFaucetStats";
import { useFaucetBalance } from "@/queries/useFaucetBalance";
import { useClaimFunds } from "@/mutations/useClaimFunds";
import { FaucetClaim } from "@/components/faucet-claim";
import { FaucetSuccess } from "@/components/faucet-success";
import { TextPair } from "@/components/text-pair";
import { Button } from "@/components/ui/button";

export const Faucet = () => {
  const wallet = useActiveAccount();

  const { mutate: claimFunds, isPending, data: claimJobID } = useClaimFunds();
  const { data: faucetJob, isError } = useFaucetJob(claimJobID?.jobID ?? "");
  const { data: faucetStats } = useFaucetStats(wallet?.address as string);
  const { data: faucetBalance, refetch: refetchFaucet } = useFaucetBalance();
  const { width: windowWidth } = useWindowSize();
  const { refetch: refetchWallet } = useWalletBalance({
    chain: KAKAROT_SEPOLIA,
    address: wallet?.address as string,
    client,
  });

  const [isProcessing, setIsProcessing] = useState(isPending);
  const [isClaimed, setIsClaimed] = useState(false);

  const blockNumber = useBlockNumber({ client, chain: KAKAROT_SEPOLIA });
  const available = `${faucetStats?.dripAmountInEth ?? 0.001} ETH`;

  const isCooldown = faucetStats?.timeLeftInS !== 0 || faucetStats?.canClaim === false;

  const handleClaim = () => {
    setIsProcessing(true);
    claimFunds({ walletAddress: wallet?.address as string });
  };

  useEffect(() => {
    if (faucetJob && faucetJob[0].status === "completed") {
      toast.success("Claimed successfully!");
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

  return (
    <main className="flex flex-col items-center">
      <div
        className="flex flex-col bg-white w-full py-6 px-3 sm:px-10 lg:px-20 rounded-md mb-12"
        style={{
          backgroundImage: `url("/assets/background.svg")`,
          backgroundSize: "cover",
          backgroundPosition: "right",
        }}
      >
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
          <FaucetSuccess navigateToClaim={() => setIsClaimed(false)} />
        ) : (
          <FaucetClaim
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
      <Link href="https://discord.gg/kakarotzkevm" rel="noopener noreferrer" target="_blank">
        <Button className="space-x-2 max-w-[120px] mt-6" variant="outline" size="withIcon">
          <span>Reach Out</span>
          <Image src="/assets/link-icon.svg" alt="Docs" width={16} height={16} />
        </Button>
      </Link>
    </main>
  );
};

const DetailAndText = ({ title, text }: { title: string; text: string }) => (
  <h4 className="text-[#878794] faucetDetails px-3 py-2 rounded-sm">
    {title}: <span className="text-[#f54400]">{text}</span>
  </h4>
);
