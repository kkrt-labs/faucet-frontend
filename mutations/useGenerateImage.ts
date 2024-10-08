import { useMutation } from "@tanstack/react-query";
import { API } from "@/lib/api";

interface GenerateImageParams {
  address: string;
}

const useGenerateImage = () => {
  return useMutation({
    mutationKey: ["generateImage"],
    mutationFn: (params: GenerateImageParams) => API.general.generateImage(params.address),
  });
};

export { useGenerateImage };
