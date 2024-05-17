import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useActiveAccount, useDisconnect, useActiveWallet } from "thirdweb/react";
import { Button } from "@/components/ui/button";

export const WalletDetails = () => {
  const { disconnect } = useDisconnect();
  const wallet = useActiveAccount();
  const disconnectWallet = useActiveWallet();

  const prettyWallet = wallet?.address.slice(0, 6) + "..." + wallet?.address.slice(-4);

  if (!wallet || !disconnectWallet) return null;

  return (
    <Button
      onClick={() => disconnect(disconnectWallet)}
      style={{
        borderRadius: "6px",
        background: "linear-gradient(0deg, #5E5E5E 0%, #5E5E5E 100%), rgba(255, 255, 255, 0.40)",
        boxShadow: "0px 1px 2px 0px rgba(164, 172, 185, 0.24), 0px 0px 0px 1px rgba(18, 55, 105, 0.08)",
      }}
      className="space-x-2 font-medium"
      variant="wallet"
      size="withIcon"
    >
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span>{prettyWallet}</span>
    </Button>
  );
};
