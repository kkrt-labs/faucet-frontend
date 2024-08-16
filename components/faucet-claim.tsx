import { FC, PropsWithChildren, createRef, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Turnstile } from "@marsidev/react-turnstile";

import Link from "next/link";
import { useActiveWallet, useWalletBalance } from "thirdweb/react";
import { mainnet } from "thirdweb/chains";
import { GlobeIcon, Loader2 } from "lucide-react";
import { client } from "@/lib/thirdweb-client";
import { ENV } from "@/lib/constants";
import { FaucetJobResponse, FaucetStatsResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";

import cooldownCarrot from "@/public/assets/cooldown-carrot.svg";
import pendingCarrot from "@/public/assets/pending-carrot.svg";
import claimedCarrot from "@/public/assets/claimed-carrot.svg";
import { useIsDowntime } from "@/queries/useIsDowntime";

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
  handleClaim: (captchaCode: string) => void;
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
  const { data: isDowntimeCheck } = useIsDowntime();

  const [captchaCode, setCaptchaCode] = useState<string | null>(null);
  const [showCloudfare, setShowCloudfare] = useState(true);

  const { refetch: refetchWallet, data: balance } = useWalletBalance({
    chain: mainnet,
    address: wallet?.getAccount()?.address as string,
    client,
  });

  const minEthRequired = 0.05;
  const isEligibleToClaim =
    faucetStats && faucetStats?.canClaim && parseFloat(balance?.displayValue ?? "0") >= minEthRequired;

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

  const onTurnstileSuccess = (captchaCode: string) => {
    setCaptchaCode(captchaCode);
    setTimeout(() => setShowCloudfare(false), 1000);
  };

  if (isDowntimeCheck?.isDowntime ?? false)
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
      <Turnstile
        siteKey={ENV.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={onTurnstileSuccess}
        options={{
          size: !showCloudfare ? "invisible" : "normal",
        }}
      />
      <Button
        onClick={() => handleClaim(captchaCode ?? "")}
        disabled={isProcessing || !isEligibleToClaim || !captchaCode}
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
      <Link
        href="https://ecosystem.kakarot.org/"
        rel="noopener noreferrer"
        target="_blank"
        className="text-kkrtOrange mt-6 w-full"
      >
        <Button variant="outline" className="w-full">
          <GlobeIcon size={24} className="w-4 h-4 mr-2 text-kkrtOrange" />
          <span className="text-kkrtOrange">Explore our Ecosystem</span>
        </Button>
      </Link>

      {!isEligibleToClaim && !isProcessing && (
        <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] max-w-[350px]">
          You need at least {minEthRequired} ETH on Ethereum Mainnet. Or claim from our
          <Link
            href="https://discord.gg/kakarotzkevm"
            rel="noopener noreferrer"
            target="_blank"
            className="text-kkrtOrange ml-1"
          >
            Discord faucet
          </Link>
          .
        </p>
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
