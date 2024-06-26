"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { IconLink } from "./icon-link";
import { WalletDetails } from "./wallet-details";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useFaucet } from "@/hooks/useFaucet";

export const Navbar = () => {
  const { width } = useWindowSize();
  const { wallet } = useFaucet();
  const isMobile = width < 700 && wallet;
  return (
    <nav className="flex w-full justify-center pt-5">
      <ul className="flex flex-row justify-between items-center w-full max-w-7xl bg-white rounded-xl px-6">
        <li>
          <Link className="pointer-events-none flex place-items-center gap-2 py-6" href="/">
            <Image
              src={isMobile ? "/assets/kakarot-logo-mobile.svg" : "/assets/kakarot-logo.svg"}
              alt="Kakarot Logo"
              className={cn("dark:invert shrink-0", !isMobile && "min-w-24")}
              width={isMobile ? 28 : 137}
              height={isMobile ? 28 : 40}
              priority
            />
          </Link>
        </li>
        <li className="sm:inline-flex flex-row items-center md:space-x-6 space-x-0 hidden">
          <IconLink src="/assets/x-icon.svg" href="https://x.com/KakarotZkEvm" name="X" className="hidden md:block" />
          <IconLink
            src="/assets/discord-icon.svg"
            href="https://discord.gg/kakarotzkevm"
            name="Discord"
            className="hidden md:block"
          />
          {/* <IconLink src="/assets/farcaster-icon.svg" href="https://farcaster.xyz/" name="Farcaster" /> */}
          <Link href="https://docs.kakarot.org/" rel="noopener noreferrer" target="_blank">
            <Button className="space-x-2" variant="outline" size="withIcon">
              <span className="text-[#ff4500]">Read Docs</span>
              <Image src="/assets/docs-icon.svg" alt="Docs" width={16} height={16} />
            </Button>
          </Link>
          <WalletDetails />
        </li>
        <li className="sm:hidden">
          <WalletDetails />
        </li>
      </ul>
    </nav>
  );
};
