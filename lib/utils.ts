import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RATE_LIMIT_KEY } from "./constants";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redirectToRateLimit(error: AxiosError) {
  const startTime = new Date();
  const retryAfter = error.response?.headers["retry-after"]; // in seconds

  localStorage.setItem(
    RATE_LIMIT_KEY,
    JSON.stringify({
      rateLimitTime: startTime.getTime() + retryAfter * 1000,
      startTime: startTime.getTime(),
    })
  );
  window.location.href = "/rate-limit";
}
