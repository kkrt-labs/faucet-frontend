"use client";

import Image from "next/image";
import Link from "next/link";

import carrotField from "@/public/assets/carrot-cut.svg";
import { IconLink } from "@/components/icon-link";
import { Button } from "@/components/ui/button";
import { useWindowSize } from "@/hooks/useWindowSize";

export const Footer = () => {
  const { height, width } = useWindowSize();

  if (
    (width < 500 && height > 965) ||
    (width < 640 && width > 500 && height > 955) ||
    (width < 1535 && width > 640 && height > 1130) ||
    (height > 1200 && width > 1535)
  ) {
    return (
      <footer
        className="absolute bottom-0 -mx-4 sm:-mx-20 h-40 sm:h-60 2xl:h-80 overflow-hidden w-full"
        style={{
          backgroundImage: `url("/assets/carrot-field.svg")`,
          backgroundSize: "cover",
          backgroundPositionX: "center",
        }}
      ></footer>
    );
  }

  return (
    <footer className="flex flex-col w-screen -mx-4 sm:-mx-20 mt-10">
      <div className="flex flex-col items-center space-y-6 pb-4 sm:hidden">
        <div className="flex flex-row items-center space-x-6">
          <IconLink src="/assets/x-icon.svg" href="https://x.com/KakarotZkEvm" name="X" />
          <IconLink src="/assets/discord-icon.svg" href="https://discord.gg/kakarotzkevm" name="Discord" />
        </div>

        <Link href="https://docs.kakarot.org/" rel="noopener noreferrer" target="_blank">
          <Button className="space-x-2" variant="outline" size="withIcon">
            <span className="text-[#ff4500]">Read Docs</span>
            <Image src="/assets/docs-icon.svg" alt="Docs" width={16} height={16} />
          </Button>
        </Link>
      </div>
      <Image src={carrotField} alt="" className="w-full" />
    </footer>
  );
};
