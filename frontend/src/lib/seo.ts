import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";

type SeoInput = {
  title: string;
  description: string;
  path: string; // e.g. "/self-drive"
  image?: string; // absolute or root-relative OG image
};

/**
 * Builds a consistent Metadata object for any page.
 *
 * Usage in a page.tsx:
 *
 *   import { buildMetadata } from "@/src/lib/seo";
 *
 *   export const metadata = buildMetadata({
 *     title: "Airport Transfers in Punjab | Maan Travels",
 *     description: "...",
 *     path: "/airport-transfer",
 *   });
 */
export function buildMetadata({ title, description, path, image }: SeoInput): Metadata {
  const url = `${siteUrl}${path}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-default.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Maan Travels",
      type: "website",
      locale: "en_IN",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Builds a BreadcrumbList JSON-LD object for a page.
 *
 * Usage:
 *   const breadcrumbLd = buildBreadcrumbLd([
 *     { name: "Home", path: "/" },
 *     { name: "Self Drive", path: "/self-drive" },
 *   ]);
 */
export function buildBreadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export { siteUrl };