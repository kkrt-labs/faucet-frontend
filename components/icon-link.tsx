import Image from "next/image";
import Link from "next/link";

interface IconLinkProps {
  src: string;
  href: string;
  name: string;
  className?: string;
}

export const IconLink = ({ src, href, name, className = "" }: IconLinkProps) => {
  return (
    <Link className={className} rel="noopener noreferrer" target="_blank" href={href}>
      <Image src={src} alt={`${name} Logo`} width={24} height={24} priority className="w-[30px] h-6" />
    </Link>
  );
};
