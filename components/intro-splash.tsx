import { BaseContainer } from "@/components/base-container";
import { ConnectWallet } from "@/components/connect-wallet";
import { TextPair } from "@/components/text-pair";

export const IntroSplash = () => (
  <BaseContainer className="space-y-10">
    <TextPair
      heading="Let's Check if you have an invite"
      description="Connect your wallet to continue using Kakarot faucet"
    />
    <ConnectWallet />
  </BaseContainer>
);
