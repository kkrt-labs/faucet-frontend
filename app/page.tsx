const Home = () => (
  <main className="flex flex-col items-center text-center my-20 h-full">
    <h1 className="scroll-m-20 text-4xl font-medium tracking-tight text-left md:text-center lg:text-[52px] max-w-[800px]">
      Testnet Closed, Engines On
    </h1>
    <p className="leading-7 mt-6 text-foreground text-left w-full max-w-[680px]">
      Builders and Farmers,
    </p>

    <p className="mt-4 text-foreground text-left max-w-[680px]">
      The <b>Sepolia Testnet is officially closed</b> as of{" "}
      <b> December 16, 2024</b>, marking the completion of an incredible phase
      in Kakarot&apos;s journey. With <b>1.6 million transactions</b> and tens
      of thousands of unique users, the testnet has proven the scalability and
      efficiency of our EVM implementation (its code being fully{" "}
      <a
        href="https://github.com/kkrt-labs/kakarot/blob/main/audits/cairo_zero/Kakarot%20EVM%20-%20Zellic%20Audit%20Report.pdf"
        target="_blank"
        className="underline"
      >
        audited by Zellic
      </a>{" "}
      and Code 4rena).
    </p>

    <p className="mt-4 text-foreground text-left max-w-[680px]">
      This closure is not an end—it&apos;s a sharpening of our focus. Over the
      past year, we&apos;ve been dedicated to building the{" "}
      <b>best-performing proving engine</b>, that will bring unmatched
      efficiency and provability to EVM-compatible networks and appchains on
      Starknet and beyond.
    </p>

    <p className="mt-4 text-foreground text-left max-w-[680px]">
      By channeling our efforts toward this transformative project, we&apos;re
      moving closer to delivering real-time provability and scalability for
      builders across the ecosystem. The launch is near, and we&apos;re excited
      to show you what&apos;s next.
    </p>
    <p className="mt-4 text-foreground text-left max-w-[680px]">
      To everyone who contributed to this chapter of Kakarot&apos;s story, thank
      you. Your support fuels the work we do and the strides we continue to
      make.
    </p>

    <p className="mt-4 text-foreground text-left max-w-[680px]">
      🥕 — <b>The Kakarot Team</b>
    </p>
  </main>
);

export default Home;
