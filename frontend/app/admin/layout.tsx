import type { Metadata } from "next";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

// Defense in depth beyond robots.ts's "disallow: /admin" rule. Disallow
// only tells well-behaved crawlers not to fetch the page — it doesn't stop
// the bare URL from showing up in search results if it's linked from
// somewhere else. A noindex directive is the actual "never show this in
// search results" signal, so we apply it here for the whole admin tree.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}