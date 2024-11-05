// central store for loading faucet data
import {
  useActiveAccount,
  useAutoConnect,
  useConnectedWallets,
} from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb-client";
import { useFaucetBalance } from "@/queries/useFaucetBalance";
import { useFaucetStats } from "@/queries/useFaucetStats";
import { useIsWhitelisted } from "@/queries/useIsWhitelisted";

const useFaucet = () => {
  const wallet = useActiveAccount();
  const activeWallets = useConnectedWallets();
  const { isLoading: isAutoConnecting } = useAutoConnect({ client, wallets });
  const {
    data: faucetBalance,
    refetch: refetchFaucet,
    isLoading: isFetchingFaucetBalance,
  } = useFaucetBalance();
  const {
    data: faucetStats,
    isLoading: isFetchingFaucetStats,
    refetch: refetchFaucetStats,
  } = useFaucetStats(wallet?.address as string);

  return {
    isFaucetLoading:
      isAutoConnecting || isFetchingFaucetStats || isFetchingFaucetBalance,
    wallet,
    faucetBalance,
    faucetStats,
    refetchFaucet,
    refetchFaucetStats,
    activeWallets,
  };
};

export { useFaucet };
