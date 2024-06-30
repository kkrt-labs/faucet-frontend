import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { INTENT, KKRT_EXPLORER } from "@/lib/constants";

import xIcon from "@/public/assets/x-icon-inverted.svg";
import successCarrot from "@/public/assets/success-carrot.svg";

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
      <Link rel="noopener noreferrer" target="_blank" href={INTENT} className="w-full">
        <Button variant="outline" className="mt-2 w-full gap-1 !bg-black !text-white">
          <span>Share on</span>
          <Image src={xIcon} alt="minting" width={20} height={20} priority />
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
