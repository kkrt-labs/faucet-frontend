"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsEligible } from "@/queries/useIsEligible";
import { useFaucet } from "@/hooks/useFaucet";
import { useGenerateImage } from "@/mutations/useGenerateImage";
import { useToggleEligibility } from "@/mutations/useToggleEligibility";

function KakarotOG() {
  const { wallet } = useFaucet();
  const { mutate: toggleEligibility } = useToggleEligibility();
  return (
    <main className="flex flex-col items-center text-center my-20 h-full">
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">
        {" "}
        Woo-hoo, welcome back <br /> OG Kakarot Farmer!
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground">
        Welcome back OG Kakarot Farmer! Our testnet was reset, but your Spirit Karrot will live on forever.
      </p>

      <div className="max-w-7xl">
        <Link href={"/spirit-karrot"} className="w-full">
          <Button variant="main" className="mt-6 w-full">
            Meet my Spirit Karrot
          </Button>
        </Link>

        <Dialog>
          <DialogTrigger className="w-full">
            <Button className="space-x-2 w-full mt-2" variant="outline" size="withIcon">
              <span>Back to Faucet</span>
              <Image src="/assets/link-icon.svg" alt="Docs" width={16} height={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>⚠️ Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                <p>Warning: OG Kakarot farmers can only meet their spirit Karrot once.</p>
                <div className="flex flex-row w-full space-x-2 mt-4">
                  <Link href={"/faucet"} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toggleEligibility({ walletAddress: wallet?.address ?? "" })}
                    >
                      Yes, bye
                    </Button>
                  </Link>
                  <Link href={"/spirit-karrot"} className="w-full">
                    <Button variant="main" className="w-full">
                      Okay then, let's meet!
                    </Button>
                  </Link>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

export { KakarotOG };
