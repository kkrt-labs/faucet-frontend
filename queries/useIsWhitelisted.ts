import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface IsWhitelistedParams {
  address: string;
}

const useIsWhitelisted = (address: string) => {
  return useQuery({
    queryKey: ["useIsWhitelisted", address],
    queryFn: () => API.general.isWhitelisted(address),
    staleTime: 1 * 60 * 1000,
  });
};

export { useIsWhitelisted };
