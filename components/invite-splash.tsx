import { useEffect, useState } from "react";
import { useActiveAccount, useConnectModal } from "thirdweb/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useDebounce } from "@/hooks/useDebounce";
import { client, wallets } from "@/lib/thirdweb-client";
import { WALLET_MODAL_OPTIONS } from "@/lib/constants";
import { useInviteCodeValid } from "@/mutations/useInviteCodeValid";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseContainer } from "@/components/base-container";
import { TextPair } from "@/components/text-pair";

export const InviteCodeSplash = ({ setIsWhitelisted }: { setIsWhitelisted: () => void }) => {
  const { connect } = useConnectModal();
  const { mutate: checkInviteCode, isError, isSuccess, data: inviteCodeData } = useInviteCodeValid();

  const [inviteCode, setInviteCode] = useState("");
  const [redeemError, setRedeemError] = useState(false);

  const wallet = useActiveAccount();
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
      setIsWhitelisted();
      return;
    }

    setRedeemError(true);
  }, [inviteCode, inviteCodeData, isSuccess, queryClient, setIsWhitelisted]);

  useEffect(() => {
    if (isError) {
      setRedeemError(true);
      errorToast();
    }
  }, [isError]);

  useEffect(() => {
    setRedeemError(false);
  }, [inviteCode]);

  return (
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
  );
};
