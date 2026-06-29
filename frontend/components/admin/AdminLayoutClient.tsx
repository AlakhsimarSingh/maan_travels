"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Star,
  Settings,
  MoreHorizontal,
  X,
  CarFront,
  BusFront,
  Package,
  MessageSquare,
  ImageIcon,
  MapPin,
  Plane,
  Wallet,
  QrCode,
  FolderTree,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminGuard from "./AdminGaurd";

const PUBLIC_ADMIN_PATHS = ["/admin/register-device"];

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
};

// Primary 4 items + More
const BOTTOM_NAV: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Home", exact: true },
  { href: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
  { href: "/admin/vehicles", icon: Car, label: "Vehicles" },
  { href: "/admin/feedback", icon: Star, label: "Feedback" },
];

// All items grouped, shown in the "More" drawer
const MORE_GROUPS = [
  {
    label: "Fleet",
    items: [
      { title: "Vehicles", href: "/admin/vehicles", icon: Car },
      { title: "Luxury Cars", href: "/admin/luxury-cars", icon: CarFront },
      { title: "Tempo / Urbania", href: "/admin/tempo", icon: BusFront },
    ],
  },
  {
    label: "Bookings & CRM",
    items: [
      { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { title: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      { title: "Feedback", href: "/admin/feedback", icon: Star },
    ],
  },
  {
    label: "Pricing & Routes",
    items: [
      { title: "Route Pricing", href: "/admin/routes", icon: Package },
      { title: "Pricing Matrix", href: "/admin/pricing-matrix", icon: FolderTree },
      { title: "Tour Locations", href: "/admin/locations", icon: MapPin },
      { title: "Airports", href: "/admin/airports", icon: Plane },
      { title: "Airport Pricing", href: "/admin/airports/pricing", icon: Wallet },
    ],
  },
  {
    label: "Content & System",
    items: [
      { title: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { title: "Payment Settings", href: "/admin/payment-settings", icon: QrCode },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname?.startsWith(p));

  if (isPublicAdminPath) {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      {/* DESKTOP */}
      <div className="hidden md:flex h-screen bg-[#0a0a0a]">
        <AdminSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>

      {/* MOBILE */}
      <div className="flex md:hidden flex-col h-[100dvh] bg-[#0a0a0a]">
        <MobileHeader />
        <main className="flex-1 overflow-auto p-4 pb-24">{children}</main>
        <MobileBottomNav pathname={pathname ?? ""} />
      </div>
    </AdminGuard>
  );
}

function MobileHeader() {
  return (
    <div className="flex items-center justify-between border-b border-[#1c1c1c] bg-[#0a0a0a] px-4 py-3 shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ecb100]">
          <Car className="h-3 w-3 text-black" />
        </div>
        <div>
          <p className="text-[13px] font-semibold leading-none text-white">Maan Travels</p>
          <p className="text-[10px] leading-none text-[#444] mt-0.5">Admin Panel</p>
        </div>
      </div>
      <span className="flex items-center gap-1.5 text-[10px] text-[#555]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ecb100] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ecb100]" />
        </span>
        Live
      </span>
    </div>
  );
}

function MobileBottomNav({ pathname }: { pathname: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  }

  return (
    <>
      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1c1c1c] bg-[#0a0a0a] md:hidden">
        <div className="flex items-center justify-around">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-3 text-[10px] transition-colors ${
                  active ? "text-[#ecb100]" : "text-[#444] hover:text-[#888]"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* More tab */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center gap-1 px-4 py-3 text-[10px] transition-colors ${
              drawerOpen ? "text-[#ecb100]" : "text-[#444] hover:text-[#888]"
            }`}
          >
            <MoreHorizontal size={20} strokeWidth={1.8} />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-up drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[60] rounded-t-2xl border-t border-[#1c1c1c] bg-[#0d0d0d] transition-transform duration-300 ease-out md:hidden ${
          drawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80dvh" }}
      >
        {/* Drag handle + header */}
        <div className="flex items-center justify-between border-b border-[#1c1c1c] px-5 py-4">
          <p className="text-[13px] font-semibold text-white">All Pages</p>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a1a] text-[#666]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Grouped items */}
        <div className="overflow-y-auto pb-8" style={{ maxHeight: "calc(80dvh - 57px)" }}>
          {MORE_GROUPS.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? "mt-1" : ""}>
              <p className="px-5 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-[#333]">
                {group.label}
              </p>
              <div className="px-3">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                        active
                          ? "bg-[#ecb10012] text-[#ecb100]"
                          : "text-[#666] hover:bg-[#ffffff08] hover:text-[#ccc]"
                      }`}
                    >
                      <Icon
                        size={16}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={active ? "text-[#ecb100]" : "text-[#444]"}
                      />
                      {item.title}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ecb100]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}