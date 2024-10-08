import axios from "axios";
import { ENV } from "./constants";
import type { AxiosRequestConfig } from "axios";
import {
  Denomination,
  FaucetBalanceResponse,
  FaucetJobResponse,
  FaucetResponse,
  FaucetStatsResponse,
  GenerateImageResponse,
  IsDowntimeResponse,
  IsEligibleResponse,
  IsValidInviteResponse,
  IsWhitelistedResponse,
  RedeemInviteJobResponse,
  RedeemInviteResponse,
  ToggleEligibilityResponse,
} from "./types";
import { redirectToRateLimit } from "@/lib/utils";

const instance = axios.create({});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // lock the user out in case of unauthenticated status codes
    if (error?.response?.status === 429) {
      redirectToRateLimit(error);
    }
    return Promise.reject(error);
  }
);

export const requests = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    instance.get<T>(`${ENV.API_ROOT}${url}`, config).then(({ data }) => data),
  post: <T, Q>(url: string, body?: T, config?: AxiosRequestConfig): Promise<Q> =>
    instance.post<Q>(`${ENV.API_ROOT}${url}`, body, config).then(({ data }) => data),
  put: <T, Q>(url: string, body?: T): Promise<Q> =>
    instance.put<Q>(`${ENV.API_ROOT}${url}`, body).then(({ data }) => data),
  delete: <T>(url: string): Promise<T> => instance.delete<T>(`${ENV.API_ROOT}${url}`).then(({ data }) => data),
  patch: <T, Q>(url: string, body?: T): Promise<Q> =>
    instance.patch<Q>(`${ENV.API_ROOT}${url}`, body).then(({ data }) => data),
};

export const API = {
  general: {
    heartBeat: () => requests.get("/health"),
    isDowntime: (): Promise<IsDowntimeResponse> => requests.get("/isDowntime"),
    isWhitelisted: (address: string): Promise<IsWhitelistedResponse> =>
      requests.get(`/isWhitelisted?address=${address}`),
    generateImage: (address: string): Promise<GenerateImageResponse> =>
      requests.get(`/generateImage?address=${address}`),
  },
  invite: {
    isEligible: (walletAddress: string): Promise<IsEligibleResponse> =>
      requests.get(`/isEligible?walletAddress=${walletAddress}`),
    toggleEligibility: (walletAddress: string): Promise<ToggleEligibilityResponse> =>
      requests.post(`/toggleEligibility`, { walletAddress }),
    isValid: (inviteCode: string): Promise<IsValidInviteResponse> =>
      requests.get(`/isValidInviteCode?inviteCode=${inviteCode}`),
    redeemCode: (inviteCode: string, address: string): Promise<RedeemInviteResponse> =>
      requests.post(`/redeemInviteCode`, { inviteCode, address }),
  },
  faucet: {
    claimFunds: (address: string, captcha: string, denomination: Denomination = "eth"): Promise<FaucetResponse> =>
      requests.post(`/claimFunds`, { to: address, "cf-turnstile-response": captcha, denomination }),
    getStats: (address: string): Promise<FaucetStatsResponse> => requests.get(`/stats?address=${address}`),
    getBalance: (): Promise<FaucetBalanceResponse> => requests.get(`/faucetBalance`),
  },
  jobs: {
    redeemCode: (jobId: string): Promise<RedeemInviteJobResponse[]> => requests.get(`/job/inviteCode/${jobId}`),
    claimFunds: (jobId: string): Promise<FaucetJobResponse[]> => requests.get(`/job/faucet/${jobId}`),
  },
};
