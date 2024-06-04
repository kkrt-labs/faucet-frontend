import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FaucetSuccessProps {
  navigateToClaim: () => void;
}

export const FaucetSuccess = ({ navigateToClaim }: FaucetSuccessProps) => (
  <div className="flex flex-col justify-center items-center my-16 sm:my-24">
    <div className="w-full sm:w-fit text-center flex flex-col justify-center items-center">
      <h2 className="text-3xl md:text-5xl  text-[#878794]">Cha Ching!</h2>
      {/* <Image src={cooldownCarrot} alt="Cooldown Carrot" /> */}
      <Button onClick={navigateToClaim} variant="main" className="mt-6 w-full">
        Back to Claim
      </Button>

      <div className="flex flex-row items-center justify-center my-4">
        <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] max-w-[300px]">
          You just got some testnet ETH! Your wallet should reflect this transaction soon!
        </p>
      </div>
    </div>
  </div>
);
