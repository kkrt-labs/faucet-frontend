import { FC, PropsWithChildren, createRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import { useActiveWallet, useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { mainnet } from "thirdweb/chains";
import { Loader2 } from "lucide-react";
import { KAKAROT_SEPOLIA, client } from "@/lib/thirdweb-client";
import { ENV, KKRT_RPC_DETAILS } from "@/lib/constants";
import { FaucetJobResponse, FaucetStatsResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";

import metamaskLogo from "@/public/assets/metamask.png";
import cooldownCarrot from "@/public/assets/cooldown-carrot.svg";
import pendingCarrot from "@/public/assets/pending-carrot.svg";
import claimedCarrot from "@/public/assets/claimed-carrot.svg";

interface InfoCarrotProps {
  carrotSrc: StaticImageData;
  imageAlt: string;
  title?: string;
  description: string;
}

interface FaucetClaimProps {
  isProcessing: boolean;
  isCooldown: boolean;
  isOutOfFunds: boolean;
  available: string;
  handleClaim: () => void;
  faucetStats?: FaucetStatsResponse;
  faucetJob?: FaucetJobResponse[];
}

export const FaucetClaim = ({
  isCooldown,
  isOutOfFunds,
  isProcessing,
  available,
  handleClaim,
  faucetStats,
  faucetJob,
}: FaucetClaimProps) => {
  const wallet = useActiveWallet();
  const chainId = useActiveWalletChain();
  const activeChain = wallet?.getChain();
  const recaptchaRef = createRef() as React.RefObject<ReCAPTCHA>;
  const isMetaMask = wallet?.id === "io.metamask";
  const { refetch: refetchWallet, data: balance } = useWalletBalance({
    chain: mainnet,
    address: wallet?.getAccount()?.address as string,
    client,
  });

  const minEthRequired = ENV.NODE_ENV === "production" ? 0.001 : 0.0001;
  const isEligibleToClaim =
    faucetStats && faucetStats?.canClaim && parseFloat(balance?.displayValue ?? "0") >= minEthRequired;
  const isDowntime = true; // to simulate downtime

  // if taking longer than 15 seconds to process the claim
  const isNetworkOverloaded =
    faucetJob &&
    (faucetJob[0].status === "processing" || faucetJob[0].status === "pending") &&
    new Date(faucetJob[0].created_at).getTime() + 15000 < Date.now();

  const convertSecondsToTime = (seconds: number) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const remainingSeconds = String(seconds % 60).padStart(2, "0");

    if (hours !== "00") return `${hours}:${minutes}:${remainingSeconds} hours`;
    if (minutes !== "00") return `${minutes}:${remainingSeconds} minutes`;
    return `${remainingSeconds} seconds`;
  };

  const onReCAPTCHAChange = (captchaCode: string | null) => {
    if (!captchaCode) return;
    handleClaim();
    recaptchaRef.current?.reset();
  };

  const handleClick = () => recaptchaRef.current?.execute();

  // keep checking for network switch in background using hook
  useEffect(() => {
    if (wallet) wallet.autoConnect({ client });
  }, [chainId]);

  if (isDowntime)
    return (
      <CarrotContainer>
        <InfoCarrot
          imageAlt="Pending Carrot"
          carrotSrc={pendingCarrot}
          description="Kakarot is currently undergoing scheduled maintenance. We will be back soon!"
        />
      </CarrotContainer>
    );

  if (isNetworkOverloaded)
    return (
      <CarrotContainer>
        <InfoCarrot
          imageAlt="Pending Carrot"
          carrotSrc={pendingCarrot}
          title="Your funds are on the way!"
          description="The faucet is under load, we have received your request, and the funds are on the way."
        />
      </CarrotContainer>
    );

  if (isCooldown && !isProcessing)
    return (
      <CarrotContainer>
        <InfoCarrot
          imageAlt="Cooldown Carrot"
          carrotSrc={cooldownCarrot}
          description={`You're on a cooldown period! Try the Kakarot faucet again in ${convertSecondsToTime(
            faucetStats?.timeLeftInS ?? 0
          )}.`}
        />
      </CarrotContainer>
    );

  if (isOutOfFunds && !isProcessing)
    return (
      <CarrotContainer>
        <InfoCarrot
          imageAlt="Juiced Carrot"
          carrotSrc={claimedCarrot}
          description="We've run out Juices come back again till we fix the juice machine."
        />
      </CarrotContainer>
    );

  return (
    <CarrotContainer>
      <h2 className="text-5xl md:text-7xl leading-tight text-[#878794] font-medium">{available}</h2>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={ENV.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        onChange={onReCAPTCHAChange}
      />
      <Button
        onClick={handleClick}
        disabled={isProcessing || !isEligibleToClaim}
        variant={"main"}
        className="mt-6 w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 mr-2 text-lg" />
            <span>Claiming..</span>
          </>
        ) : (
          "Claim"
        )}
      </Button>

      {!isEligibleToClaim && !isProcessing && (
        <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] max-w-[350px]">
          You need at least {minEthRequired} ETH on Ethereum Mainnet to the use the faucet
        </p>
      )}

      {wallet && activeChain?.id !== KAKAROT_SEPOLIA.id && (
        <div className="flex justify-center items-center w-full mt-6 text-sm md:text-md gap-4">
          <Button variant="outline" className="space-x-3" onClick={() => wallet.switchChain(KAKAROT_SEPOLIA)}>
            {isMetaMask && <Image src={metamaskLogo} alt="metamask" width={16} height={16} />}
            <span className="text-kkrtOrange">Add Network</span>
          </Button>
          <Link href={KKRT_RPC_DETAILS} rel="noopener noreferrer" target="_blank">
            <span className="text-kkrtOrange underline">Network Details</span>
          </Link>
        </div>
      )}
    </CarrotContainer>
  );
};

export const InfoCarrot = ({ carrotSrc, title = "", description, imageAlt }: InfoCarrotProps) => (
  <>
    <Image src={carrotSrc} alt={imageAlt} />
    {title.length > 0 && <h2 className="text-3xl md:text-5xl leading-tight  font-medium">{title}</h2>}
    <div className="flex flex-row items-center justify-center my-4">
      <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] max-w-[350px]">{description}</p>
    </div>
  </>
);

export const CarrotContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col justify-center items-center my-16">
    <div className="w-full sm:w-fit text-center flex flex-col justify-center items-center">{children}</div>
  </div>
);
