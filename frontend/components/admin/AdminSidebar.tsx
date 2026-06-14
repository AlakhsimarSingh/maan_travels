"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  CalendarCheck,
  MessageSquare,
  Star,
  Newspaper,
  ImageIcon,
  Settings,
} from "lucide-react";

const items = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Packages",
    href: "/admin/packages",
    icon: Package,
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
    title: "News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
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