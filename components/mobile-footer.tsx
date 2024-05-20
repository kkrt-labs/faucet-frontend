import Image from "next/image";
import Link from "next/link";
import { IconLink } from "./icon-link";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center space-y-6 pt-10 pb-4 sm:hidden">
      <div className="flex flex-row items-center space-x-6">
        <IconLink src="/assets/x-icon.svg" href="https://x.com" name="X" />
        <IconLink src="/assets/discord-icon.svg" href="https://discord.com" name="Discord" />
        <IconLink src="/assets/farcaster-icon.svg" href="https://farcaster.xyz/" name="Farcaster" />
      </div>
      <Link href="/">
        <Button className="space-x-2" variant="outline" size="withIcon">
          <span className="text-[#ff4500]">Read Docs</span>
          <Image src="/assets/docs-icon.svg" alt="Docs" width={16} height={16} />
        </Button>
      </Link>
    </footer>
  );
};
