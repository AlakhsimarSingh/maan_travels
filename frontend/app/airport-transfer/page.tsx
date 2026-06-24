import AirportTransferClient from "@/components/airport/AirportTransferClient";
import AirportBenefits from "@/components/airport/AirportBenefits";

// import { fetchAirportTransferData } from "@/src/lib/fetchAirportTransferData";
import { buildMetadata, buildBreadcrumbLd, siteUrl } from "@/src/lib/seo";
import { fetchAirportTransferData } from "@/src/lib/fetchAirportTransferData";

export const metadata = buildMetadata({
  title: "Airport Transfers in Punjab | Maan Travels",
  description:
    "Book reliable, chauffeur-driven airport transfers to and from Amritsar, Chandigarh and Delhi airports. Flight monitoring, professional drivers, 24/7 availability.",
  path: "/airport-transfer",
});

const pageUrl = `${siteUrl}/airport-transfer`;

export default async function AirportTransferPage() {
  // Fetched ONCE, on the server, before any HTML reaches the browser —
  // airports and taxi-fleet vehicles in parallel, replacing two separate
  // client-side hooks (useAirports + useVehicles) that used to fire
  // independently after the JS bundle loaded.
  const data = await fetchAirportTransferData();

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Airport Transfer",
    provider: {
      "@type": "TravelAgency",
      name: "Maan Travels",
      url: siteUrl,
    },
    areaServed: { "@type": "State", name: "Punjab" },
    url: pageUrl,
    description:
      "Chauffeur-driven airport transfer service with flight monitoring and 24/7 availability across Punjab and North India.",
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Airport Transfer", path: "/airport-transfer" },
  ]);

  // Real airport names as structured data — crawlable, so a search for
  // e.g. "Amritsar airport taxi" can surface this specific page/airport.
  const airportListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Airports served",
    itemListElement: data.airports.map((a, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: a.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {data.airports.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(airportListLd) }}
        />
      )}

      {/* SEO: crawlable summary of served airports — the hero/form below
          is highly interactive and client-rendered, so this guarantees
          real airport names exist in the page's initial HTML regardless
          of JS execution. */}
      <h2 className="sr-only">
        Airport transfers available for {data.airports.map((a) => a.name).join(", ")}
      </h2>

      <AirportTransferClient airports={data.airports} vehicles={data.vehicles} />

      <AirportBenefits />
    </>
  );
}

