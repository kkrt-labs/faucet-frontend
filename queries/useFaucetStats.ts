import { useQuery } from "@tanstack/react-query";
import { Contract, providers, ethers } from "ethers";
import FAUCET_ABI from "@/public/contracts/Faucet.json";
import { ENV } from "@/lib/constants";

const FAUCET_ADDRESS = ENV.NEXT_PUBLIC_IS_DEVELOPMENT
  ? "0xC98B2948D087f601415b694c81dE3e9D0B5C5141"
  : "0xe4A429142811A75611991405f66689510bc86E67";

const useFaucetStats = (address: string) => {
  const rpcProvider = new providers.JsonRpcProvider(
    "https://sepolia-rpc.kakarot.org",
  );
  const faucetContract = new Contract(
    FAUCET_ADDRESS,
    FAUCET_ABI.abi,
    rpcProvider,
  );

  return useQuery({
    queryKey: ["useFaucetStats", address],
    queryFn: async () => {
      try {
        // Fetch all stats using individual calls to match backend implementation
        const lastClaimTimestamp = await faucetContract.lastClaimed(address);
        const lastClaimTimestampUSDC =
          await faucetContract.lastClaimedUSDC(address);
        const lastClaimTimestampUSDT =
          await faucetContract.lastClaimedUSDT(address);
        const cooldownDuration = await faucetContract.cooldownDuration();

        // Calculate time left for claims
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const calculateTimeLeft = (lastClaimTimestamp: bigint) =>
          lastClaimTimestamp
            ? Number(cooldownDuration) -
              (currentTimeInSeconds - Number(lastClaimTimestamp))
            : 0;

        const timeLeftETHInSeconds = calculateTimeLeft(lastClaimTimestamp);
        const timeLeftUSDCInSeconds = calculateTimeLeft(lastClaimTimestampUSDC);
        const timeLeftUSDTInSeconds = calculateTimeLeft(lastClaimTimestampUSDT);

        return {
          timeLeftETHInS: Math.max(timeLeftETHInSeconds, 0),
          timeLeftUSDCInS: Math.max(timeLeftUSDCInSeconds, 0),
          timeLeftUSDTInS: Math.max(timeLeftUSDTInSeconds, 0),
          canClaimETH: timeLeftETHInSeconds <= 0,
          canClaimUSDC: timeLeftUSDCInSeconds <= 0,
          canClaimUSDT: timeLeftUSDTInSeconds <= 0,
          dripAmountInEth: ENV.NEXT_PUBLIC_DRIP_AMOUNT_ETH,
          dripAmountUSDC: "1.0",
          dripAmountUSDT: "1.0",
        };
      } catch (error) {
        throw new Error(`Failed to fetch faucet stats: ${error}`);
      }
    },
    enabled: !!address,
  });
};

export { useFaucetStats };
