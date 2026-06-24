import TourPlanner from "@/components/tours/TourPlanner";
import { fetchTourLocations } from "@/src/lib/FetchTourLocations";
import { buildMetadata, buildBreadcrumbLd, siteUrl } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Tour Packages Punjab | Himachal, Kashmir, Rajasthan & Religious Tours",
  description:
    "Book customized tour packages from Punjab to Manali, Shimla, Kashmir, Dalhousie, Rajasthan and religious destinations with Maan Travels.",
  path: "/tour-packages",
});

const pageUrl = `${siteUrl}/tour-packages`;

export default async function Page() {
  // Fetched ONCE, on the server, before any HTML reaches the browser —
  // all three location lists (hero/pickup/drop) in parallel, replacing
  // what used to be three client-side fetches after the JS bundle loaded.
  const locations = await fetchTourLocations();

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Custom Tour Packages",
    provider: {
      "@type": "TravelAgency",
      name: "Maan Travels",
      url: siteUrl,
    },
    areaServed: [
      { "@type": "State", name: "Punjab" },
      { "@type": "State", name: "Himachal Pradesh" },
      { "@type": "State", name: "Rajasthan" },
      { "@type": "State", name: "Jammu and Kashmir" },
    ],
    url: pageUrl,
    description:
      "Customized chauffeur-driven tour packages from Punjab to Himachal Pradesh, Kashmir, Rajasthan and religious destinations across North India.",
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Tour Packages", path: "/tour-packages" },
  ]);

  // Lists real destination names as structured data — this is genuinely
  // crawlable content, not just decoration, so search engines can surface
  // specific destinations (e.g. "Manali tour from Punjab") directly.
  const destinationListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tour destinations",
    itemListElement: locations.dropLocations.map((loc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: loc.name,
    })),
  };

  return (
    <main className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {locations.dropLocations.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationListLd) }}
        />
      )}

      {/* SEO: a crawlable, visually-hidden summary of available destinations.
          The hero/planner below is highly interactive and client-rendered,
          so this guarantees real destination names exist in the page's
          initial HTML regardless of JS execution. */}
      <h2 className="sr-only">
        Tour packages available from{" "}
        {locations.pickupLocations.map((l) => l.name).join(", ")} to{" "}
        {locations.dropLocations.map((l) => l.name).join(", ")}
      </h2>

      <TourPlanner locations={locations} />
    </main>
  );
}