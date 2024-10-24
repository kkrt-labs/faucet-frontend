import { useMutation } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface ToggleEligibilityParams {
  walletAddress: string;
}

const useToggleEligibility = () => {
  return useMutation({
    mutationKey: ["toggleEligibility"],
    mutationFn: (params: ToggleEligibilityParams) => API.invite.toggleEligibility(params.walletAddress),
  });
};

export { useToggleEligibility };
