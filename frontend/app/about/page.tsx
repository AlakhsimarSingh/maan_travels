import type { Metadata } from "next";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutFounder from "@/components/about/AboutFounder";
import AboutWhy from "@/components/about/AboutWhy";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us | Maan Travels — Premium Chauffeur Travel in North India",
  description:
    "Maan Travels has delivered premium chauffeur-driven travel across Punjab, Himachal, J&K, Rajasthan and Delhi for 15+ years. Discover our story, our fleet, and what sets us apart.",
  openGraph: {
    title: "About Maan Travels",
    description:
      "Premium chauffeur-driven travel experiences across North India, refined over 15+ years.",
    images: ["/images/about-luxury.jpg"],
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutFounder />
      <AboutWhy />
      <CTASection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "Maan Travels",
            description:
              "Premium chauffeur-driven travel service based in Jalandhar, serving Punjab, Himachal Pradesh, Jammu & Kashmir, Rajasthan and Delhi.",
            areaServed: ["Punjab", "Himachal Pradesh", "Jammu and Kashmir", "Rajasthan", "Delhi"],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Jalandhar",
              addressRegion: "Punjab",
              addressCountry: "IN",
            },
          }),
        }}
      />
    </main>
  );
}