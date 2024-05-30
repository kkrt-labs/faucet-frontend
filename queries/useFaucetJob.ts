import { useRef } from "react";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface FaucetJobParams {
  jobId: string;
}

const isComplete = (query: any, timePassed: number) =>
  (query.state.data && query.state.data[0].status === "completed") || timePassed > 60;

const useFaucetJob = (jobId: string) => {
  const countRef = useRef(0);
  return useQuery({
    queryKey: ["useFaucetJob", jobId],
    queryFn: () => {
      countRef.current += 1;
      return API.jobs.claimFunds(jobId);
    },
    enabled: !!jobId && countRef.current < 60,
    refetchInterval: (query) => (isComplete(query, countRef.current) ? false : 2000),
  });
};

export { useFaucetJob };
