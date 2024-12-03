"use client";

import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IconLink } from "./icon-link";
import { WalletDetails } from "./wallet-details";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useFaucet } from "@/hooks/useFaucet";
import { ArrowUpRight, EllipsisIcon } from "lucide-react";
import { useActiveWallet, useActiveWalletChain } from "thirdweb/react";
import { client, KAKAROT_SEPOLIA } from "@/lib/thirdweb-client";
import { BUG_FORM, FEEDBACK_TYPEFORM, KKRT_RPC_DETAILS } from "@/lib/constants";
import { useEffect } from "react";

export const Navbar = () => {
  const { width } = useWindowSize();
  const { wallet } = useFaucet();
  const isMobile = width < 900 && wallet;
  return (
    <nav className="flex w-full justify-center pt-5">
      <ul className="flex flex-row justify-between items-center w-full px-6 md:px-0 sm:max-w-[680px]">
        <Link className=" flex place-items-center gap-2 py-6" href="/">
          <Image
            src={
              isMobile
                ? "/assets/kakarot-logo-mobile.svg"
                : "/assets/kakarot-logo.svg"
            }
            alt="Kakarot Logo"
            className={cn("dark:invert shrink-0", !isMobile && "min-w-24")}
            width={isMobile ? 28 : 137}
            height={isMobile ? 28 : 40}
            priority
          />
        </Link>

        <li className="flex flex-row items-center space-x-3">
          <Link
            className="font-medium text-[#003e2a] lg:text-lg"
            href="https://docs.kakarot.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Docs
            <ArrowUpRight size={16} className="inline-block ml-1 mb-1" />
          </Link>
        </li>
        <li className="hidden md:inline-flex flex-row items-center md:space-x-4 space-x-0">
          <IconLink
            src="/assets/x-icon.svg"
            href="https://x.com/KakarotZkEvm"
            name="X"
          />
          <IconLink
            src="/assets/discord-icon.svg"
            href="https://discord.gg/kakarotzkevm"
            name="Discord"
          />
          <WalletDetails />
        </li>
      </ul>
    </nav>
  );
};

const DropdownCTA = () => {
  const wallet = useActiveWallet();
  const chainId = useActiveWalletChain();
  useEffect(() => {
    if (wallet) wallet.autoConnect({ client });
  }, [wallet, chainId]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border py-2 px-3 rounded-md shadow-sm">
        <EllipsisIcon size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#FFF4E0]">
        <DropdownMenuItem className="group text-[#003d29] hover:underline hover:text-white">
          <Link
            href="https://discord.gg/kakarotzkevm"
            rel="noopener noreferrer"
            target="_blank"
          >
            Discord Faucet
            <ArrowUpRight
              size={16}
              className="inline-block mb-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="group text-[#003d29] hover:underline hover:text-white">
          <div>
            {wallet && chainId?.id !== KAKAROT_SEPOLIA.id ? (
              <span onClick={() => wallet?.switchChain(KAKAROT_SEPOLIA)}>
                Add Network
              </span>
            ) : (
              <Link
                href={KKRT_RPC_DETAILS}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Network Details</span>
                <ArrowUpRight
                  size={16}
                  className="inline-block mb-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="group text-[#003d29] hover:underline hover:text-white">
          <Link href={BUG_FORM} rel="noopener noreferrer" target="_blank">
            Report a Bug
            <ArrowUpRight
              size={16}
              className="inline-block mb-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[#003d29] hover:underline hover:text-white">
          <Link href={"/spirit-karrot"}>
            Spirit Karrot
            <ArrowUpRight size={16} className="inline-block ml-1 mb-1" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
