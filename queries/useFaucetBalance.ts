import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

const useFaucetBalance = () => {
  return useQuery({ queryKey: ["faucetBalance"], queryFn: () => API.faucet.getBalance(), refetchInterval: false });
};

export { useFaucetBalance };
