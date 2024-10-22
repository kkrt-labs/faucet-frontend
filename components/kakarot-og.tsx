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
      <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight md:leading-[3rem] lg:text-[52px]">
        {" "}
        Welcome back &#59;&#41;
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground max-w-lg">
        Good to see you again, farmer. Testnet has moved to Starknet Sepolia, but your Spirit Karrot will live on
        forever.
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
              <DialogTitle>⚠️ Are you sure?</DialogTitle>
              <DialogDescription>
                <p>
                  You only have the chance to meet your Spirit Karrot once. It will disappear if you don&apos;t do it
                  now.
                </p>
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
                      Okay then, let&apos;s meet!
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
