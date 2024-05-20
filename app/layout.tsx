import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import localFont from "next/font/local";
import "./globals.css";
import { ThirdwebProvider } from "@/components/thirdweb-provider";
import { Footer } from "@/components/mobile-footer";

export const metadata: Metadata = {
  title: "Kakarot Faucet",
  description: "Get test tokens for building applications on the Superchain",
  icons: [
    {
      url: "/favicon.svg",
      href: "/favicon.svg",
    },
  ],
};

const openSauce = localFont({
  src: [
    { path: "../public/font/OpenSauceSans-Light.ttf", weight: "300" },
    { path: "../public/font/OpenSauceSans-Regular.ttf", weight: "400" },
    { path: "../public/font/OpenSauceSans-Medium.ttf", weight: "500" },
    { path: "../public/font/OpenSauceSans-Bold.ttf", weight: "700" },
    { path: "../public/font/OpenSauceSans-SemiBold.ttf", weight: "600" },
    { path: "../public/font/OpenSauceSans-ExtraBold.ttf", weight: "800" },
    { path: "../public/font/OpenSauceSans-Black.ttf", weight: "900" },
  ],
  variable: "--font-open-sauce",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThirdwebProvider>
        <body className={`${openSauce.variable} font-sans bg-[#E5E7EB] px-4 sm:px-20`}>
          <Navbar />
          {children}
          <Footer />
        </body>
      </ThirdwebProvider>
    </html>
  );
}
