import { ConnectButton, lightTheme } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb-client";
import { WalletDetails } from "./wallet-details";

export const ConnectWallet = () => {
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
        theme={lightTheme({
          colors: {
            accentText: "#f54400",
            accentButtonBg: "#f54400",
            primaryButtonBg: "#f54400",
          },
        })}
        connectModal={{
          size: "wide",
          title: "Select Wallet",
          titleIcon:
            "https://assets-global.website-files.com/6464a063474b57e2c4e03b61/64a20e2749d92613acf4fd1b_Logo%20dark.svg",
          showThirdwebBranding: false,
        }}
      />
    </div>
  );
};
