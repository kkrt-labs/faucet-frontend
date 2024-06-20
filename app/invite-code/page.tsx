"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConnectModal } from "thirdweb/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { WALLET_MODAL_OPTIONS } from "@/lib/constants";
import { client, wallets } from "@/lib/thirdweb-client";
import { TextPair } from "@/components/text-pair";
import { SkeletonLoading } from "@/components/skeleton-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFaucet } from "@/hooks/useFaucet";
import { useDebounce } from "@/hooks/useDebounce";
import { useInviteCodeValid } from "@/mutations/useInviteCodeValid";

export default function Home() {
  const { wallet, isFaucetLoading, isWhitelisted } = useFaucet();

  const { connect } = useConnectModal();
  const { mutate: checkInviteCode, isError, isSuccess, data: inviteCodeData } = useInviteCodeValid();

  const [inviteCode, setInviteCode] = useState("");
  const [redeemError, setRedeemError] = useState(false);
  const router = useRouter();
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
      router.replace("/farmer-pass");
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

  if (isFaucetLoading) return <SkeletonLoading />;
  else if (!wallet) router.replace("/");
  else if (isWhitelisted) router.replace("/faucet");

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
