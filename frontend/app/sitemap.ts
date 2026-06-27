import type { MetadataRoute } from "next";

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

    // Wedding booking pages — one per luxury car, keyed by slug.
    // These are the actual indexable car detail + booking pages.
    return (data.luxuryCars || []).map((car: any) => ({
      url: `${baseUrl}/wedding-booking/${car.slug}`,
      lastModified: car.updatedAt ? new Date(car.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

async function getTourLocationRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/api/locations/active`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    if (!data?.success) return [];

    // Tour packages filter — each destination is a unique landing surface
    // worth indexing, since users search "tour from Jalandhar to Manali" etc.
    return (data.locations || [])
      .filter((loc: any) => loc.canDrop)
      .map((loc: any) => ({
        url: `${baseUrl}/tour-packages?destination=${encodeURIComponent(loc.name)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [luxuryCarRoutes, tourLocationRoutes] = await Promise.all([
    getLuxuryCarRoutes(),
    getTourLocationRoutes(),
  ]);

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
    ...tourLocationRoutes,
  ];
}