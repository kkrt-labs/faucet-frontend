import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { IconLink } from "./icon-link";

export const Navbar = () => {
  return (
    <nav className="flex w-full">
      <ul className="flex flex-row justify-between items-center w-full">
        <li>
          <Link
            className="pointer-events-none flex place-items-center gap-2 py-6 lg:py-8 lg:pointer-events-auto lg:p-0"
            href="/"
          >
            <Image
              src="/assets/kakarot-logo.svg"
              alt="Kakarot Logo"
              className="dark:invert"
              width={137}
              height={40}
              priority
            />
          </Link>
        </li>
        <li className="sm:inline-flex flex-row items-center space-x-6 hidden">
          <IconLink src="/assets/x-icon.svg" href="https://x.com" name="X" />
          <IconLink src="/assets/discord-icon.svg" href="https://discord.com" name="Discord" />
          <IconLink src="/assets/farcaster-icon.svg" href="https://farcaster.xyz/" name="Farcaster" />
          <Link href="/">
            <Button className="space-x-2" variant="reverse" size="withIcon">
              <span>Read Docs</span>
              <Image src="/assets/docs-icon.svg" alt="Docs" width={16} height={16} />
            </Button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
