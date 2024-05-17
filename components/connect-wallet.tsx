import { useConnect } from "thirdweb/react";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb-client";

export const ConnectWallet = () => {
  const { connect, isConnecting, error } = useConnect();

  const connectWallet = async () => {
    const metamask = createWallet("io.metamask");

    if (injectedProvider("io.metamask")) {
      await metamask.connect({ client });
    } else {
      await metamask.connect({
        client,
        walletConnect: { showQrModal: true },
      });
    }
    return metamask;
  };

  return (
    <div>
      <button
        className="inline-flex py-2 px-3 justify-center items-center gap-1 connectBtn text-white"
        onClick={() => connect(connectWallet)}
      >
        Connect Wallet
      </button>
    </div>
  );
};
