"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import BookingModal from "@/components/admin/booking/BookingModal";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      <main className="flex-1">{children}</main>

      <BookingModal />

      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingActions />}
    </>
  );
}