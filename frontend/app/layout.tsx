import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maan Travels | Luxury Chauffeur & Travel Services",
  description:
    "Book premium chauffeur-driven cars, airport transfers, luxury tours and outstation travel services across India with Maan Travels.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        {/* GLOBAL NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-1">
          {children}
        </main>

        {/* GLOBAL FOOTER */}
        <Footer />
        {/* FLOATING UI (WhatsApp / Call / etc.) */}
        <FloatingActions />
      </body>
    </html>
  );
}