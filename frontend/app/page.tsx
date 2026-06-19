"use client";

import Hero from "@/components/home/Hero";
import FleetSection from "@/components/home/FleetSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PopularPackages from "@/components/home/PopularPackages";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import PopularDestinations from "@/components/home/PopularDestinations";
import TravelCostCalculator from "@/components/calculator/TravelCostCalculator";
import BookingForm from "@/components/home/BookingForm";

import { useRoutes } from "@/src/hooks/useRoutes";
import RouteSection from "@/components/home/RouteSection";

export default function Home() {
  const { routes = [], loading } = useRoutes();

  // ⚡ safer fallback + avoids runtime crash if API returns undefined
  const safeRoutes = Array.isArray(routes) ? routes : [];

  const grouped = {
    destination: safeRoutes.filter(r => r.category === "destination"),
    one_way: safeRoutes.filter(r => r.category === "one_way"),
    local: safeRoutes.filter(r => r.category === "local"),
    airport: safeRoutes.filter(r => r.category === "airport"),
    tour: safeRoutes.filter(r => r.category === "tour"),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse text-sm tracking-wide opacity-70">
          Loading routes...
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />

      <section className="pt-10 pb-8">
        <BookingForm />
      </section>

      <FleetSection />
      <WhyChooseUs />

      <RouteSection
        title="Popular Destinations"
        routes={grouped.destination}
        type="taxi"
      />

      <RouteSection
        title="Popular One Way Routes"
        routes={grouped.one_way}
        type="taxi"
      />

      <RouteSection
        title="Local Within City"
        routes={grouped.local}
        type="taxi"
      />

      <RouteSection
        title="Popular Airport Transfers"
        routes={grouped.airport}
        type="airport"
      />

      <RouteSection
        title="Popular Tour Routes"
        routes={grouped.tour}
        type="tour"
      />

      <Testimonials />

      <section className="pt-10 pb-8">
        <TravelCostCalculator />
      </section>

      <CTASection />
    </>
  );
}