import Image from "next/image";
import { useActiveAccount, useBlockNumber } from "thirdweb/react";
import { ethereum } from "thirdweb/chains";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";

import { client } from "@/lib/thirdweb-client";
import { cn } from "@/lib/utils";
import { useFaucetJob } from "@/queries/useFaucetJob";
import { useFaucetStats } from "@/queries/useFaucetStats";
import { useClaimFunds } from "@/mutations/useClaimFunds";
import { TextPair } from "@/components/text-pair";
import { Button } from "@/components/ui/button";

import cooldownCarrot from "@/public/assets/cooldown-carrot.svg";

export const Faucet = () => {
  const wallet = useActiveAccount();

  const { mutate: claimFunds, isPending, data: claimJobID } = useClaimFunds();
  const { data: faucetJob } = useFaucetJob(claimJobID?.jobID ?? "");
  const { data: faucetStats } = useFaucetStats(wallet?.address as string);
  const blockNumber = useBlockNumber({ client, chain: ethereum });

  const available = `${faucetStats?.dripAmountInEth ?? 0} ETH`;
  const isProcessing = isPending || faucetJob?.[0]?.status === "completed" || faucetStats?.canClaim === false;

  const handleClaim = () => {
    claimFunds(
      { walletAddress: wallet?.address as string },
      {
        onSuccess: () => toast.success("ETH claimed successfully!"),
      }
    );
  };

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
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between">
          <DetailAndText title="Facuet Balance" text="973 ETH" />
          <DetailAndText title="Block Number" text={blockNumber?.toString() ?? "0x"} />
        </div>
        <div className="flex flex-col justify-center items-center my-16 sm:my-24">
          <div className="w-full sm:w-fit text-center flex flex-col justify-center items-center">
            {isProcessing ? (
              <Image src={cooldownCarrot} alt="Cooldown Carrot" />
            ) : (
              <h2 className="text-5xl md:text-7xl leading-tight text-[#878794]">{available}</h2>
            )}
            <Button
              onClick={handleClaim}
              variant={isProcessing ? "cooldown" : "main"}
              className={cn("mt-6 w-full", isProcessing && "pointer-events-none")}
            >
              {isProcessing ? "Cooldown" : "Claim"}
            </Button>
            {isProcessing && (
              <div className="flex flex-row items-center justify-center my-4">
                <InfoIcon className="mt-4 ml-2 h-5 w-5 shrink-0 text-[#8E98A8]" />
                <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] max-w-[300px]">
                  You&apos;re on a cooldown period! Try the Kakarot faucet again in {faucetStats?.timeLeftInS} seconds.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <TextPair
        heading="Need more testnet ETH?"
        description="Reach out to us @Kakarot Discord and raise a ticket if you need large amount of testnet ETH."
      />
      <Button className="space-x-2 max-w-[120px] mt-6" variant="outline" size="withIcon">
        <span>Reach Out</span>
        <Image src="/assets/link-icon.svg" alt="Docs" width={16} height={16} />
      </Button>
    </main>
  );
};

const DetailAndText = ({ title, text }: { title: string; text: string }) => (
  <h4 className="text-[#878794] faucetDetails px-3 py-2 rounded-sm">
    {title}: <span className="text-[#f54400]">{text}</span>
  </h4>
);
