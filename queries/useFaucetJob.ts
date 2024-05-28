import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface FaucetJobParams {
  jobId: string;
}

const isComplete = (query: any) => query.state.data && query.state.data[0].status === "completed";

const useFaucetJob = (jobId: string) => {
  return useQuery({
    queryKey: ["useFaucetJob", jobId],
    queryFn: () => API.jobs.claimFunds(jobId),
    refetchInterval: (query) => (isComplete(query) ? false : 2000),
  });
};

export { useFaucetJob };
