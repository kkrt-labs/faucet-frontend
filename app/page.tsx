"use client";

import { BaseContainer } from "@/components/base-container";
import { Footer } from "@/components/mobile-footer";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ConnectWallet } from "@/components/connect-wallet";
import { TextPair } from "@/components/text-pair";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center text-center py-12 sm:py-20">
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">Welcome to Kakarot faucet</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground">
        Get test tokens for building applications on the Superchain
      </p>
      <BaseContainer className="space-y-10">
        <TextPair
          heading="Let's Check if you have an invite"
          description="Connect your wallet to continue using Kakarot faucet"
        />
        <ConnectWallet />
      </BaseContainer>
      <Footer />
    </main>
  );
}
