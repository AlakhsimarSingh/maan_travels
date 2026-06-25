import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbLd, siteUrl } from "@/src/lib/seo";
import TermsContent from "@/components/legal/TermsContent";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions | Privacy Policy — Maan Travels",
  description:
    "Read Maan Travels' terms of service and privacy policy. Understand your rights, our booking conditions, cancellation policy, and how we protect your personal data across all our chauffeur and travel services.",
  path: "/terms",
  image: "/og-default.jpg",
});

const pageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms & Conditions — Maan Travels",
  description:
    "Terms of service, cancellation policy, and privacy policy for Maan Travels — luxury chauffeur services across Punjab and North India.",
  url: `${siteUrl}/terms`,
  breadcrumb: buildBreadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Terms & Privacy", path: "/terms" },
  ]),
  publisher: {
    "@type": "Organization",
    name: "Maan Travels",
    url: siteUrl,
  },
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />
      <TermsContent />
    </>
  );
}