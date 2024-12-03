const Home = () => (
  <main className="flex flex-col items-center text-center my-20 h-full">
    <h1 className="scroll-m-20 text-4xl font-medium tracking-tight text-left md:text-center lg:text-[52px] max-w-[800px]">
      Thank You, Kakarot Builders and Farmers
    </h1>
    <p className="leading-7 mt-6 text-foreground text-left w-full max-w-[680px]">
      Thank you for coming over to use our faucet. We have paused on the faucet
      use and here is why:
    </p>

    <p className="mt-4 text-foreground text-left max-w-[680px]">
      Over the past few months, your support has been invaluable. You&apos;ve
      tested our Starknet Sepolia Testnet, explored dApps, and provided crucial
      feedback. Thanks to your efforts, we&apos;ve achieved remarkable
      milestones: over 2m transactions, XX active users, and 20+ innovative
      dApps deployed. With audits from C4 and{" "}
      <a
        href="https://github.com/kkrt-labs/kakarot/blob/main/audits/cairo_zero/Kakarot%20EVM%20-%20Zellic%20Audit%20Report.pdf"
        target="_blank"
        className="underline"
      >
        Zellic
      </a>{" "}
      ensuring the reliability of our zkEVM built in Cairo, we&apos;re proud of
      the secure and efficient zkEVM we&apos;ve built together.
    </p>

    <p className="mt-4 text-foreground text-left max-w-[680px]">
      After careful evaluation, we&apos;ve decided not to proceed with a mainnet
      deployment on Starknet for the foreseeable future. This choice allows us
      to focus on overcoming technical challenges and maximizing our long-term
      impact.
    </p>

    <p className="mt-4 text-foreground text-left max-w-[680px]">
      Looking ahead, we&apos;re dedicating our full energy to building a
      high-performance EVM proving engine, set to launch in Q1 2025. We still
      count on your support—whether through feedback, contributions, or simply
      being part of our community. For more details on what&apos;s next, check
      out our full announcement here.
    </p>

    <p className="mt-4 text-foreground text-left max-w-[680px]">
      Thank you for being an essential part of our journey.
    </p>
  </main>
);

export default Home;
