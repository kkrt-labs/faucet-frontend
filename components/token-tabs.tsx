import Image from "next/image";
import { Denomination, FaucetStatsResponse } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ethLogo from "@/public/assets/ethereum.svg";
import usdcLogo from "@/public/assets/usdc.svg";
import usdtLogo from "@/public/assets/usdt.svg";
interface TokenTabsProps {
  setDenomination: (denomination: Denomination) => void;
  faucetStats?: FaucetStatsResponse;
}
const TokenTabs = ({ setDenomination, faucetStats }: TokenTabsProps) => {
  return (
    <Tabs defaultValue="eth" className="-mt-14">
      <TabsList className="py-7 space-x-10">
        <TabsTrigger value="eth" className="space-x-2" onClick={() => setDenomination("eth")}>
          <Image src={ethLogo} width={24} height={24} alt="ETH" />
          <span>ETH</span>
        </TabsTrigger>
        <TabsTrigger value="usdc" className="space-x-2" onClick={() => setDenomination("usdc")}>
          <Image src={usdcLogo} width={24} height={24} alt="USDC" />
          <span>USDC</span>
        </TabsTrigger>
        <TabsTrigger value="usdt" className="space-x-2" onClick={() => setDenomination("usdt")}>
          <Image src={usdtLogo} width={24} height={24} alt="USDT" />
          <span>USDT</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="eth">
        <h2 className="mt-10 text-5xl md:text-7xl leading-tight text-[#878794] font-medium">
          {faucetStats?.dripAmountInEth} ETH
        </h2>
      </TabsContent>
      <TabsContent value="usdc">
        <h2 className="mt-10 text-5xl md:text-7xl leading-tight text-[#878794] font-medium">
          {faucetStats?.dripAmountUSDC} USDC
        </h2>
      </TabsContent>
      <TabsContent value="usdt">
        <h2 className="mt-10 text-5xl md:text-7xl leading-tight text-[#878794] font-medium">
          {faucetStats?.dripAmountUSDT} USDT
        </h2>
      </TabsContent>
    </Tabs>
  );
};

export { TokenTabs };
