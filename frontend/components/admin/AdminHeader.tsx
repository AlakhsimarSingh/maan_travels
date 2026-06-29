"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/vehicles": "Vehicles",
  "/admin/luxury-cars": "Luxury Cars",
  "/admin/tempo": "Tempo / Urbania",
  "/admin/bookings": "Bookings",
  "/admin/inquiries": "Inquiries",
  "/admin/feedback": "Feedback",
  "/admin/gallery": "Gallery",
  "/admin/routes": "Route Pricing",
  "/admin/pricing-matrix": "Pricing Matrix",
  "/admin/locations": "Tour Locations",
  "/admin/airports/pricing": "Airport Pricing",
  "/admin/airports": "Airports",
  "/admin/payment-settings": "Payment Settings",
  "/admin/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  // Longest prefix match
  const match = Object.keys(ROUTE_LABELS)
    .filter((k) => k !== "/admin" && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROUTE_LABELS[match] : "Admin";
}

export default function AdminHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname ?? "/admin");

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#1c1c1c] bg-[#0a0a0a] px-6">
      <div>
        <h1 className="text-[15px] font-semibold text-white">{title}</h1>
        <p className="text-[11px] text-[#444]">Maan Travels Admin</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <span className="flex items-center gap-1.5 rounded-full border border-[#1c1c1c] bg-[#0f0f0f] px-3 py-1.5 text-[10px] text-[#555]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ecb100] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ecb100]" />
          </span>
          Live
        </span>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] text-[#555] transition-colors hover:border-[#2a2a2a] hover:text-[#aaa]">
          <Bell className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}