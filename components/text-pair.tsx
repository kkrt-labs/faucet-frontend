export const TextPair = ({ heading, description }: { heading: string; description: string }) => {
  return (
    <section className="flex flex-col justify-center items-center">
      <header>
        <h3 className="scroll-m-20 text-2xl tracking-tight">{heading}</h3>
      </header>
      <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] text-center w-1/4">{description}</p>
    </section>
  );
};
