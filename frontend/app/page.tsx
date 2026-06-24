import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import FleetSection from "@/components/home/FleetSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import TravelCostCalculator from "@/components/calculator/TravelCostCalculator";
import BookingForm from "@/components/home/BookingForm";
import RouteSection from "@/components/home/RouteSection";
import Reveal from "@/components/common/Reveal";

import { API_URL } from "@/src/services/bookingService";

export const metadata: Metadata = {
  title: "Maan Travels | Luxury Chauffeur Service & Airport Transfers in Punjab",
  description:
    "Book premium chauffeur-driven cars, airport transfers, wedding cars and luxury tours across Punjab, Himachal Pradesh, Jammu & Kashmir, Rajasthan and Delhi. 50+ vehicles, 24/7 availability, 15+ years of trusted service.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Maan Travels — Luxury Travel Across India",
    description:
      "Premium chauffeur-driven cars, airport transfers, luxury tours and outstation journeys tailored for comfort and style.",
    images: ["/images/hero-bg.jpg"],
  },
};

async function getRoutes() {
  try {
    const res = await fetch(`${API_URL}/api/routes`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.routes || [];
  } catch {
    return [];
  }
}

async function getVehicles() {
  try {
    const res = await fetch(`${API_URL}/api/vehicles`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.vehicles || [];
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    const res = await fetch(`${API_URL}/api/feedback?visible=true`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.feedbacks || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [routes, vehicles, testimonials] = await Promise.all([
    getRoutes(),
    getVehicles(),
    getTestimonials(),
  ]);

  const taxiVehicles = vehicles.filter((v: any) => v.isTaxiFleet);

  const grouped = {
    destination: routes.filter((r: any) => r.category === "destination"),
    one_way: routes.filter((r: any) => r.category === "one_way"),
    local: routes.filter((r: any) => r.category === "local"),
    airport: routes.filter((r: any) => r.category === "airport"),
    tour: routes.filter((r: any) => r.category === "tour"),
  };

  return (
    <>
      <Hero />

      <section className="pt-10 pb-8">
        <Reveal>
          <BookingForm vehicles={taxiVehicles} />
        </Reveal>
      </section>

      <FleetSection vehicles={vehicles.slice(0, 6)} />
      <WhyChooseUs />

      <RouteSection title="Popular Tour Routes" routes={grouped.tour} vehicles={taxiVehicles} type="tour" />
      <RouteSection title="Popular Airport Transfers" routes={grouped.airport} vehicles={taxiVehicles} type="airport" />
      <RouteSection title="Popular Destinations" routes={grouped.destination} vehicles={taxiVehicles} type="taxi" />
      <RouteSection title="Popular One Way Routes" routes={grouped.one_way} vehicles={taxiVehicles} type="taxi" />
      <RouteSection title="Local Within City" routes={grouped.local} vehicles={taxiVehicles} type="taxi" />

      <Testimonials testimonials={testimonials} />

      <section className="pt-10 pb-8">
        <Reveal>
          <TravelCostCalculator />
        </Reveal>
      </section>

      <CTASection />
    </>
  );
}