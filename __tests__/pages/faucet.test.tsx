import "@testing-library/jest-dom";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useFaucet } from "@/hooks/useFaucet";
import { useBlockNumber, useWalletBalance, lightTheme } from "thirdweb/react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useFaucetJob } from "@/queries/useFaucetJob";
import { useClaimFunds } from "@/mutations/useClaimFunds";
import Faucet from "@/app/faucet/page";
import { toast } from "sonner";

// Mock hooks and components
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/hooks/useFaucet", () => ({
  useFaucet: jest.fn(),
}));
jest.mock("thirdweb/react", () => ({
  useBlockNumber: jest.fn(),
  useWalletBalance: jest.fn(),
  lightTheme: jest.fn(() => ({ colors: {} })), // Mock lightTheme function
}));
jest.mock("@/hooks/useWindowSize", () => ({
  useWindowSize: jest.fn(),
}));
jest.mock("@/queries/useFaucetJob", () => ({
  useFaucetJob: jest.fn(),
}));
jest.mock("@/mutations/useClaimFunds", () => ({
  useClaimFunds: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: {
    message: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock components
jest.mock("react-confetti", () => () => <div />);
jest.mock("@/components/faucet-claim", () => ({
  FaucetClaim: ({ handleClaim, isDisabled }: { handleClaim: () => void; isDisabled: boolean }) => (
    <div>
      <button disabled={isDisabled} onClick={handleClaim}>
        Claim
      </button>
    </div>
  ),
}));
jest.mock("@/components/faucet-success", () => ({
  FaucetSuccess: ({ navigateToClaim }: { navigateToClaim: () => void }) => (
    <div>
      <button onClick={navigateToClaim}>Back to Claim</button>
    </div>
  ),
}));
jest.mock("@/components/text-pair", () => ({
  TextPair: ({ heading, description }: { heading: string; description: string }) => (
    <div>
      <h3>{heading}</h3>
      <p>{description}</p>
    </div>
  ),
}));
jest.mock("@/components/ui/button", () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));
jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div>Skeleton Loading...</div>,
}));

