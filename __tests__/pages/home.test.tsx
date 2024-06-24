import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useFaucet } from "@/hooks/useFaucet";
import Home from "@/app/page";

// Mock hooks and components
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/hooks/useFaucet", () => ({
  useFaucet: jest.fn(),
}));
jest.mock("@/components/skeleton-loading", () => ({
  SkeletonLoading: () => <div>Skeleton Loading...</div>,
}));
jest.mock("@/components/connect-wallet", () => ({
  ConnectWallet: () => <div>Connect Wallet</div>,
}));

describe("Home Page", () => {
  const mockReplace = jest.fn();
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseFaucet = useFaucet as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    jest.clearAllMocks();
  });

  describe("Loading State", () => {
    it("renders SkeletonLoading when isFaucetLoading is true", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: true, isWhitelisted: false, wallet: null });

      render(<Home />);

      expect(screen.getByText("Skeleton Loading...")).toBeInTheDocument();
    });
  });

  describe("Whitelisted State", () => {
    it("redirects to /faucet when isWhitelisted is true", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: false, isWhitelisted: true, wallet: null });

      render(<Home />);

      expect(mockReplace).toHaveBeenCalledWith("/faucet");
    });
  });

  describe("Wallet State", () => {
    it("redirects to /invite-code when wallet is defined but not whitelisted", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: false, isWhitelisted: false, wallet: "some-wallet-address" });

      render(<Home />);

      expect(mockReplace).toHaveBeenCalledWith("/invite-code");
    });
  });

  describe("Normal Render", () => {
    it("renders main content when not loading, not whitelisted, and no wallet", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: false, isWhitelisted: false, wallet: null });

      render(<Home />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Get free testnet Kakarot ETH");

      const description = screen.getByText(
        "The fast, native faucet to kickstart your journey in the Kakarot ecosystem."
      );
      expect(description).toBeInTheDocument();

      const connectWallet = screen.getByText("Connect Wallet");
      expect(connectWallet).toBeInTheDocument();
    });

    it("does not redirect or load when conditions are not met", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: false, isWhitelisted: false, wallet: null });

      render(<Home />);

      expect(mockReplace).not.toHaveBeenCalled();
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles case when wallet is present but both isFaucetLoading and isWhitelisted are false", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: false, isWhitelisted: false, wallet: "some-wallet-address" });

      render(<Home />);

      expect(mockReplace).toHaveBeenCalledWith("/invite-code");
    });

    it("handles case when isWhitelisted and isFaucetLoading are both true", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: true, isWhitelisted: true, wallet: null });

      render(<Home />);

      expect(screen.getByText("Skeleton Loading...")).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalledWith("/faucet");
    });

    it("updates correctly when useFaucet value changes", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: true, isWhitelisted: false, wallet: null });

      const { rerender } = render(<Home />);
      expect(screen.getByText("Skeleton Loading...")).toBeInTheDocument();

      act(() => {
        mockUseFaucet.mockReturnValue({
          isFaucetLoading: false,
          isWhitelisted: false,
          wallet: null,
        });
      });

      rerender(<Home />);
      expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
    });
  });

  describe("Snapshot Test", () => {
    it("matches snapshot", () => {
      mockUseFaucet.mockReturnValue({ isFaucetLoading: false, isWhitelisted: false, wallet: null });

      const { asFragment } = render(<Home />);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
