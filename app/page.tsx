"use client";

import { useState } from "react";
import { useActiveAccount, useAutoConnect } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb-client";
import { useIsWhitelisted } from "@/queries/useIsWhitelisted";
import { InviteCodeSplash } from "@/components/invite-splash";
import { FreePass } from "@/components/free-pass";
import { Faucet } from "@/components/faucet";
import { ConnectWallet } from "@/components/connect-wallet";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const wallet = useActiveAccount();
  const { isLoading: isAutoConnecting } = useAutoConnect({ client, wallets });
  const { data, isLoading } = useIsWhitelisted(wallet?.address ?? "");

  const [goToFaucet, setGoToFaucet] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  if (isAutoConnecting || isLoading)
    return (
      <main className="flex flex-col items-center text-center mt-20 h-[60svh] space-y-5">
        <Skeleton className="w-1/3 h-16 bg-blue-100" />
        <Skeleton className="w-1/2 h-20 bg-blue-100" />
        <Skeleton className="w-1/2 h-full bg-blue-100" />
      </main>
    );
  else if (data?.isWhitelisted) return <Faucet />;
  else if (isWhitelisted) return <FreePass shouldGoToFaucet={() => setGoToFaucet(true)} />;

  return (
    <main className="flex flex-col items-center text-center mt-20 h-[60svh]">
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">Get free testnet Kakarot ETH</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground mb-14">
        The fast, native faucet to kickstart your journey in the Kakarot ecosystem.
      </p>

      {!wallet && <ConnectWallet />}
      {wallet && <InviteCodeSplash setIsWhitelisted={() => setIsWhitelisted(true)} />}
    </main>
  );
}
