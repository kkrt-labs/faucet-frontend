import { createThirdwebClient } from "thirdweb";
import { createWallet, walletConnect } from "thirdweb/wallets";

// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const secretKey = process.env.THIRDWEB_SECRET_KEY;

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
