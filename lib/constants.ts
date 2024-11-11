import { UseConnectModalOptions, lightTheme } from "thirdweb/react";

type NODE_ENV_TYPE = "production" | "development" | "test";
interface Environment {
  NODE_ENV: NODE_ENV_TYPE;
  API_ROOT: string;
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: string;
  THIRDWEB_CLIENT_SECRET: string;
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
  NEXT_PUBLIC_DRIP_AMOUNT_ETH: string;
  NEXT_PUBLIC_IS_DEVELOPMENT: boolean;
}

const ENV: Environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_ROOT: process.env.NEXT_PUBLIC_API_ROOT || "",
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID:
    process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
  THIRDWEB_CLIENT_SECRET: process.env.THIRDWEB_CLIENT_SECRET || "",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY:
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || "",
  NEXT_PUBLIC_DRIP_AMOUNT_ETH:
    process.env.NEXT_PUBLIC_DRIP_AMOUNT_ETH || "0.001",
  NEXT_PUBLIC_IS_DEVELOPMENT: process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true",
};

const WALLET_MODAL_OPTIONS: Partial<UseConnectModalOptions> = {
  size: "wide",
  title: "Select Wallet",
  titleIcon:
    "https://sepolia-faucet.kakarot.org/assets/kakarot-logo-mobile.svg",
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
const FEEDBACK_TYPEFORM = "https://eab2omvihmx.typeform.com/to/eoD6oLfy";
const RATE_LIMIT_KEY = "rateLimitTime";
const TWEET_TEXT = `gm gm,

@KakarotZkEvm is now in public testnet, and I just claimed some ETH via their faucet 🧑‍🌾

Join me and make your first claim!

The carrot season has begun 🥕🥕
`;

const FAUCET_URL = "https://faucet-sepolia.kakarot.org";
const INTENT = `https://x.com/intent/post?text=${encodeURIComponent(TWEET_TEXT)}&url=${FAUCET_URL}`;
const KKRT_EXPLORER = "https://sepolia.kakarotscan.org";
const KKRT_RPC_DETAILS =
  "https://docs.kakarot.org/starknet/overview#as-a-user-how-can-i-interact-with-kakarot-on-starknet";
const KAKAROT_CONTRACT_ADDRESS = "0xb45E3EfCd7C21120a335F75f1a02985d94285827";
const BUG_FORM =
  "https://kkrtlabs.notion.site/1343e373fba080e29f0de6b3f04bd980?pvs=105";

export {
  ENV,
  WALLET_MODAL_OPTIONS,
  CONFETTI_COLORS,
  INTENT,
  KKRT_EXPLORER,
  KKRT_RPC_DETAILS,
  RATE_LIMIT_KEY,
  FEEDBACK_TYPEFORM,
  KAKAROT_CONTRACT_ADDRESS,
  BUG_FORM,
};
