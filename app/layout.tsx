import "./globals.css";
import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/mobile-footer";
import { LinkBanner } from "@/components/notify-banner";
import { ThirdwebProvider } from "@/lib/thirdweb-provider";
import { Provider } from "@/lib/query-provider";

export const metadata: Metadata = {
  title: "Kakarot Faucet",
  description: "The fast, native faucet to kickstart your journey in the Kakarot ecosystem.",
  icons: [
    {
      url: "/favicon.svg",
      href: "/favicon.svg",
    },
  ],
  metadataBase: new URL("https://faucet-sepolia.kakarot.org"),
  openGraph: {
    type: "website",
    title: "Kakarot Faucet",
    description: "The fast, native faucet to kickstart your journey in the Kakarot ecosystem.",
    images: [
      {
        url: "/og-image.png",
        href: "/og-image.png",
        width: 1200,
        height: 628,
        alt: "Kakarot Faucet",
      },
    ],
  },
};

const inter = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThirdwebProvider>
        <body className={`${inter.className} flex flex-col faucetBackground min-h-svh`}>
          <Toaster />
          <Provider>
            <LinkBanner />
            <Navbar />
            <div className=" px-4 sm:px-20 mt-auto">
              {children}
              <Footer />
            </div>
          </Provider>
          <Analytics />
        </body>
      </ThirdwebProvider>
    </html>
  );
}
