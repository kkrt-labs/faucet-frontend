import { UseConnectModalOptions, lightTheme } from "thirdweb/react";

type NODE_ENV_TYPE = "production" | "development" | "test";
interface Environment {
  NODE_ENV: NODE_ENV_TYPE;
  API_ROOT: string;
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: string;
  THIRDWEB_CLIENT_SECRET: string;
}

const ENV: Environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_ROOT: process.env.NEXT_PUBLIC_API_ROOT || "",
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
  THIRDWEB_CLIENT_SECRET: process.env.THIRDWEB_CLIENT_SECRET || "",
};

const WALLET_MODAL_OPTIONS: Partial<UseConnectModalOptions> = {
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
};

const CONFETTI_COLORS = ["#FDA829", "#F6F5FC", "#FF2828"];

const TWEET_TEXT = `Hello everyone! 

Just claimed my "Early Farmer 🧑‍🌾" NFT on @KakarotZkEvm testnet phase🥕
  
Reach out to the Kakarot team to see if you are eligible for an invite code.
  
Carrot season is coming 🥕🥕🥕🥕
`;

const FAUCET_URL = "https://faucet-sepolia.kakarot.org";
const INTENT = `https://x.com/intent/post?text=${encodeURIComponent(TWEET_TEXT)}&url=${FAUCET_URL}`;

export { ENV, WALLET_MODAL_OPTIONS, CONFETTI_COLORS, INTENT };
