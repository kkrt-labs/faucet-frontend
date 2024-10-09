"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useFaucet } from "@/hooks/useFaucet";
import { ConnectWallet } from "@/components/connect-wallet";
import { useIsEligible } from "@/queries/useIsEligible";
import { KakarotOG } from "@/components/kakarot-og";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { wallet, activeWallets } = useFaucet();
  const { data: isEligible } = useIsEligible(wallet?.address ?? "");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEligible) {
      queryClient.setQueryData(["isEligible", wallet?.address], isEligible.proof);
    }
  }, [isEligible, wallet?.address, queryClient]);

  // if (isFaucetLoading || isEligibleLoading) return <SkeletonLoading />;
  // if (wallet && activeWallets && !isEligible?.isEligible) redirect("/faucet");
  if (isEligible?.isEligible) return <KakarotOG />;

  return (
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
}
