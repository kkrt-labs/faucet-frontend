"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useFaucet } from "@/hooks/useFaucet";
import { ConnectWallet } from "@/components/connect-wallet";
import { useIsEligible } from "@/queries/useIsEligible";
import { KakarotOG } from "@/components/kakarot-og";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SkeletonLoading } from "@/components/skeleton-loading";
import { DUMMY_PROOF } from "@/lib/whitelisted";
import { WHITELISTED_ADDRESSES } from "@/lib/whitelisted";

export default function Home() {
  const { wallet, activeWallets, isFaucetLoading } = useFaucet();
  const { data: isEligible, isLoading: isEligibleLoading } = useIsEligible(wallet?.address ?? "");
  const queryClient = useQueryClient();

  const [isToggledOff, setIsToggledOff] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && wallet?.address) {
      const storedValue = localStorage.getItem(`toggleEligibility/${wallet.address}`);
      setIsToggledOff(storedValue === "false");
    }
  }, [wallet?.address]);

  const isEligibleCheck = !isToggledOff && isEligible?.isEligible;

  useEffect(() => {
    if (wallet?.address) {
      if (isEligibleCheck && isEligible?.proof) {
        queryClient.setQueryData(["isEligible", wallet.address], isEligible.proof);
      } else if (isToggledOff) {
        queryClient.setQueryData(["isEligible", wallet.address], false);
      } else if (WHITELISTED_ADDRESSES.includes(wallet.address)) {
        queryClient.setQueryData(["isEligible", wallet.address], DUMMY_PROOF);
      }
    }
  }, [isEligibleCheck, isEligible, wallet?.address, queryClient, isToggledOff]);

  if (isEligibleLoading || isFaucetLoading) return <SkeletonLoading />;
  if (isEligibleCheck) return <KakarotOG />;
  // if (wallet && activeWallets && !isEligible?.isEligible) redirect("/faucet");

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
