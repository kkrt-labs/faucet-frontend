type NODE_ENV_TYPE = "production" | "development" | "test";
interface Environment {
  NODE_ENV: NODE_ENV_TYPE;
  API_ROOT: string;
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: string;
  THIRDWEB_CLIENT_SECRET: string;
}

const ENV: Environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_ROOT: process.env.API_ROOT || "",
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
  THIRDWEB_CLIENT_SECRET: process.env.THIRDWEB_CLIENT_SECRET || "",
};

export { ENV };
