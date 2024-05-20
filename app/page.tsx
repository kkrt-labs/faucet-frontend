"use client";

import { useState } from "react";
import { Footer } from "@/components/mobile-footer";
import { useActiveAccount } from "thirdweb/react";
import { IntroSplash } from "@/components/intro-splash";
import { InviteCodeSplash } from "@/components/invite-splash";
import { FreePass } from "@/components/free-pass";

export default function Home() {
  const wallet = useActiveAccount();
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  if (isWhitelisted) return <FreePass />;

  return (
    <main className="flex flex-col justify-center items-center text-center py-12 sm:py-20">
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">Welcome to Kakarot faucet</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground">
        Get test tokens for building applications on the Superchain
      </p>
      {!wallet && <IntroSplash />}
      {wallet && <InviteCodeSplash setIsWhitelisted={() => setIsWhitelisted(true)} />}
    </main>
  );
}
