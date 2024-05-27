import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface InviteCodeJobParams {
  jobId: string;
}

const useInviteCodeJob = (jobId: string) => {
  return useQuery({
    queryKey: ["useInviteCodeJob", jobId],
    queryFn: () => API.jobs.redeemCode(jobId),
  });
};

export { useInviteCodeJob };
