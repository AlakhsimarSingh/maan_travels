import Hero from "@/components/home/Hero";
import BookingForm from "@/components/home/BookingForm";
import FleetSection from "@/components/home/FleetSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PopularPackages from "@/components/home/PopularPackages";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import PopularDestinations from "@/components/home/PopularDestinations";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}

      <Hero />

<section className="pt-24 pb-20">
  <BookingForm />
</section>

      <FleetSection />

      <WhyChooseUs />

      <PopularDestinations />

      <PopularPackages />

      <Testimonials />

      <CTASection />

      {/* <Footer /> */}
    </>
  );
}