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
