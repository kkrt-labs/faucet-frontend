export interface RedeemInviteResponse {
  jobID: string;
}

export interface IsValidInviteResponse {
  isValidInviteCode: boolean;
  isClaimed: boolean;
}

export interface RedeemInviteJobResponse {
  created_at: string;
  job_id: string;
  status: "completed" | "pending" | "error" | "processing";
  transaction_hash: string;
  error: string | null;
}

export interface FaucetResponse {
  jobID: string;
}

export interface FaucetJobResponse {
  created_at: string;
  job_id: string;
  status: "completed" | "pending" | "error" | "processing";
  transaction_hash: string;
  error: string | null;
}

export interface IsWhitelistedResponse {
  isWhitelisted: boolean;
}

export interface FaucetStatsResponse {
  message: string;
  timeLeftETHInS: number;
  timeLeftUSDCInS: number;
  timeLeftUSDTInS: number;
  canClaimETH: boolean;
  canClaimUSDC: boolean;
  canClaimUSDT: boolean;
  dripAmountInEth: string;
  dripAmountUSDC: string;
  dripAmountUSDT: string;
  discordDripAmountInEth: string;
}

export interface FaucetBalanceResponse {
  faucetBalanceInEth: string;
  usdcBalance: string;
  usdtBalance: string;
}

export interface IsDowntimeResponse {
  isDowntime: boolean;
}

export type Denomination = "eth" | "usdc" | "usdt";

export interface IsEligibleResponse {
  isEligible: boolean;
  proof?: string[];
}

export interface ToggleEligibilityResponse {
  walletAddress: string;
  isEligible: boolean;
}

export interface GenerateImageResponse {
  imageUrl: string;
  description: string;
  walletProperties: {
    coin_balance_category: string;
    token_count_category: string;
    tx_count_category: string;
  };
}

export interface SpiritKarrotResponse {
  name: string;
  fullName: string;
  description: string;
  imageUrl: string;
  isEligible: boolean;
  proof: string[];
  error?: string;
}
