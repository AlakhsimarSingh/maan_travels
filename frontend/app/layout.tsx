"use client";

import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import BookingModal from "@/components/admin/booking/BookingModal";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

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
        {/* HIDE ON ADMIN */}
        {!isAdmin && <Navbar />}

        <main className="flex-1">{children}</main>

        <BookingModal />
        {/* HIDE ON ADMIN */}
        {!isAdmin && <Footer />}
        {!isAdmin && <FloatingActions />}
      </body>
    </html>
  );
}