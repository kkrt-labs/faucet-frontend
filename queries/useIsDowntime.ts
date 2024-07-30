import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

const useIsDowntime = () => {
  return useQuery({
    queryKey: ["useIsDowntime"],
    queryFn: () => API.general.isDowntime(),
    refetchInterval: 1000 * 10, // 10 seconds
  });
};

export { useIsDowntime };
