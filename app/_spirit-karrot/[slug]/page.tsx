import { Metadata } from "next";
import { FC } from "react";
import ClientRedirect from "@/components/client-redirect";

interface PageProps {
  params: {
    slug: string;
  };
}

const validKarrots = ["kairon", "karrak", "karrax", "kastra", "kazzar", "kelon", "kinto", "koru", "kromar"];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  if (!validKarrots.includes(slug.toLowerCase())) {
    return {
      title: "Kakarot Faucet",
      description: "The fast, native faucet to kickstart your journey in the Kakarot ecosystem.",
    };
  }
  return {
    title: `Spirit Karrot - ${slug}`,
    description: `Meet your ${slug} Spirit Karrot`,
    openGraph: {
      title: `Spirit Karrot - ${slug}`,
      description: `Meet your ${slug} Spirit Karrot`,
      images: [
        {
          url: `/api/spirit-karrot?karrot=${slug.toLowerCase()}`, // OG image specific to each slug
          width: 1920,
          height: 1080,
          alt: `${slug} Spirit Karrot`,
        },
      ],
    },
  };
}

const SlugKarrot: FC<PageProps> = ({ params }) => {
  return <ClientRedirect />;
};

export default SlugKarrot;
