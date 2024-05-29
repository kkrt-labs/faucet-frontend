import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/mobile-footer";
import { ThirdwebProvider } from "@/lib/thirdweb-provider";
import { Provider } from "@/lib/query-provider";

import localFont from "next/font/local";
import "./globals.css";

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
          <Toaster />
          <Provider>
            <Navbar />
            {children}
            <Footer />
          </Provider>
        </body>
      </ThirdwebProvider>
    </html>
  );
}
