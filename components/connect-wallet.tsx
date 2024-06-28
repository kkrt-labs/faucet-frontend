import { ConnectButton, ConnectEmbed } from "thirdweb/react";
import { KAKAROT_SEPOLIA, client, recommendedWallets, wallets } from "@/lib/thirdweb-client";
import { WalletDetails } from "./wallet-details";
import { WALLET_MODAL_OPTIONS } from "@/lib/constants";

export const ConnectWallet = () => {
  const { size, title, titleIcon, showThirdwebBranding } = WALLET_MODAL_OPTIONS;
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
      />
    </div>
  );
};
