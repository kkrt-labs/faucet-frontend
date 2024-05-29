import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
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
    refetchInterval: (query) => (isComplete(query, countRef.current) ? false : 1000),
  });
};

export { useFaucetJob };
