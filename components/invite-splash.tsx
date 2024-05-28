import { useEffect, useState } from "react";
import { useActiveAccount, useConnectModal, lightTheme } from "thirdweb/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseContainer } from "@/components/base-container";
import { TextPair } from "@/components/text-pair";
import { useQueryClient } from "@tanstack/react-query";
import { useRedeemCode } from "@/mutations/useRedeemCode";
import { client, wallets } from "@/lib/thirdweb-client";

export const InviteCodeSplash = ({ setIsWhitelisted }: { setIsWhitelisted: () => void }) => {
  const { mutate: redeemCodeMutation, isError, isPending, isSuccess, data } = useRedeemCode();
  const { connect } = useConnectModal();
  const wallet = useActiveAccount();
  const queryClient = useQueryClient();

  const [inviteCode, setInviteCode] = useState("");
  const [redeemError, setRedeemError] = useState(isError);
  const prettyWallet = wallet?.address.slice(0, 6) + "..." + wallet?.address.slice(-4);

  const handleRedeem = () => {
    redeemCodeMutation({ inviteCode, walletAddress: wallet?.address || "" });
  };

  const changeWallet = async () => {
    await connect({
      client,
      wallets,
      size: "wide",
      title: "Select Wallet",
      titleIcon:
        "https://assets-global.website-files.com/6464a063474b57e2c4e03b61/64a20e2749d92613acf4fd1b_Logo%20dark.svg",
      showThirdwebBranding: false,
      theme: lightTheme({
        colors: {
          accentText: "#f54400",
          accentButtonBg: "#f54400",
          primaryButtonBg: "#f54400",
        },
      }),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      queryClient.setQueryData(["redeemCodeData"], data.jobID);
      setIsWhitelisted();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setRedeemError(true);
    }
  }, [isError]);

  useEffect(() => {
    if (redeemError) {
      setRedeemError(false);
    }
  }, [inviteCode]);

  return (
    <BaseContainer>
      <div className="flex flex-col justify-center items-center">
        <TextPair heading="Enter Invite Code" description="Enter the code in the input field" />
        <Input
          type="text"
          placeholder="Enter your code here"
          className="py-6 placeholder:text-xs placeholder:text-[#878794] mt-6 md:mt-12 placeholder:font-normal"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <Button
          disabled={isPending || !inviteCode || !wallet}
          variant={redeemError ? "fail" : "main"}
          className="w-full mt-4 md:mt-8"
          onClick={handleRedeem}
        >
          {redeemError ? "Invalid Code" : "Verify"}
        </Button>
        <Button onClick={changeWallet} className="w-full space-x-6 items-center text-[#878794] mt-6" variant="outline">
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
    </BaseContainer>
  );
};
