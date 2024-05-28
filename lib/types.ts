export interface RedeemInviteResponse {
  jobID: string;
}

export interface RedeemInviteJobResponse {
  created_at: string;
  job_id: string;
  status: "completed" | "pending" | "error";
  transaction_hash: string;
  error: string | null;
}

export interface FaucetResponse {
  jobID: string;
}

export interface FaucetJobResponse {
  created_at: string;
  job_id: string;
  status: "completed" | "pending" | "error";
  transaction_hash: string;
  error: string | null;
}

export interface IsWhitelistedResponse {
  isWhitelisted: boolean;
}
