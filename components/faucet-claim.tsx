import Image from "next/image";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaucetStatsResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";

import cooldownCarrot from "@/public/assets/cooldown-carrot.svg";

interface FaucetClaimProps {
  isProcessing: boolean;
  isCooldown: boolean;
  available: string;
  handleClaim: () => void;
  faucetStats?: FaucetStatsResponse;
}

export const FaucetClaim = ({ isCooldown, isProcessing, available, handleClaim, faucetStats }: FaucetClaimProps) => (
  <div className="flex flex-col justify-center items-center my-16 sm:my-24">
    <div className="w-full sm:w-fit text-center flex flex-col justify-center items-center">
      {!isProcessing && isCooldown ? (
        <Image src={cooldownCarrot} alt="Cooldown Carrot" />
      ) : (
        <h2 className="text-5xl md:text-7xl leading-tight text-[#878794]">{available}</h2>
      )}
      <Button
        onClick={handleClaim}
        disabled={isProcessing}
        variant={!isProcessing && isCooldown ? "cooldown" : "main"}
        className={cn("mt-6 w-full", !isProcessing && isCooldown && "pointer-events-none")}
      >
        {isProcessing ? "Claiming..." : isCooldown ? "Cooldown" : "Claim"}
      </Button>
      {!isProcessing && isCooldown && (
        <div className="flex flex-row items-center justify-center my-4">
          <InfoIcon className="mt-4 ml-2 h-5 w-5 shrink-0 text-[#8E98A8]" />
          <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] max-w-[300px]">
            You&apos;re on a cooldown period! Try the Kakarot faucet again in {faucetStats?.timeLeftInS} seconds.
          </p>
        </div>
      )}
    </div>
  </div>
);
