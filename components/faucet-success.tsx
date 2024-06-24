import Image from "next/image";
import Link from "next/link";

import successCarrot from "@/public/assets/success-carrot.svg";
import { Button } from "@/components/ui/button";
import { KKRT_EXPLORER } from "@/lib/constants";

interface FaucetSuccessProps {
  navigateToClaim: () => void;
  txHash: string;
}

export const FaucetSuccess = ({ navigateToClaim, txHash }: FaucetSuccessProps) => (
  <div className="flex flex-col justify-center items-center my-16 sm:my-24">
    <div className="w-full sm:w-fit text-center flex flex-col justify-center items-center">
      <Image src={successCarrot} alt="Success Carrot" />
      <Button onClick={navigateToClaim} variant="main" className="mt-6 w-full">
        Back to Claim
      </Button>
      <Link href={`${KKRT_EXPLORER}/tx/${txHash}`} rel="noopener noreferrer" target="_blank" className="w-full">
        <Button className="space-x-2 w-full mt-2" variant="outline" size="withIcon">
          <span>View on Explorer</span>
          <Image src="/assets/link-icon.svg" alt="Docs" width={16} height={16} />
        </Button>
      </Link>

      <div className="flex flex-row items-center justify-center my-4">
        <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] max-w-[300px]">
          You just got some testnet ETH! Your wallet should reflect this transaction soon!
        </p>
      </div>
    </div>
  </div>
);
