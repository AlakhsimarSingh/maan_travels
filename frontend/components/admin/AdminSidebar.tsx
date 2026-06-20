"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderTree,
  Car,
  Package,
  CalendarCheck,
  MessageSquare,
  Star,
  Newspaper,
  ImageIcon,
  Settings,
  CarFront,
  BusFront,
  MapPin,
  Plane,
  Wallet,
  QrCode,
} from "lucide-react";

const items = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  // {
  //   title: "Categories",
  //   href: "/admin/categories",
  //   icon: FolderTree,
  // },
  {
    title: "Vehicles",
    href: "/admin/vehicles",
    icon: Car,
  },
  {
    title:"Luxury Cars",
    href:"/admin/luxury-cars",
    icon:CarFront,
  },
  {
  title: "Tempo / Urbania",
  href: "/admin/tempo",
  icon: BusFront,
},
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    title: "Feedback",
    href: "/admin/feedback",
    icon: Star,
  },

  {
  title: "Gallery",
  href: "/admin/gallery",
  icon: ImageIcon,
},

    {
    title: "Route Pricing",
    href: "/admin/routes",
    icon: Package,
  },

  {
    title: "Pricing Matrix",
    href: "/admin/pricing-matrix",
    icon: FolderTree,
  },

 {
  title: "Tour Locations",
  href: "/admin/locations",
  icon: MapPin,
},
  {
    title: "Airports",
    href: "/admin/airports",
    icon: Plane,
  },
  {
    title: "Airport Pricing",
    href: "/admin/airports/pricing",
    icon: Wallet,
  },
  {
    title: "Payment Settings",
    href: "/admin/payment-settings",
    icon: QrCode,
  },
  // {
  //   title: "News",
  //   href: "/admin/news",
  //   icon: Newspaper,
  // },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  return (
    <aside
      className="
        w-72
        border-r
        border-border
        bg-card
      "
    >
      <div className="p-6">
        <h2 className="text-xl font-bold">
          Maan Travels
        </h2>

        <p className="text-sm text-muted-foreground">
          Admin Panel
        </p>
      </div>

      <nav className="space-y-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                text-sm
                transition
                hover:bg-accent
              "
            >
              <Icon className="h-4 w-4" />

              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}