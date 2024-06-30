import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RATE_LIMIT_KEY } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redirectToRateLimit() {
  // Redirect to rate limit page
  // add 1 hour to current time
  const startTime = new Date();
  const rateLimitTime = new Date();
  rateLimitTime.setHours(startTime.getHours() + 1);

  localStorage.setItem(
    RATE_LIMIT_KEY,
    JSON.stringify({
      rateLimitTime: rateLimitTime.getTime(),
      startTime: startTime.getTime(),
    })
  );
  window.location.href = "/rate-limit";
}
