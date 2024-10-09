import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

const useIsEligible = (address: string) => {
  return useQuery({
    queryKey: ["useIsEligible"],
    queryFn: () => API.invite.isEligible(address),
    enabled: !!address,
  });
};

export { useIsEligible };
