import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

const useGetSpiritKarrotDetails = (walletAddress: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["spiritKarrotDetails", walletAddress],
    queryFn: () => API.general.spiritKarrotDetails(walletAddress),
    enabled: enabled && !!walletAddress,
  });
};

export { useGetSpiritKarrotDetails };
