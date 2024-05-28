import Image from "next/image";
import { useEffect, useState } from "react";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { ethereum } from "thirdweb/chains";

import { TextPair } from "@/components/text-pair";
import { Button } from "@/components/ui/button";
import { useClaimFunds } from "@/mutations/useClaimFunds";
import { useFaucetJob } from "@/queries/useFaucetJob";
import { client } from "@/lib/thirdweb-client";

export const Faucet = () => {
  const { mutate: claimFunds, isPending, data: claimJobID } = useClaimFunds();
  const { data: faucetJob } = useFaucetJob(claimJobID?.jobID ?? "");
  const [available, setAvailable] = useState(0.001);

  const wallet = useActiveAccount();
  const { data: walletBalance } = useWalletBalance({ chain: ethereum, address: wallet?.address as string, client });

  const isProcessing = isPending || (faucetJob && faucetJob[0].status !== "completed") || available === 0;

  const handleClaim = async () => {
    claimFunds({ walletAddress: wallet?.address as string });
    setAvailable(0);
  };

  useEffect(() => {
    if (faucetJob && faucetJob[0].status === "completed") {
      setAvailable(0.001);
    }
  }, [faucetJob]);

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
          <DetailAndText title="Balance" text={`${walletBalance?.displayValue.substring(0, 6)} ETH`} />
          <DetailAndText title="Daily Allowance" text="0.001 ETH" />
          <DetailAndText title="Cooldown" text="00:52:34" />
        </div>
        <div className="flex flex-col justify-center items-center my-16 sm:my-24">
          <div className="w-full sm:w-fit text-center">
            <h2 className="text-5xl md:text-7xl leading-tight text-[#878794]">{available} ETH</h2>
            <Button onClick={handleClaim} variant="main" className="mt-6 w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Claim"}
            </Button>
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
  <h4 className="text-[#878794]">
    {title}: <span className="text-[#242424]">{text}</span>
  </h4>
);
