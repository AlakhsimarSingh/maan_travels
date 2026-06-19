import TempoUrbaniaFleet from "@/components/tempo/TempoUrbaniaFleet";
import TempoPackages from "@/components/tempo/TempoPackages";
import TempoUrbaniaSEO from "@/components/tempo/TempoUrbaniaSEO";
import TempoUrbaniaFAQ from "@/components/tempo/TempoUrbaniaFAQ";
import TempoUrbaniaHero from "@/components/tempo/TempoUrbaniaHero";

export const metadata = {
  title: "Tempo Traveller & Urbania Rental Punjab | Maan Travels",
  description:
    "Book premium Tempo Traveller and Force Urbania rentals in Punjab for family trips, weddings, corporate tours and group travel with professional chauffeurs.",
};

export default function Page() {
  return (
    <main className="pt-20">

      {/* 🚀 NEW DYNAMIC HERO */}
      <TempoUrbaniaHero />

      {/* FLEET */}
      <TempoUrbaniaFleet />

      {/* PACKAGES */}
      <TempoPackages />

      {/* SEO */}
      <TempoUrbaniaSEO />

      {/* FAQ */}
      <TempoUrbaniaFAQ />

    </main>
  );
}