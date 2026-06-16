import Hero from "@/components/home/Hero";
import FleetSection from "@/components/home/FleetSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PopularPackages from "@/components/home/PopularPackages";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import PopularDestinations from "@/components/home/PopularDestinations";
import TravelCostCalculator
from "@/components/calculator/TravelCostCalculator";
import BookingForm from "@/components/home/BookingForm";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="pt-10 pb-8">
      <BookingForm />
      </section>

      <FleetSection />

      <WhyChooseUs />

      <PopularDestinations />

      <PopularPackages />
      <Testimonials />

<section className="pt-10 pb-8">
  <TravelCostCalculator />
</section>

      <CTASection />

      {/* <Footer /> */}
    </>
  );
}