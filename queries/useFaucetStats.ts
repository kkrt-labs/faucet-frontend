import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";
import { FaucetStatsResponse } from "@/lib/types";

const useFaucetStats = (address: string) => {
  return useQuery({
    queryKey: ["useFaucetStats"],
    queryFn: () => API.faucet.getStats(address),
    refetchInterval: 1000,
    enabled: !!address,
  });
};

export { useFaucetStats };
