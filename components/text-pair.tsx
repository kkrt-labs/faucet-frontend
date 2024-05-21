export const TextPair = ({ heading, description }: { heading: string; description: string }) => {
  return (
    <section className="flex flex-col justify-center items-center px-4">
      <header>
        <h3 className="scroll-m-20 text-2xl tracking-tight">{heading}</h3>
      </header>
      <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] text-center text-pretty max-w-[400px]">
        {description}
      </p>
    </section>
  );
};
