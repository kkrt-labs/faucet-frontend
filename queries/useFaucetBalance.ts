import { useQuery } from "@tanstack/react-query";
import { Contract, providers, ethers } from "ethers";
import FAUCET_ABI from "@/public/contracts/Faucet.json";
import ERC20_ABI from "@/public/contracts/Token.json";

const FAUCET_ADDRESS = "0xC98B2948D087f601415b694c81dE3e9D0B5C5141";
const USDC_ADDRESS = "0x1B4C0bc8703D3af59322849bE01559fdb920c904";
const USDT_ADDRESS = "0x2BF1004D9e80ca087BD1e089d75bc8c471995aC1";

async function getStableCoinBalance(
  tokenAddress: string,
  provider: providers.JsonRpcProvider,
  faucetAddress: string,
) {
  const tokenContract = new Contract(tokenAddress, ERC20_ABI.abi, provider);
  return await tokenContract.balanceOf(faucetAddress);
}

const useFaucetBalance = () => {
  const rpcProvider = new providers.JsonRpcProvider(
    "https://sepolia-rpc.kakarot.org",
  );
  const faucetContract = new Contract(
    FAUCET_ADDRESS,
    FAUCET_ABI.abi,
    rpcProvider,
  );

  return useQuery({
    queryKey: ["faucetBalance"],
    queryFn: async () => {
      try {
        const [balance, usdtBalance, usdcBalance] = await Promise.all([
          faucetContract.provider.getBalance(FAUCET_ADDRESS),
          getStableCoinBalance(USDT_ADDRESS, rpcProvider, FAUCET_ADDRESS),
          getStableCoinBalance(USDC_ADDRESS, rpcProvider, FAUCET_ADDRESS),
        ]);

        const usdtBalanceInString = ethers.utils.formatUnits(usdtBalance, 6);
        const usdcBalanceInString = ethers.utils.formatUnits(usdcBalance, 6);

        return {
          faucetBalanceInEth: ethers.utils.formatEther(balance),
          usdcBalance: usdcBalanceInString,
          usdtBalance: usdtBalanceInString,
        };
      } catch (error) {
        throw new Error(`Failed to fetch faucet balance: ${error}`);
      }
    },
  });
};

export { useFaucetBalance };
