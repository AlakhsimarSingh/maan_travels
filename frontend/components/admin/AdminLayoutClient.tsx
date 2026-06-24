"use client";

import { usePathname } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminGuard from "./AdminGaurd";

const PUBLIC_ADMIN_PATHS = ["/admin/register-device"];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname?.startsWith(p));

  // The registration screen has nothing to navigate to yet (the device
  // isn't approved), so it skips both the guard AND the sidebar/header
  // shell — it's a standalone full-screen page.
  if (isPublicAdminPath) {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex h-screen">
        <AdminSidebar />

        <div className="flex flex-1 flex-col">
          <AdminHeader />

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}