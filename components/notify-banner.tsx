"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCAL_STORAGE_KEY = "discordBotAnnouncement";

const LinkBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "true";
    setShowBanner(shouldShow === "true");
  });

  return (
    <div
      className={cn(
        "sticky w-screen flex bg-[#2A2927] justify-center items-center py-3 px-2 text-center -mx-4 sm:-mx-20",
        !showBanner && "hidden"
      )}
    >
      <p className="text-white mt-6 lg:mt-0">
        If you don&apos;t have enough ETH on Ethereum Mainnet, join our Discord server to easily claim your testnet
        funds through our discord bot!
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://discord.gg/kakarotzkevm"
          className="text-kkrtOrange ml-1"
        >
          Join Discord
        </a>
      </p>
      <button
        className="absolute right-5 top-3"
        onClick={() => {
          setShowBanner(false);
          localStorage.setItem(LOCAL_STORAGE_KEY, "false");
        }}
      >
        <X className="h-5 w-5 shrink-0 text-[#8E98A8]" />
      </button>
    </div>
  );
};

export { LinkBanner };
