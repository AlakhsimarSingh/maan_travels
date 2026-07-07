"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Car,
  Package,
  CalendarCheck,
  MessageSquare,
  Star,
  ImageIcon,
  Settings,
  CarFront,
  BusFront,
  MapPin,
  MapPinned,
  Plane,
  Wallet,
  QrCode,
  Globe,
  LogOut,
} from "lucide-react";

import { logoutAdminDevice } from "@/src/services/adminDeviceService";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    ],
  },
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
      { title: "Airport Cities", href: "/admin/airport-cities", icon: MapPinned },
      { title: "Airport Pricing", href: "/admin/airports/pricing", icon: Wallet },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Payment Settings", href: "/admin/payment-settings", icon: QrCode },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  }

  async function handleLogout() {
    const confirmed = confirm("Log out this device from the admin panel?");
    if (!confirmed) return;

    try {
      await logoutAdminDevice();
    } finally {
      router.replace("/admin/register-device");
    }
  }

  return (
    <>
      <style>{`
        .no-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* old Edge / IE */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, new Edge */
        }
      `}</style>

      <aside className="flex w-60 flex-col border-r border-[#1c1c1c] bg-[#0a0a0a]">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b border-[#1c1c1c] px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ecb100]">
            <Car className="h-3.5 w-3.5 text-black" />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-none text-white">Maan Travels</p>
            <p className="mt-0.5 text-[10px] leading-none text-[#555]">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="no-scrollbar flex-1 overflow-y-auto py-3">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? "mt-4" : ""}>
              <p className="mb-1 px-5 text-[10px] font-semibold uppercase tracking-widest text-[#3a3a3a]">
                {group.label}
              </p>
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors ${
                        active
                          ? "border-l-2 border-[#ecb100] bg-[#ecb10012] text-[#ecb100]"
                          : "border-l-2 border-transparent text-[#666] hover:bg-[#ffffff08] hover:text-[#ccc]"
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 ${active ? "text-[#ecb100]" : "text-[#444] group-hover:text-[#ccc]"}`}
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — View website / Logout */}
        <div className="space-y-0.5 border-t border-[#1c1c1c] px-2 py-3">
          <Link
            href="/"
            target="_blank"
            className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-[#666] transition-colors hover:bg-[#ffffff08] hover:text-[#ccc]"
          >
            <Globe className="h-3.5 w-3.5 shrink-0 text-[#444] group-hover:text-[#ccc]" strokeWidth={1.8} />
            View website
          </Link>

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-[#666] transition-colors hover:bg-[#ffffff08] hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0 text-[#444] group-hover:text-red-400" strokeWidth={1.8} />
            Log out this device
          </button>
        </div>
      </aside>
    </>
  );
}