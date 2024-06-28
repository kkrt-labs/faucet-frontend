import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useActiveWallet, useActiveWalletChain } from "thirdweb/react";
import { FaucetClaim } from "@/components/faucet-claim";

// Mock hooks and components
jest.mock("thirdweb/react", () => ({
  useActiveWallet: jest.fn(),
  useActiveWalletChain: jest.fn(),
  lightTheme: jest.fn().mockImplementation(() => ({
    colors: {
      accentText: "#FF7600",
      accentButtonBg: "#FF7600",
    },
  })),
}));

jest.mock("lucide-react", () => ({
  InfoIcon: () => <div>InfoIcon</div>,
  Loader2: () => <div>Loader2</div>,
}));

describe("FaucetClaim", () => {
  const mockUseActiveWallet = useActiveWallet as jest.Mock;
  const mockUseActiveWalletChain = useActiveWalletChain as jest.Mock;
  const mockHandleClaim = jest.fn();

  beforeEach(() => {
    mockUseActiveWallet.mockReturnValue({
      getChain: () => ({ id: "0x1" }),
      id: "io.metamask",
      autoConnect: (client: any) => ({}),
    });
    mockUseActiveWalletChain.mockReturnValue({ id: "0x1" });
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <FaucetClaim
        isProcessing={false}
        isCooldown={false}
        isOutOfFunds={false}
        available="0.001 ETH"
        handleClaim={mockHandleClaim}
        faucetStats={{ timeLeftInS: 0 } as any}
      />
    );
    expect(screen.getByText("0.001 ETH")).toBeInTheDocument();
  });

  it("displays cooldown image and message when on cooldown", () => {
    render(
      <FaucetClaim
        isProcessing={false}
        isCooldown={true}
        isOutOfFunds={false}
        available="0.001 ETH"
        handleClaim={mockHandleClaim}
        faucetStats={{ timeLeftInS: 3600 } as any}
      />
    );
    expect(screen.getByAltText("Cooldown Carrot")).toBeInTheDocument();
    expect(
      screen.getByText("You're on a cooldown period! Try the Kakarot faucet again in 01:00:00 hours.")
    ).toBeInTheDocument();
  });

  it("displays out of funds image and message when out of funds", () => {
    render(
      <FaucetClaim
        isProcessing={false}
        isCooldown={false}
        isOutOfFunds={true}
        available="0.001 ETH"
        handleClaim={mockHandleClaim}
        faucetStats={{ timeLeftInS: 0 } as any}
      />
    );
    expect(screen.getByAltText("Juiced Carrot")).toBeInTheDocument();
    expect(screen.getByText("We've run out Juices come back again till we fix the juice machine.")).toBeInTheDocument();
  });

  it("displays loader and 'Claiming..' when processing", () => {
    render(
      <FaucetClaim
        isProcessing={true}
        isCooldown={false}
        isOutOfFunds={false}
        available="0.001 ETH"
        handleClaim={mockHandleClaim}
        faucetStats={{ timeLeftInS: 0 } as any}
      />
    );
    expect(screen.getByText("Claiming..")).toBeInTheDocument();
    expect(screen.getByText("Loader2")).toBeInTheDocument();
  });

  it("calls handleClaim function when claim button is clicked", () => {
    render(
      <FaucetClaim
        isProcessing={false}
        isCooldown={false}
        isOutOfFunds={false}
        available="0.001 ETH"
        handleClaim={mockHandleClaim}
        faucetStats={{ timeLeftInS: 0 } as any}
      />
    );
    fireEvent.click(screen.getByText("Claim"));
    expect(mockHandleClaim).toHaveBeenCalled();
  });

  it("disables claim button when processing", () => {
    render(
      <FaucetClaim
        isProcessing={true}
        isCooldown={false}
        isOutOfFunds={false}
        available="0.001 ETH"
        handleClaim={mockHandleClaim}
        faucetStats={{ timeLeftInS: 0 } as any}
      />
    );
    expect(screen.getByText("Claiming..").closest("button")).toBeDisabled();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <FaucetClaim
        isProcessing={false}
        isCooldown={false}
        isOutOfFunds={false}
        available="0.001 ETH"
        handleClaim={mockHandleClaim}
        faucetStats={{ timeLeftInS: 0 } as any}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
