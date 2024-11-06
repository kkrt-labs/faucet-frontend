import { logger } from "ethers";
import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import addresses from "@/lib/addresses.json";

export async function generateMerkleProof(
  address: string,
  ): Promise<string[] | null> {
    try {
      const leafNodes = addresses.map((addr) => ethers.utils.keccak256(addr));
      const merkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, {
        sortPairs: true,
      });
  
      const hashedAddress = ethers.utils.keccak256(address);
      const proof = merkleTree.getHexProof(hashedAddress);
  
      if (proof.length === 0) {
        console.info(`Address ${address} is not in the Merkle tree.`);
      return null;
    }

    return proof;
  } catch (error) {
    console.error(`Error reading addresses file: ${error}`);
    return null;
  }
  }
