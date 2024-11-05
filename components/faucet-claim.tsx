import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

import Link from "next/link";
import { useActiveWallet, useWalletBalance } from "thirdweb/react";
import { mainnet } from "thirdweb/chains";
import { GlobeIcon, Loader2 } from "lucide-react";
import { client } from "@/lib/thirdweb-client";
import { ENV } from "@/lib/constants";
import {
  Denomination,
  FaucetJobResponse,
  FaucetStatsResponse,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useIsDowntime } from "@/queries/useIsDowntime";
import { TokenTabs } from "@/components/token-tabs";
import { CarrotContainer } from "@/components/carrot-container";
import { InfoCarrot } from "@/components/info-carrot";
import cooldownCarrot from "@/public/assets/cooldown-carrot.svg";
import pendingCarrot from "@/public/assets/pending-carrot.svg";
import claimedCarrot from "@/public/assets/claimed-carrot.svg";

interface FaucetClaimProps {
  isProcessing: boolean;
  isCooldown: boolean;
  isOutOfFunds: boolean;
  handleClaim: (
    captchaCode: string,
    denomination: "eth" | "usdt" | "usdc",
  ) => void;
  currentDenomination: Denomination;
  setDenomination: (denomination: Denomination) => void;
  faucetStats?: FaucetStatsResponse;
  faucetJob?: FaucetJobResponse[];
}

export const FaucetClaim = ({
  isCooldown,
  isOutOfFunds,
  isProcessing,
  handleClaim,
  currentDenomination: denomination,
  setDenomination,
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

  const minEthRequired = 0;
  const isEligibleToClaim =
    faucetStats &&
    ((denomination === "eth" && faucetStats.canClaimETH) ||
      (denomination === "usdc" && faucetStats.canClaimUSDC) ||
      (denomination === "usdt" && faucetStats.canClaimUSDT)) &&
    parseFloat(balance?.displayValue ?? "0") >= minEthRequired;

  // if taking longer than 15 seconds to process the claim
  const isNetworkOverloaded =
    faucetJob &&
    (faucetJob[0].status === "processing" ||
      faucetJob[0].status === "pending") &&
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
        <Link
          href="https://ecosystem.kakarot.org/"
          rel="noopener noreferrer"
          target="_blank"
          className="text-kkrtOrange mt-6 w-full max-w-[350px]"
        >
          <Button variant="outline" className="w-full">
            <GlobeIcon size={24} className="w-4 h-4 mr-2 text-kkrtOrange" />
            <span className="text-kkrtOrange">Explore our Ecosystem</span>
          </Button>
        </Link>
      </CarrotContainer>
    );

  if (isCooldown && !isProcessing)
    return (
      <CarrotContainer>
        <TokenTabs
          denomination={denomination}
          setDenomination={setDenomination}
          faucetStats={faucetStats}
          claimInProgress={isProcessing}
        />
        <InfoCarrot
          imageAlt="Cooldown Carrot"
          carrotSrc={cooldownCarrot}
          description={`You're on a cooldown period for ${denomination.toUpperCase()}! Try the Kakarot faucet again in ${convertSecondsToTime(
            denomination === "eth"
              ? (faucetStats?.timeLeftETHInS ?? 0)
              : denomination === "usdc"
                ? (faucetStats?.timeLeftUSDCInS ?? 0)
                : (faucetStats?.timeLeftUSDTInS ?? 0),
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
      <TokenTabs
        denomination={denomination}
        setDenomination={setDenomination}
        faucetStats={faucetStats}
        claimInProgress={isProcessing}
      />
      <Turnstile
        siteKey={ENV.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={onTurnstileSuccess}
        options={{
          size: !showCloudfare ? "invisible" : "normal",
        }}
      />
      <Button
        onClick={() => handleClaim(captchaCode ?? "", denomination)}
        disabled={isProcessing || !isEligibleToClaim || !captchaCode}
        variant={"main"}
        className="mt-6 w-full"
      >
        {isProcessing || !isEligibleToClaim || !captchaCode ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 mr-2 text-lg" />
            <span>{!isEligibleToClaim ? "Loading..." : "Claiming.."} </span>
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
          You need at least {minEthRequired} ETH on Ethereum Mainnet. Or claim
          from our
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
