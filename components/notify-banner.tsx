"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LOCAL_STORAGE_KEY = "discordBotAnnouncement";

const LinkBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "true";
    setShowBanner(shouldShow === "true");
  }, []);

  return (
    <div
      className={cn(
        "sticky w-screen flex bg-[#2A2927] justify-center items-center py-3 px-2 text-center",
        !showBanner && "hidden"
      )}
    >
      <p className="text-white mt-6 lg:mt-0">
        We are officially on Kakarot Starknet Sepolia! If you&apos;re an OG farmer, claim your
        <Link rel="noopener noreferrer" target="_blank" href="/spirit-karrot" className="text-kkrtOrange ml-1">
          Spirit Karrot!
        </Link>
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
