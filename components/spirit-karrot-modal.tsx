"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}

export default function SpiritKarrotModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();

  React.useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenSpiritKarrotModal");
    if (
      !hasSeenModal &&
      pathname !== "/spirit-karrot"
    ) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenSpiritKarrotModal", "true");
  };

  const Content = () => (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex flex-col items-center space-y-4 p-4">
        <div className="grid items-start justify-center max-h-[400px] max-w-[320px]">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-kkrtOrange  to-[#0DAB0D] rounded-md blur opacity-85 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
            <Image
              src={"/assets/og-border.png"}
              width={400}
              height={400}
              className="relative rounded-md leading-none flex items-center divide-x divide-gray-600"
              alt="Spirit Karrot"
            />
          </div>
        </div>
        <div className="max-w-7xl w-full" onClick={handleClose}>
          <Link href={"/spirit-karrot"} className="w-full">
            <Button variant="main" className="mt-6 w-full">
              Meet my Spirit Karrot
            </Button>
          </Link>
        </div>
        <Link href={"/faucet"} onClick={handleClose} className="w-full">
          <Button
            className="space-x-2 w-full"
            variant="outline"
            size="withIcon"
          >
            <span>Back to Faucet</span>
            <Image
              src="/assets/link-icon.svg"
              alt="Docs"
              width={16}
              height={16}
            />
          </Button>
        </Link>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl">
              🥕 Welcome back &#59;&#41;
            </DialogTitle>
            <DialogDescription>
              Good to see you again, farmer. Testnet has moved to Starknet
              Sepolia, but your Spirit Karrot will live on forever.
            </DialogDescription>
          </DialogHeader>
          <Content />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-3xl">
            🥕 Welcome back &#59;&#41;
          </DrawerTitle>
          <DrawerDescription>
            Good to see you again, farmer. Testnet has moved to Starknet
            Sepolia, but your Spirit Karrot will live on forever.
          </DrawerDescription>
        </DrawerHeader>
        <Content />
      </DrawerContent>
    </Drawer>
  );
}
