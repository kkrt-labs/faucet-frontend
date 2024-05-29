import { ConnectButton, lightTheme } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb-client";
import { WalletDetails } from "./wallet-details";
import { WALLET_MODAL_OPTIONS } from "@/lib/constants";

export const ConnectWallet = () => {
  const { size, title, titleIcon, showThirdwebBranding } = WALLET_MODAL_OPTIONS;
  return (
    <div>
      <ConnectButton
        client={client}
        wallets={wallets}
        connectButton={{
          style: {
            display: "inline-flex",
            padding: "10px 12px",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            borderRadius: "6px",
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), #f54400",
            boxShadow: "0px 1px 2px 0px rgba(255, 149, 73, 0.31), 0px 0px 0px 1px #f54400",
            color: "#fff",
            fontSize: "14px",
          },
        }}
        theme={WALLET_MODAL_OPTIONS.theme}
        connectModal={{
          size,
          title,
          titleIcon,
          showThirdwebBranding,
        }}
      />
    </div>
  );
};
