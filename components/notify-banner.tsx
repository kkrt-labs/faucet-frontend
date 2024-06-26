"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const LinkBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem("showBanner") ?? "true";
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
        Hurray 🎉 we just shipped some new improvements to our faucet. Need help? Reach out to us on{" "}
        <a rel="noopener noreferrer" target="_blank" href="https://discord.gg/kakarotzkevm" className="text-kkrtOrange">
          Discord
        </a>
      </p>
      <button
        className="absolute right-5 top-3"
        onClick={() => {
          setShowBanner(false);
          localStorage.setItem("showBanner", "false");
        }}
      >
        <X className="h-5 w-5 shrink-0 text-[#8E98A8]" />
      </button>
    </div>
  );
};

export { LinkBanner };
