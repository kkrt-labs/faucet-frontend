import { createThirdwebClient, defineChain } from "thirdweb";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { ENV } from "./constants";

// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = ENV.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const secretKey = ENV.THIRDWEB_CLIENT_SECRET;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient(
  secretKey
    ? { secretKey }
    : {
        clientId,
      }
);

export const wallets = [createWallet("io.metamask"), walletConnect(), createWallet("me.rainbow")];

export const KAKAROT_SEPOLIA = defineChain(1802203764);
