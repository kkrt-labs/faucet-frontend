"use client";

import Link from "next/link";
import { useFaucet } from "@/hooks/useFaucet";
import { ConnectWallet } from "@/components/connect-wallet";
import { KakarotOG } from "@/components/kakarot-og";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useSpiritKarrot } from "@/queries/useSpiritKarrot";
import { Account, Wallet } from "thirdweb/wallets";

type ProgressState = "loading" | "eligible" | "not-eligible";

export default function Home() {
  const { wallet, activeWallets } = useFaucet();

  return <GoToWallet wallet={wallet} activeWallets={activeWallets} />;
}

interface GoToWalletProps {
  wallet: Account | undefined;
  activeWallets: Wallet[] | undefined;
}

const GoToWallet = ({ wallet, activeWallets }: GoToWalletProps) => (
  <main className="flex flex-col items-center text-center my-20 h-full">
    <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">Get free testnet Kakarot ETH</h1>
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground mb-14">
      The fast, native faucet to kickstart your journey in the Kakarot ecosystem.
    </p>
    {wallet && activeWallets ? (
      <Link href={"/faucet"} className="w-full max-w-[400px]">
        <Button variant="main" className="mt-6 w-full">
          Go to Faucet
        </Button>
      </Link>
    ) : (
      <ConnectWallet />
    )}
  </main>
);
