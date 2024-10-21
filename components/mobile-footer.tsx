"use client";

import Image from "next/image";
import Link from "next/link";

import carrotField from "@/public/assets/carrot-cut.svg";
import { IconLink } from "@/components/icon-link";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="px-4 sm:px-20 mt-auto overflow-x-hidden">
      <div className="flex flex-col w-screen -mx-4 sm:-mx-20 mt-auto">
        <div className="flex flex-col items-center space-y-6 pb-4 sm:hidden">
          <div className="flex flex-row items-center space-x-6">
            <IconLink src="/assets/x-icon.svg" href="https://x.com/KakarotZkEvm" name="X" />
            <IconLink src="/assets/discord-icon.svg" href="https://discord.gg/kakarotzkevm" name="Discord" />
          </div>

          <Link href="https://docs.kakarot.org/" rel="noopener noreferrer" target="_blank">
            <Button className="space-x-2" variant="outline" size="withIcon">
              <span className="text-kkrtOrange">Read Docs</span>
              <Image src="/assets/docs-icon.svg" alt="Docs" width={16} height={16} />
            </Button>
          </Link>
        </div>
        <Image src={carrotField} alt="" className="w-full" />
      </div>
    </footer>
  );
};
