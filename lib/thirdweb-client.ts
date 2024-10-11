import { createThirdwebClient, defineChain } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
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

export const wallets = [
  createWallet("io.metamask"),
  createWallet("com.trustwallet.app"),
  createWallet("global.safe"),
  createWallet("com.coinbase.wallet"),
  createWallet("org.uniswap"),
  createWallet("io.rabby"),
  createWallet("me.rainbow"),
  createWallet("io.zerion.wallet"),
  createWallet("com.okex.wallet"),
  createWallet("com.ledger"),
];

export const recommendedWallets = [
  createWallet("io.metamask"),
  createWallet("com.trustwallet.app"),
  createWallet("global.safe"),
  createWallet("com.coinbase.wallet"),
  createWallet("org.uniswap"),
];

export const KAKAROT_SEPOLIA = defineChain({
  id: 920637907288165,
  name: "Kakarot Starknet Sepolia",
  rpcUrls: {
    public: { http: ["https://sepolia-rpc.kakarot.org"] },
    default: { http: ["https://sepolia-rpc.kakarot.org"] },
  },
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
});
