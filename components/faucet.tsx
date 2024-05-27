import Image from "next/image";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";

import { TextPair } from "@/components/text-pair";
import { Button } from "@/components/ui/button";
import { useClaimFunds } from "@/mutations/useClaimFunds";

export const Faucet = () => {
  const { mutate: claimFunds, isPending, data: claimJobID } = useClaimFunds();
  const wallet = useActiveAccount();

  const handleClaim = async () => {
    claimFunds({ walletAddress: wallet?.address as string });
    setAvailable(0);
  };

  const [available, setAvailable] = useState(0.001);
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
          <DetailAndText title="Balance" text="0 Tokens" />
          <DetailAndText title="Daily Allowance" text="0.001 ETH" />
          <DetailAndText title="Cooldown" text="00:52:34" />
        </div>
        <div className="flex flex-col justify-center items-center my-16 sm:my-24">
          <div className="w-full sm:w-fit text-center">
            <h2 className="text-5xl md:text-7xl leading-tight text-[#878794]">{available} ETH</h2>
            <Button onClick={handleClaim} variant="main" className="mt-6 w-full" disabled={isPending}>
              Claim {isPending ? "Processing..." : claimJobID?.jobID}
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