describe("Faucet Page", () => {
  const mockReplace = jest.fn();
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseFaucet = useFaucet as jest.Mock;
  const mockUseBlockNumber = useBlockNumber as jest.Mock;
  const mockUseWalletBalance = useWalletBalance as jest.Mock;
  const mockUseWindowSize = useWindowSize as jest.Mock;
  const mockUseFaucetJob = useFaucetJob as jest.Mock;
  const mockUseClaimFunds = useClaimFunds as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    mockUseFaucet.mockReturnValue({
      wallet: null,
      faucetStats: null,
      faucetBalance: null,
      refetchFaucet: jest.fn(),
      isFaucetLoading: false,
      isWhitelisted: false,
    });
    mockUseBlockNumber.mockReturnValue(null);
    mockUseWalletBalance.mockReturnValue({ refetch: jest.fn() });
    mockUseWindowSize.mockReturnValue({ width: 1024 });
    mockUseFaucetJob.mockReturnValue({ data: null, isError: false });
    mockUseClaimFunds.mockReturnValue({ mutate: jest.fn(), isPending: false, data: null });
    jest.clearAllMocks();
  });

  describe("Loading State", () => {
    it("renders SkeletonLoader when isFaucetLoading is true", () => {
      mockUseFaucet.mockReturnValue({ ...mockUseFaucet(), isFaucetLoading: true });

      render(<Faucet />);

      expect(screen.getAllByText("Skeleton Loading...").length).toBeGreaterThan(0);
    });
  });

  describe("Redirects", () => {
    it("redirects to home page when wallet is not available", () => {
      mockUseFaucet.mockReturnValue({ ...mockUseFaucet(), wallet: null });

      render(<Faucet />);

      expect(mockReplace).toHaveBeenCalledWith("/");
    });

    it("redirects to invite-code page when not whitelisted", () => {
      mockUseFaucet.mockReturnValue({ ...mockUseFaucet(), isWhitelisted: false });

      render(<Faucet />);

      expect(mockReplace).toHaveBeenCalledWith("/invite-code");
    });
  });

  describe("Normal Render", () => {
    beforeEach(() => {
      mockUseFaucet.mockReturnValue({
        wallet: { address: "0x123" },
        faucetStats: { dripAmountInEth: "0.001", timeLeftInS: 0, canClaim: true },
        faucetBalance: { faucetBalanceInEth: "1" },
        refetchFaucet: jest.fn(),
        isFaucetLoading: false,
        isWhitelisted: true,
      });
      mockUseBlockNumber.mockReturnValue("12345");
    });

    it("renders main content when wallet is available and whitelisted", () => {
      render(<Faucet />);

      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Need more testnet ETH?");
      expect(
        screen.getByText("Reach out to us on Discord and raise a ticket if you need large amount of testnet ETH.")
      ).toBeInTheDocument();
      expect(screen.getByText("Claim")).toBeInTheDocument();
    });

    it("shows faucet balance and block number", () => {
      render(<Faucet />);

      expect(screen.getByText("Faucet Balance:")).toBeInTheDocument();
      expect(screen.getByText("1ETH")).toBeInTheDocument();
      expect(screen.getByText("Block Number:")).toBeInTheDocument();
      expect(screen.getByText("12345")).toBeInTheDocument();
    });

    it("handles claim process and shows success state", async () => {
      const refetchFaucet = jest.fn();
      const refetchWallet = jest.fn();
      mockUseFaucet.mockReturnValue({
        wallet: { address: "0x123" },
        faucetStats: { dripAmountInEth: "0.001", timeLeftInS: 0, canClaim: true },
        faucetBalance: { faucetBalanceInEth: "1" },
        refetchFaucet,
        isFaucetLoading: false,
        isWhitelisted: true,
      });
      mockUseClaimFunds.mockReturnValue({
        mutate: jest.fn((params, { onSuccess }) => onSuccess({ jobID: "job123" })),
        isPending: false,
        data: null,
      });
      mockUseFaucetJob.mockReturnValue({ data: [{ status: "completed", transaction_hash: "0xabc" }], isError: false });
      mockUseWalletBalance.mockReturnValue({ refetch: refetchWallet });

      render(<Faucet />);

      await waitFor(() => {
        expect(screen.getByText("Back to Claim")).toBeInTheDocument();
      });

      expect(refetchFaucet).toHaveBeenCalled();
      expect(refetchWallet).toHaveBeenCalled();
      expect(toast.message).toHaveBeenCalledWith(expect.anything());
    });

    it("handles error state during claim process", async () => {
      mockUseFaucetJob.mockReturnValue({ data: null, isError: true });

      render(<Faucet />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to claim funds. Please try again later.");
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles case when faucetStats are not available", () => {
      mockUseFaucet.mockReturnValue({ ...mockUseFaucet(), faucetStats: null });

      render(<Faucet />);

      expect(screen.getByText("Claim")).toBeInTheDocument();
    });

    it("handles case when faucet balance is low", () => {
      mockUseFaucet.mockReturnValue({ ...mockUseFaucet(), faucetBalance: { faucetBalanceInEth: "0.0001" } });

      render(<Faucet />);

      expect(screen.getByText("Claim")).toBeDisabled();
    });

    it("handles cooldown state", () => {
      mockUseFaucet.mockReturnValue({
        ...mockUseFaucet(),
        faucetStats: { dripAmountInEth: "0.001", timeLeftInS: 60, canClaim: false },
      });

      render(<Faucet />);

      expect(screen.getByText("Claim")).toBeDisabled();
    });

    it("updates correctly when useFaucet value changes", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: true, isWhitelisted: false, wallet: null });

      const { rerender } = render(<Faucet />);
      expect(screen.getAllByText("Skeleton Loading...").length).toBeGreaterThan(0);

      act(() => {
        mockUseFaucet.mockReturnValue({
          isFaucetLoading: false,
          isWhitelisted: false,
          wallet: { address: "0x123" },
          faucetStats: { dripAmountInEth: "0.001", timeLeftInS: 0, canClaim: true },
          faucetBalance: { faucetBalanceInEth: "1" },
        });
      });

      rerender(<Faucet />);
      expect(screen.getByText("Claim")).toBeInTheDocument();
    });
  });

  describe("Snapshot Test", () => {
    it("matches snapshot", () => {
      mockUseFaucet.mockReturnValue({
        isFaucetLoading: false,
        isWhitelisted: true,
        wallet: { address: "0x123" },
        faucetStats: { dripAmountInEth: "0.001", timeLeftInS: 0, canClaim: true },
        faucetBalance: { faucetBalanceInEth: "1" },
      });

      const { asFragment } = render(<Faucet />);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
