import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ConditionalLayout from "@/components/layout/ConditionalLayout";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";
import ScrollToTop from "@/components/common/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maan Travels | Premium Chauffeur-Driven Travel in North India",
    template: "%s | Maan Travels",
  },
  description:
    "Premium chauffeur-driven cars, airport transfers, luxury tours and outstation journeys across Punjab, Himachal Pradesh, Jammu & Kashmir, Rajasthan and Delhi.",
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    siteName: "Maan Travels",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-default.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          bg-[#0a0a0a]
          text-white
          min-h-screen
          flex
          flex-col
        `}
      >
        <ScrollToTop />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}