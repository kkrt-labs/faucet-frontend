import { useMutation } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface RedeemCodeParams {
  inviteCode: string;
  walletAddress: string;
}

const useRedeemCode = () => {
  return useMutation({
    mutationKey: ["redeemCode"],
    mutationFn: (params: RedeemCodeParams) => API.invite.redeemCode(params.inviteCode, params.walletAddress),
  });
};

export default useRedeemCode;
