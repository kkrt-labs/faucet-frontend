import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

const useSpiritKarrot = (walletAddress: string) => {
  return useQuery({
    queryKey: ["spiritKarrot", walletAddress],
    queryFn: () => API.general.spiritKarrot(walletAddress),
    enabled: !!walletAddress,
  });
};

export { useSpiritKarrot };
