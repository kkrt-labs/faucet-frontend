import Image from "next/image";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInviteCodeJob } from "@/queries/useInviteCodeJob";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import dummyFreePass from "@/public/assets/dummy-free-pass.svg";
import mintingIcon from "@/public/assets/mining-icon.svg";
import linkIcon from "@/public/assets/link-icon.svg";
import xIcon from "@/public/assets/x-icon-inverted.svg";

export const FreePass = ({ shouldGoToFaucet }: { shouldGoToFaucet: () => void }) => {
  const queryClient = useQueryClient();
  const redeemCodeResult = queryClient.getQueryData(["redeemCodeData"]);
  const { data: inviteCodeJob } = useInviteCodeJob(redeemCodeResult as string);

  useEffect(() => {
    if (inviteCodeJob && inviteCodeJob[0].status === "error") {
      console.error("Error redeeming invite code");
      shouldGoToFaucet();
    }
  }, [inviteCodeJob]);

  return (
    <div
      className="flex flex-col justify-center items-center bg-white w-full py-16 px-3 rounded-md"
      style={{
        backgroundImage: `url("/assets/background.svg")`,
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      <div className="flex flex-col justify-center items-center text-center max-w-xl">
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight lg:text-[52px]">
          Claim your Free Pass
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6  text-[#878794]">
          Welcome to Kakraot beta testnet phase to commemorate this event. <br />
          Claim your free OG Pass by Kakarot Labs.
        </p>
        <Image src={dummyFreePass} width={400} height={400} alt="Free Pass" className="mt-12" />
        {/* <Button variant="main" className="mt-4 md:mt-8 w-full max-w-[400px]">
          Claim your Pass
        </Button> */}
        {inviteCodeJob && inviteCodeJob[0].status === "completed" ? (
          // <Button variant="success" className="mt-4 w-full max-w-[400px]">
          //   Claimed
          // </Button>
          <ClaimedModal shouldGoToFaucet={shouldGoToFaucet} />
        ) : (
          <Button variant="outline" className="mt-4 w-full max-w-[400px] text-[#878794]">
            <Image src={mintingIcon} alt="minting" width={24} height={24} priority className="w-[30px] h-6" />
            <span>Minting in Progress</span>
          </Button>
        )}
      </div>
    </div>
  );
};

const ClaimedModal = ({ shouldGoToFaucet }: { shouldGoToFaucet: () => void }) => {
  const [runConfetti, setRunConfetti] = useState(false);
  const CONFETTI_COLORS = ["#FDA829", "#F6F5FC", "#FF2828"];

  return (
    <Dialog>
      <div className="flex w-full space-x-3  max-w-[400px]">
        <Button variant="success" className="mt-4 w-full">
          Claimed
        </Button>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4 w-full text-[#878794] gap-1" onClick={() => setRunConfetti(true)}>
            <span>Tx Hash</span>
            <Image src={linkIcon} alt="minting" width={20} height={20} priority />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-lg">
        <Confetti
          colors={CONFETTI_COLORS}
          run={runConfetti}
          numberOfPieces={500}
          recycle={false}
          className="!-inset-3/4"
        />
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="text-[#ff5400] text-2xl sm:text-3xl leading-9 font-medium">
            Congratulations!
          </DialogTitle>
          <DialogDescription className="text-center">
            Welcome to Kakraot beta testnet phase to commemorate this event. <br />
            Claim your free OG Pass by Kakarot Labs.
          </DialogDescription>
        </DialogHeader>
        <Image src={dummyFreePass} width={400} height={200} alt="Free Pass" className="w-full" />
        <DialogFooter className="sm:justify-start">
          <Button variant="outline" className="mt-4 w-full gap-1 !bg-black !text-white">
            <span>Share on</span>
            <Image src={xIcon} alt="minting" width={20} height={20} priority />
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4 w-full text-[#ff4500]" onClick={shouldGoToFaucet}>
              Go to faucet
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
