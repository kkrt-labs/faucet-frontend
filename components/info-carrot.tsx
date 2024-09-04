import Image, { StaticImageData } from "next/image";

interface InfoCarrotProps {
  carrotSrc: StaticImageData;
  imageAlt: string;
  title?: string;
  description: string;
}

const InfoCarrot = ({ carrotSrc, title = "", description, imageAlt }: InfoCarrotProps) => (
  <>
    <Image src={carrotSrc} alt={imageAlt} />
    {title.length > 0 && <h2 className="text-3xl md:text-5xl leading-tight  font-medium">{title}</h2>}
    <div className="flex flex-row items-center justify-center my-4">
      <p className="leading-5 [&:not(:first-child)]:mt-4 text-[#878794] max-w-[350px]">{description}</p>
    </div>
  </>
);

export { InfoCarrot };
