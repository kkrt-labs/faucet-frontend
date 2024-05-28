import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface InviteCodeJobParams {
  jobId: string;
}

const isComplete = (query: any) => query.state.data && query.state.data[0].status === "completed";

const useInviteCodeJob = (jobId: string) => {
  return useQuery({
    queryKey: ["useInviteCodeJob", jobId],
    queryFn: () => API.jobs.redeemCode(jobId),
    refetchInterval: (query) => (isComplete(query) ? false : 2000),
  });
};

export { useInviteCodeJob };
