import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { FaucetSuccess } from "@/components/faucet-success";

jest.mock("@/lib/constants", () => ({
  KKRT_EXPLORER: "https://explorer.kakarot.io",
}));

describe("FaucetSuccess", () => {
  const mockNavigateToClaim = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<FaucetSuccess navigateToClaim={mockNavigateToClaim} txHash="0x12345" />);
    expect(screen.getByText("Cha Ching!")).toBeInTheDocument();
  });

  it("calls navigateToClaim function when 'Back to Claim' button is clicked", () => {
    render(<FaucetSuccess navigateToClaim={mockNavigateToClaim} txHash="0x12345" />);
    fireEvent.click(screen.getByText("Back to Claim"));
    expect(mockNavigateToClaim).toHaveBeenCalled();
  });

  it("displays correct link to explorer with transaction hash", () => {
    render(<FaucetSuccess navigateToClaim={mockNavigateToClaim} txHash="0x12345" />);
    const explorerLink = screen.getByText("View on Explorer").closest("a");
    expect(explorerLink).toHaveAttribute("href", "https://explorer.kakarot.io/tx/0x12345");
  });

  it("displays success message correctly", () => {
    render(<FaucetSuccess navigateToClaim={mockNavigateToClaim} txHash="0x12345" />);
    expect(
      screen.getByText("You just got some testnet ETH! Your wallet should reflect this transaction soon!")
    ).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<FaucetSuccess navigateToClaim={mockNavigateToClaim} txHash="0x12345" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
