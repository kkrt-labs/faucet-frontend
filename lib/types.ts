export interface RedeemInviteResponse {
  jobId: string;
}

export interface RedeemInviteJobResponse {
  created_at: string;
  job_id: string;
  status: "completed" | "pending" | "failed";
  transaction_hash: string;
  error: string | null;
}

export interface FaucetResponse {
  jobId: string;
}

export interface FaucetJobResponse {
  created_at: string;
  job_id: string;
  status: "completed" | "pending" | "failed";
  transaction_hash: string;
  error: string | null;
}
