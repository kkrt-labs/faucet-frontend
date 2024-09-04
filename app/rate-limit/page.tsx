"use client";
import { useEffect, useState } from "react";
import { RATE_LIMIT_KEY } from "@/lib/constants";
import { CarrotContainer } from "@/components/carrot-container";
import { InfoCarrot } from "@/components/info-carrot";
import rateCarrot from "@/public/assets/carrot-limit.svg";

export default function RateLimit() {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const left = localStorage.getItem(RATE_LIMIT_KEY);
    if (!left) {
      window.location.href = "/faucet";
      return;
    }

    const updateCountdown = () => {
      const { rateLimitTime, startTime } = JSON.parse(left);
      const currentTime = new Date();
      // if current time is between start and rate limit time show the time left else redirect to faucet
      if (currentTime < rateLimitTime && currentTime > startTime) {
        const diff = rateLimitTime - currentTime.getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        localStorage.removeItem(RATE_LIMIT_KEY);
        window.location.href = "/faucet";
      }
    };

    // Update countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex flex-col items-center mt-10 h-full">
      <div className="flex flex-col bg-white w-full py-6 px-3 sm:px-10 lg:px-20 rounded-md mb-12 border border-[#2e2e342e]">
        <CarrotContainer>
          <InfoCarrot
            imageAlt="Rate Limit"
            carrotSrc={rateCarrot}
            description="Looks like you're using the faucet a tad too much. Let's wait together for a few minutes until it cools down. If you feel this is an error, reach out to us."
          />
          <span className="text-kkrtOrange text-3xl font-semibold">{timeLeft}</span>
        </CarrotContainer>
      </div>
    </main>
  );
}
