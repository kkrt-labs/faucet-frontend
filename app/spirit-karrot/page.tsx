"use client";
import Image from "next/image";
import Confetti from "react-confetti";
import Link from "next/link";
import mintingIcon from "@/public/assets/mining.gif";
import xIcon from "@/public/assets/x-icon-inverted.svg";
import linkIcon from "@/public/assets/link-icon.svg";

import { useEffect, useState } from "react";
import { CONFETTI_COLORS, ENV, KAKAROT_CONTRACT_ADDRESS } from "@/lib/constants";
import { Turnstile } from "@marsidev/react-turnstile";
import { useSpiritKarrot } from "@/queries/useSpiritKarrot";
import { useFaucet } from "@/hooks/useFaucet";
import { MediaRenderer, useWalletBalance } from "thirdweb/react";
import { client, KAKAROT_SEPOLIA } from "@/lib/thirdweb-client";
import { Button } from "@/components/ui/button";
import { upload } from "thirdweb/storage";
import { getContract, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { abi as AirdropNFTABI } from "@/public/contracts/nftAirdropABI";
import { toast } from "sonner";
import { useToggleEligibility } from "@/mutations/useToggleEligibility";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useClaimFunds } from "@/mutations/useClaimFunds";
import { useFaucetJob } from "@/queries/useFaucetJob";
import { ConnectWallet } from "@/components/connect-wallet";
import { Skeleton } from "@/components/ui/skeleton";

type MintState = "completed" | "pending" | "generating" | "not-started" | "not-eligible" | "loading";

