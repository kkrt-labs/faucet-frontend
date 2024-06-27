import axios from "axios";
import { ENV } from "./constants";
import type { AxiosRequestConfig } from "axios";
import {
  FaucetBalanceResponse,
  FaucetJobResponse,
  FaucetResponse,
  FaucetStatsResponse,
  IsValidInviteResponse,
  IsWhitelistedResponse,
  RedeemInviteJobResponse,
  RedeemInviteResponse,
} from "./types";

const instance = axios.create({
  headers: {
    Authorization: `Bearer ${ENV.NEXT_PUBLIC_BEARER_TOKEN}`,
  },
});

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
    isWhitelisted: (address: string): Promise<IsWhitelistedResponse> =>
      requests.get(`/isWhitelisted?address=${address}`),
  },
  invite: {
    isValid: (inviteCode: string): Promise<IsValidInviteResponse> =>
      requests.get(`/isValidInviteCode?inviteCode=${inviteCode}`),
    redeemCode: (inviteCode: string, address: string): Promise<RedeemInviteResponse> =>
      requests.post(`/redeemInviteCode`, { inviteCode, address }),
  },
  faucet: {
    claimFunds: (address: string): Promise<FaucetResponse> => requests.post(`/claimFunds`, { to: address }),
    getStats: (address: string): Promise<FaucetStatsResponse> => requests.get(`/stats?address=${address}`),
    getBalance: (): Promise<FaucetBalanceResponse> => requests.get(`/faucetBalance`),
  },
  jobs: {
    redeemCode: (jobId: string): Promise<RedeemInviteJobResponse[]> => requests.get(`/job/inviteCode/${jobId}`),
    claimFunds: (jobId: string): Promise<FaucetJobResponse[]> => requests.get(`/job/faucet/${jobId}`),
  },
};
