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
  timeLeftInS: number;
  canClaim: boolean;
  dripAmountInEth: string;
  message: string;
}

export interface FaucetBalanceResponse {
  faucetBalanceInEth: string;
}

export interface IsDowntimeResponse {
  isDowntime: boolean;
}

export type Denomination = "eth" | "usdc" | "usdt";