const SpiritKarrot = () => {
  const { wallet } = useFaucet();
  const {
    data: spiritKarrot,
    isLoading: isSpiritKarrotLoading,
    isPending: isSpiritKarrotPending,
  } = useSpiritKarrot(wallet?.address ?? "");
  const { data: walletBalance } = useWalletBalance({
    chain: KAKAROT_SEPOLIA,
    address: wallet?.address as string,
    client,
  });
  const { mutate: claimFunds, data: claimJobID } = useClaimFunds();
  const [jobId, setJobId] = useState<string | null>(null);
  const { data: faucetJob, isError } = useFaucetJob(jobId ?? "");

  const [captchaCode, setCaptchaCode] = useState<string | null>(null);
  const { width: windowWidth } = useWindowSize();
  const [runConfetti, setRunConfetti] = useState(false);

  const [mintingProgress, setMintingProgress] = useState<MintState>("loading");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [showTurnstile, setShowTurnstile] = useState<boolean>(true);
  const { mutate: toggleEligibility } = useToggleEligibility();

  const onTurnstileSuccess = (captchaCode: string) => {
    setCaptchaCode(captchaCode);
    setTimeout(() => setShowTurnstile(false), 1000);
  };

  const generateTweet = () =>
    `🧑‍🌾 I'm a @KakarotZKEVM OG, and this is ${spiritKarrot?.name}, the Spirit Karrot that tells the story of my journey on Kakarot Testnet, now in its final mile before mainnet.

💧 Get the drip and join me on Kakarot Starknet Sepolia\n`;

  useEffect(() => {
    // Set the base URL only after the component has mounted
    setBaseUrl(window.location.origin);
  }, []);

  const generateIntent = () =>
    `https://x.com/intent/post?text=${encodeURIComponent(generateTweet())}&url=${encodeURIComponent(
      `${baseUrl}/spirit-karrot/${spiritKarrot?.name?.toLowerCase()}`
    )}`;

  const handleMintTransaction = async () => {
    if (!wallet || !spiritKarrot) return;
    toast.info("Minting in progress...");
    try {
      const uris = await upload({
        client,
        files: [
          {
            name: spiritKarrot.name,
            properties: spiritKarrot.fullName,
            description: spiritKarrot.description,
            image: spiritKarrot.imageUrl,
          },
        ],
      });

      const contract = getContract({
        client,
        address: KAKAROT_CONTRACT_ADDRESS,
        chain: KAKAROT_SEPOLIA,
        abi: AirdropNFTABI as any,
      });

      const transaction = prepareContractCall({
        contract,
        method: "function mint(bytes32[] calldata _merkleProof, string memory _tokenUri)",
        params: [spiritKarrot.proof, uris] as any,
        maxFeePerBlobGas: BigInt(10000000000000),
        gas: BigInt(1000000),
      });

      const result = await sendTransaction({
        transaction,
        account: wallet,
      });

      const receipt = await waitForReceipt({
        client,
        chain: KAKAROT_SEPOLIA,
        transactionHash: result.transactionHash,
      });

      if (receipt.status === "success") {
        toggleEligibility({ walletAddress: wallet.address });
        toast.success("Minted successfully!");
        setMintingProgress("completed");
        setRunConfetti(true);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error minting Karrot:", error);
      toast.error("An error occurred while minting. Please try again.");
      setMintingProgress("not-started");
    }
  };

  const handleClaim = () => {
    if (!wallet?.address || !captchaCode) return;

    claimFunds(
      { walletAddress: wallet.address, captchaCode, denomination: "eth", isSpiritClaim: true },
      {
        onSuccess: (data) => {
          toast.info("Claiming some ETH to cover gas fees...");
          setJobId(data.jobID);
        },
        onError: () => {
          toast.error("Faucet is under a lot of load right now. Wait a bit and try again!");
          setMintingProgress("not-started");
        },
      }
    );
  };

  const mintKarrot = async () => {
    if (!wallet || !captchaCode) return;
    setMintingProgress("generating");

    try {
      // Check if user needs to claim funds
      const balance = Number(walletBalance?.displayValue);
      const dripAmount = 0.001;
      if (balance < dripAmount) {
        handleClaim();
        return;
      }
      handleMintTransaction();
    } catch (error) {
      console.error("Error minting Karrot:", error);
      toast.error("An error occurred during the minting process. Please try again.");
      setMintingProgress("not-started");
    }
  };

  useEffect(() => {
    if (spiritKarrot?.error) setMintingProgress("not-eligible");
    else if (spiritKarrot?.isEligible) setMintingProgress("not-started");
    else if (!spiritKarrot?.error && !spiritKarrot?.isEligible) setMintingProgress("completed");
  }, [spiritKarrot, isSpiritKarrotLoading]);

  useEffect(() => {
    if (faucetJob?.[0]?.status === "completed") {
      toast.success("Claimed ETH, minting now ...");
      setTimeout(() => {
        handleMintTransaction();
      }, 15 * 1000);
    }
  }, [faucetJob]);

  useEffect(() => {
    if (isError || faucetJob?.[0]?.status === "error") {
      toast.error("An error occurred while claiming funds. Check if you have enough mainnet ETH. Then try again!");
      setMintingProgress("not-started");
    }
  }, [isError, faucetJob]);

  if (isSpiritKarrotPending)
    return (
      <div className="flex flex-col justify-center items-center w-full py-16 px-3 rounded-md">
        {wallet ? (
          <Skeleton className="w-2/5 h-14 bg-slate-200 rounded-md" />
        ) : (
          <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight md:leading-[3rem] lg:text-[52px] text-nowrap">
            Unknown Karrot Detected ⁉️
          </h1>
        )}
        {wallet ? (
          <Skeleton className="mt-6 w-2/5 h-10 bg-slate-200 rounded-md" />
        ) : (
          <p className="leading-7 [&:not(:first-child)]:mt-6  text-[#878794]">
            You need to connect your wallet to continue
          </p>
        )}
        <div className="grid items-start justify-center mt-12 max-h-[400px] max-w-[320px] mb-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-kkrtOrange  to-[#0DAB0D] rounded-md blur opacity-85 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
            <Image
              src={"/assets/og-border.png"}
              width={400}
              height={400}
              className="relative rounded-md leading-none flex items-center divide-x divide-gray-600"
              alt="Spirit Karrot"
            />
          </div>
        </div>
        {!wallet && <ConnectWallet />}
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center w-full py-16 px-3 rounded-md">
      <Confetti colors={CONFETTI_COLORS} run={runConfetti} numberOfPieces={800} recycle={false} width={windowWidth} />

      <div className="flex flex-col justify-center items-center text-center max-w-xl">
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-medium tracking-tight md:leading-[3rem] lg:text-[52px] text-nowrap">
          {mintingProgress === "not-eligible"
            ? "🧑‍🌾 You are not eligible for a Spirit Karrot"
            : mintingProgress === "completed"
            ? `${spiritKarrot?.fullName} 🥕`
            : "Meet your Spirit Karrot 🥕"}
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6  text-[#878794]">
          {mintingProgress === "not-eligible"
            ? "Spirit Karrots are only available to OG farmers"
            : mintingProgress === "completed"
            ? "Meet your Spirit Karrot!"
            : "This Karrot embodies your activity on the previous version of our testnet"}
        </p>
      </div>
      <div className="grid items-start justify-center mt-12 max-h-[400px] max-w-[320px]">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-kkrtOrange  to-[#0DAB0D] rounded-md blur opacity-85 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
          <MediaRenderer
            src={mintingProgress === "completed" ? spiritKarrot?.imageUrl : "/assets/og-border.png"}
            client={client}
            width="400px"
            height="400px"
            className="relative rounded-md leading-none flex items-center divide-x divide-gray-600"
            alt="Spirit Karrot"
          />
        </div>
      </div>

      <p className="text-center text-sm text-[#878794] max-w-[400px] mt-4">
        {mintingProgress !== "not-eligible" && mintingProgress !== "completed"
          ? "Your Karrot gets revealed after the mint"
          : spiritKarrot?.description}
      </p>
      <Turnstile
        siteKey={ENV.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={onTurnstileSuccess}
        options={{ size: showTurnstile && mintingProgress === "not-started" ? "normal" : "invisible" }}
      />

      {mintingProgress === "not-eligible" && wallet && (
        <Link href={"/faucet"} className="w-full max-w-[400px]">
          <Button className="w-full  mt-10" variant="main">
            <span>Back to Faucet</span>
          </Button>
        </Link>
      )}

      {mintingProgress === "not-started" && (
        <Button
          variant="main"
          className="mt-4 md:mt-8 w-full max-w-[400px]"
          onClick={mintKarrot}
          disabled={!wallet || !captchaCode || !spiritKarrot}
        >
          Mint your Karrot
        </Button>
      )}

      {mintingProgress === "generating" && (
        <Button variant="outline" className="mt-4 w-full max-w-[400px] text-[#878794] pointer-events-none">
          <Image src={mintingIcon} alt="minting" width={24} height={24} priority className="w-[30px] h-6 mr-3" />
          <span>Minting in progress</span>
        </Button>
      )}

      {mintingProgress === "completed" && (
        <div className="flex w-full space-x-3 max-w-[400px]">
          <Link rel="noopener noreferrer" target="_blank" href={generateIntent()} className="w-full">
            <Button variant="outline" className="mt-4 w-full gap-1 !bg-black !text-white">
              <span>Share on</span>
              <Image src={xIcon} alt="X icon" width={20} height={20} priority />
            </Button>
          </Link>
          <Link href="/faucet" className="w-full">
            <Button variant="outline" className="mt-4 w-full text-[#878794] gap-1">
              <span>Go To Faucet</span>
              <Image src={linkIcon} alt="link icon" width={20} height={20} priority />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SpiritKarrot;
