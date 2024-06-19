"use client";
import { redirect } from "next/navigation";
import { useFaucet } from "@/hooks/useFaucet";
import { ConnectWallet } from "@/components/connect-wallet";
import { SkeletonLoading } from "@/components/skeleton-loading";

export default function Home() {
  const { isFaucetLoading, isWhitelisted, wallet } = useFaucet();

  if (isFaucetLoading) return <SkeletonLoading />;
  else if (isWhitelisted) redirect("/faucet");
  else if (wallet) redirect("/invite-code");

  return (
    <main className="flex flex-col items-center text-center mt-20 h-svh">
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">Get free testnet Kakarot ETH</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground mb-14">
        The fast, native faucet to kickstart your journey in the Kakarot ecosystem.
      </p>
      <ConnectWallet />
    </main>
  );
}
