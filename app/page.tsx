"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useIsWhitelisted } from "@/queries/useIsWhitelisted";
import { IntroSplash } from "@/components/intro-splash";
import { InviteCodeSplash } from "@/components/invite-splash";
import { FreePass } from "@/components/free-pass";
import { Faucet } from "@/components/faucet";

export default function Home() {
  const wallet = useActiveAccount();
  const { data, isLoading } = useIsWhitelisted(wallet?.address ?? "");

  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [goToFaucet, setGoToFaucet] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setGoToFaucet(data?.isWhitelisted ?? false);
    }
  }, [data, isLoading]);

  if (wallet && goToFaucet) return <Faucet />;
  else if (isWhitelisted && wallet) return <FreePass shouldGoToFaucet={() => setGoToFaucet(true)} />;

  return (
    <main className="flex flex-col justify-center items-center text-center py-12 sm:py-20">
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">Get free testnet Kakarot ETH</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground">
        The fast, native faucet to kickstart your journey in the Kakarot ecosystem. This is staging deployment, not
        production url.
      </p>
      {!wallet && <IntroSplash />}
      {wallet && <InviteCodeSplash setIsWhitelisted={() => setIsWhitelisted(true)} />}
    </main>
  );
}
