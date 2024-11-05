import { useQuery } from "@tanstack/react-query";
import { Contract, providers } from "ethers";
import NFT_ABI from "@/public/contracts/AirdropNFTABI.json";

const NFT_CONTRACT_ADDRESS = "0xb45E3EfCd7C21120a335F75f1a02985d94285827";

const getNFTBalance = async (
  contractAddress: string,
  provider: providers.JsonRpcProvider,
  walletAddress: string,
) => {
  const contract = new Contract(contractAddress, NFT_ABI.abi, provider);
  const balance = await contract.balanceOf(walletAddress);
  return balance;
};

const useIsSpiritKarrotOwner = (walletAddress?: string) => {
  const rpcProvider = new providers.JsonRpcProvider(
    "https://sepolia-rpc.kakarot.org",
  );

  return useQuery({
    queryKey: ["isSpiritKarrotOwner", walletAddress],
    queryFn: async () => {
      try {
        if (!walletAddress) {
          throw new Error("Wallet address is required");
        }

        const balance = await getNFTBalance(
          NFT_CONTRACT_ADDRESS,
          rpcProvider,
          walletAddress,
        );

        const balanceNumber = Number(balance);

        return {
          isOwner: balanceNumber > 0,
          balance: balanceNumber,
        };
      } catch (error) {
        throw new Error(`Error fetching spirit karrot owner: ${error}`);
      }
    },
    enabled: !!walletAddress,
  });
};

export { useIsSpiritKarrotOwner };
