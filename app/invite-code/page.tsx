"use client";

import { useEffect, useState } from "react";
import { useActiveAccount, useAutoConnect, useConnectModal } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb-client";
import { useIsWhitelisted } from "@/queries/useIsWhitelisted";
import { Skeleton } from "@/components/ui/skeleton";
import { TextPair } from "@/components/text-pair";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { WALLET_MODAL_OPTIONS } from "@/lib/constants";
import { useInviteCodeValid } from "@/mutations/useInviteCodeValid";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";

export default function Home() {
  const wallet = useActiveAccount();
  const { isLoading: isAutoConnecting } = useAutoConnect({ client, wallets });
  const { data, isLoading } = useIsWhitelisted(wallet?.address ?? "");

  const { connect } = useConnectModal();
  const { mutate: checkInviteCode, isError, isSuccess, data: inviteCodeData } = useInviteCodeValid();

  const [inviteCode, setInviteCode] = useState("");
  const [redeemError, setRedeemError] = useState(false);

  const queryClient = useQueryClient();
  const debouncedInviteCode = useDebounce(inviteCode, 500);
  const prettyWallet = wallet?.address.slice(0, 6) + "..." + wallet?.address.slice(-4);

  const handleRedeem = () => {
    if (!inviteCode) return;
    checkInviteCode({ inviteCode: debouncedInviteCode });
  };

  const changeWallet = async () => {
    await connect({
      client,
      wallets,
      ...WALLET_MODAL_OPTIONS,
    });
  };

  const errorToast = () =>
    toast.error("Seems like the invite code is invalid or has already been claimed. Please try again.");

  useEffect(() => {
    if (!inviteCode) return;

    if (isSuccess && inviteCodeData.isValidInviteCode && !inviteCodeData.isClaimed) {
      queryClient.setQueryData(["redeemCodeData"], { inviteCode, ...inviteCodeData });
      redirect("/farmer-pass");
      return;
    }

    setRedeemError(true);
  }, [inviteCode, inviteCodeData, isSuccess, queryClient]);

  useEffect(() => {
    if (isError) {
      setRedeemError(true);
      errorToast();
    }
  }, [isError]);

  useEffect(() => {
    setRedeemError(false);
  }, [inviteCode]);

  if (isAutoConnecting || isLoading)
    return (
      <main className="flex flex-col items-center text-center mt-20 h-svh">
        <Skeleton className="w-2/5 h-14 bg-blue-100 rounded-md" />
        <Skeleton className="w-2/5 h-8 bg-blue-100 rounded-md mt-2" />
        <Skeleton className="w-2/5 h-14 bg-blue-100 rounded-md mt-11" />
      </main>
    );

  if (!wallet) {
    redirect("/");
  }
  // TODO: Add redirect to /faucet if user is whitelisted

  return (
    <main className="flex flex-col items-center text-center mt-20 h-[60svh]">
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">Get free testnet Kakarot ETH</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground mb-14">
        The fast, native faucet to kickstart your journey in the Kakarot ecosystem.
      </p>

      <div className="flex flex-col justify-center items-center">
        <TextPair
          heading="Verify Your Access"
          description="Welcome to the Kakarot Faucet! To get started, you'll need to verify your access by entering the invite code provided by our team."
        />
        <Input
          type="text"
          placeholder="Enter your code here"
          className="py-6 placeholder:text-xs placeholder:text-[#878794] mt-6 md:mt-12 placeholder:font-normal max-w-[350px] bg-white"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <Button
          disabled={!inviteCode || !wallet || redeemError}
          variant={redeemError ? "fail" : "main"}
          className="w-full mt-4 md:mt-8 max-w-[350px]"
          onClick={handleRedeem}
        >
          {redeemError ? "Invalid Code" : "Verify"}
        </Button>
        <Button
          onClick={changeWallet}
          className="w-full space-x-6 items-center text-[#878794] mt-6 max-w-[350px]"
          variant="outline"
        >
          <div className="flex space-x-1">
            <Avatar>
              <AvatarImage src={`https://effigy.im/a/${wallet?.address}.png`} />
              <AvatarFallback>{wallet?.address}</AvatarFallback>
            </Avatar>
            <span>{prettyWallet}</span>
          </div>
          <span className="text-[#F54400] text-xs">Change Wallet</span>
        </Button>
      </div>
    </main>
  );
}
