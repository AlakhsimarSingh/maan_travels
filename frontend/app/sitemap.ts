import type { MetadataRoute } from "next";

import { tourPackages } from "@/src/data/packages";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maantravels.com";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

// ---------------------------------------------------------------------------
// Static routes — prioritized by commercial intent and traffic value.
//
// Priority scale:
//   1.0  — homepage
//   0.9  — high-intent service pages (people searching to book)
//   0.8  — supporting service pages
//   0.7  — informational pages
//   0.5  — low-traffic utility pages (gallery, feedback)
//
// changeFrequency reflects how often content actually changes, not how
// often we want Google to crawl — lying here hurts crawl budget trust.
// ---------------------------------------------------------------------------

const staticRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  // Homepage
  { path: "",                          priority: 1.0, changeFrequency: "weekly"  },

  // Core booking/service pages — highest commercial intent
  { path: "/booking",                  priority: 0.9, changeFrequency: "weekly"  },
  { path: "/go-taxi",                  priority: 0.9, changeFrequency: "weekly"  },
  { path: "/airport-transfer",         priority: 0.9, changeFrequency: "weekly"  },
  { path: "/tempo-traveller-urbania",  priority: 0.9, changeFrequency: "weekly"  },
  { path: "/self-drive",               priority: 0.9, changeFrequency: "weekly"  },
  { path: "/luxury-cars",              priority: 0.9, changeFrequency: "weekly"  },
  { path: "/wedding-cars",             priority: 0.9, changeFrequency: "weekly"  },
  { path: "/tour-packages",            priority: 0.9, changeFrequency: "weekly"  },
  { path: "/packages",                 priority: 0.8, changeFrequency: "monthly" },

  // Supporting pages
  { path: "/fleet",                    priority: 0.8, changeFrequency: "weekly"  },
  { path: "/contact",                  priority: 0.8, changeFrequency: "monthly" },
  { path: "/about",                    priority: 0.7, changeFrequency: "monthly" },

  // Low-traffic utility
  { path: "/gallery",                  priority: 0.5, changeFrequency: "monthly" },
  { path: "/feedback",                 priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms",                    priority: 0.4, changeFrequency: "yearly"  },
];

// ---------------------------------------------------------------------------
// Dynamic route fetchers — each wrapped in try/catch so a single
// failing API call doesn't break the entire sitemap generation.
// ---------------------------------------------------------------------------

async function getLuxuryCarRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/api/luxury-cars`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    if (!data?.success) return [];

    // One detail page and one wedding booking page per luxury car.
    return (data.luxuryCars || []).flatMap((car: any) => {
      const lastModified = car.updatedAt ? new Date(car.updatedAt) : new Date();
      return [
        {
          url: `${baseUrl}/luxury-cars/${car.slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        },
        {
          url: `${baseUrl}/wedding-booking/${car.slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        },
      ];
    });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const luxuryCarRoutes = await getLuxuryCarRoutes();

  const packageRoutes: MetadataRoute.Sitemap = tourPackages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    // Static routes first — crawlers process earlier entries sooner
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),

    // Dynamic routes
    ...luxuryCarRoutes,
    ...packageRoutes,
  ];
}