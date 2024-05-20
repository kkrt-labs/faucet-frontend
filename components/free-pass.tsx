import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Footer } from "./mobile-footer";

import dummyFreePass from "@/public/assets/dummy-free-pass.svg";
import mintingIcon from "@/public/assets/mining-icon.svg";

export const FreePass = () => {
  return (
    <div
      className="flex flex-col justify-center items-center bg-white w-full py-16 rounded-md"
      style={{
        backgroundImage: `url("/assets/background.svg")`,
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      <div className="flex flex-col justify-center items-center max-w-xl">
        <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-[52px]">Claim your Free Pass</h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6 text-center text-[#878794]">
          Welcome to Kakraot beta testnet phase to commemorate this event. <br />
          Claim your free OG Pass by Kakarot Labs.
        </p>
        <Image src={dummyFreePass} width={400} height={400} alt="Free Pass" className="mt-12" />
        <Button variant="main" className="mt-4 md:mt-8 w-full max-w-[400px]">
          Claim your Pass
        </Button>
        <Button variant="outline" className="mt-4 w-full max-w-[400px] text-[#878794]">
          <Image src={mintingIcon} alt="minting" width={24} height={24} priority className="w-[30px] h-6" />
          <span>Minting in Progress</span>
        </Button>
        <Button variant="success" className="mt-4 w-full max-w-[400px]">
          Claimed
        </Button>
      </div>
      <Footer />
    </div>
  );
};
