import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { PRIMARY_KEYWORDS, SECONDARY_KEYWORDS } from "@/src/config/seoLocations";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";
import ScrollToTop from "@/components/common/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maan Travels | Delhi to Jalandhar Taxi & Jalandhar to Delhi Cab",
    template: "%s | Maan Travels",
  },
  description:
    "Jalandhar's trusted taxi service — Delhi to Jalandhar and Jalandhar to Delhi taxi, airport cabs, one-way and outstation taxis across Punjab, Delhi, Haryana, Himachal Pradesh and Rajasthan. Available 24/7.",
  keywords: [...PRIMARY_KEYWORDS, ...SECONDARY_KEYWORDS],
  applicationName: "Maan Travels",
  category: "travel",
  formatDetection: { telephone: true },
  verification: {
    google: "4eX_X3JpHX77FIrG5ryniNQt_9zVpozQ_y6hPnxIHSQ",
  },
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
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Maan Travels taxi service, Jalandhar" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className="dark">
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
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17937825732"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17937825732');
          `}
        </Script>

        {/* <ScrollToTop /> */}
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}