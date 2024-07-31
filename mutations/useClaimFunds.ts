import { useMutation } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface ClaimFundsParams {
  walletAddress: string;
  captchaCode: string;
}

const useClaimFunds = () => {
  return useMutation({
    mutationKey: ["claimFunds"],
    mutationFn: (params: ClaimFundsParams) => API.faucet.claimFunds(params.walletAddress, params.captchaCode),
  });
};

export { useClaimFunds };
