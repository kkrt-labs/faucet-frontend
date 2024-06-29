import { UseConnectModalOptions, lightTheme } from "thirdweb/react";

type NODE_ENV_TYPE = "production" | "development" | "test";
interface Environment {
  NODE_ENV: NODE_ENV_TYPE;
  API_ROOT: string;
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: string;
  THIRDWEB_CLIENT_SECRET: string;
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
}

const ENV: Environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_ROOT: process.env.NEXT_PUBLIC_API_ROOT || "",
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
  THIRDWEB_CLIENT_SECRET: process.env.THIRDWEB_CLIENT_SECRET || "",
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || "",
};

const WALLET_MODAL_OPTIONS: Partial<UseConnectModalOptions> = {
  size: "wide",
  title: "Select Wallet",
  titleIcon: "https://sepolia-faucet.kakarot.org/assets/kakarot-logo-mobile.svg",
  showThirdwebBranding: false,
  theme: lightTheme({
    colors: {
      accentText: "#FF7600",
      accentButtonBg: "#FF7600",
      primaryButtonBg: "#FF7600",
    },
  }),
};

const CONFETTI_COLORS = ["#FDA829", "#F6F5FC", "#FF2828"];
const GOOGLE_CAPTCHA_API_BASE = "https://www.google.com/recaptcha/api/siteverify";
const TWEET_TEXT = `Hello everyone! 

Just claimed my "Early Farmer 🧑‍🌾" NFT on @KakarotZkEvm testnet phase🥕
  
Reach out to the Kakarot team to see if you are eligible for an invite code.
  
Carrot season is coming 🥕🥕🥕🥕
`;

const FAUCET_URL = "https://faucet-sepolia.kakarot.org";
const INTENT = `https://x.com/intent/post?text=${encodeURIComponent(TWEET_TEXT)}&url=${FAUCET_URL}`;
const KKRT_EXPLORER = "https://sepolia.kakarotscan.org";
const KKRT_RPC_DETAILS = "https://thirdweb.com/kakarot-sepolia";

export { ENV, WALLET_MODAL_OPTIONS, CONFETTI_COLORS, INTENT, KKRT_EXPLORER, KKRT_RPC_DETAILS };
