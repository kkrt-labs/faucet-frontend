import { ConnectButton, ConnectEmbed, useConnectModal } from "thirdweb/react";
import { KAKAROT_SEPOLIA, client, recommendedWallets, wallets } from "@/lib/thirdweb-client";
import { WALLET_MODAL_OPTIONS } from "@/lib/constants";
import { useFaucet } from "@/hooks/useFaucet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ConnectWallet = () => {
  const { wallet } = useFaucet();
  const { size, title, titleIcon, showThirdwebBranding } = WALLET_MODAL_OPTIONS;
  const prettyWallet = wallet?.address.slice(0, 6) + "..." + wallet?.address.slice(-4);

  return (
    <div>
      <ConnectButton
        client={client}
        chain={KAKAROT_SEPOLIA}
        wallets={wallets}
        recommendedWallets={recommendedWallets}
        showAllWallets={false}
        theme={WALLET_MODAL_OPTIONS.theme}
        connectModal={{
          size,
          title,
          titleIcon,
          showThirdwebBranding,
        }}
        connectButton={{
          style: {
            display: "flex",
            width: "350px",
            padding: "12px 10px",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            borderRadius: "6px",
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), #FF7600",
            boxShadow: "0px 1px 2px 0px rgba(255, 149, 73, 0.31), 0px 0px 0px 1px #FF7600",
            color: "#fff",
            fontSize: "14px",
          },
        }}
        appMetadata={{
          name: "Kakarot Faucet",
          url: "https://sepolia-faucet.kakarot.org/",
          description: "The fast, native faucet to kickstart your journey in the Kakarot ecosystem.",
          logoUrl: "https://sepolia-faucet.kakarot.org/assets/kakarot-logo.svg",
        }}
        detailsButton={{
          render: () => (
            <Button className="w-full space-x-6 items-center text-[#878794] mt-6" variant="outline">
              <div className="flex space-x-1">
                <Avatar>
                  <AvatarImage src={`https://effigy.im/a/${wallet?.address}.png`} />
                  <AvatarFallback>{wallet?.address}</AvatarFallback>
                </Avatar>
                <span>{prettyWallet}</span>
              </div>
              <span className="text-[#FF7600] text-xs">Change Wallet</span>
            </Button>
          ),
        }}
      />
    </div>
  );
};
