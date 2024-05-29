import { useMutation } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface CheckInviteCodeParams {
  inviteCode: string;
}

// NOTE: mutations are generally used for POST, PUT, DELETE, etc., --  you can technically use them for GET requests if you need to trigger them manually or handle them differently from typical data fetching scenarios. However, it’s crucial to consider the semantic meaning of mutations in the context of APIs and maintain consistency with how these operations are typically handled.
const useInviteCodeValid = () => {
  return useMutation({
    mutationKey: ["inviteCodeValid"],
    mutationFn: (params: CheckInviteCodeParams) => API.invite.isValid(params.inviteCode),
  });
};

export { useInviteCodeValid };
