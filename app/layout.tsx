import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kakarot Faucet",
  description: "Get test tokens for building applications on the Superchain",
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
      <body className={`${openSauce.variable} font-sans`}>{children}</body>
    </html>
  );
}
