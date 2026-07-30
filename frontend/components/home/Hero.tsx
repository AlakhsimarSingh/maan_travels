import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/common/Reveal";
import HeroBookingWidget from "./HeroBookingWidget";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
};

export default function Hero({ vehicles = [] }: { vehicles?: Vehicle[] }) {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:min-h-[90vh] lg:pb-0 lg:pt-20">
      <div className="absolute inset-0">
        <Image src="/images/hero-bg.jpg" alt="" fill priority className="object-cover" />
      </div>

      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center px-6 lg:min-h-[calc(90vh-80px)]">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="mb-5 uppercase tracking-[0.4em] text-[#ecb100]">
                Premium Taxi Service
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl">
                Luxury Travel
                <span className="block text-[#ecb100]">Across India</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-[#c7c7c7]">
                Premium taxi services, airport taxi services, luxury tours, corporate
                travel, wedding transportation, and outstation journeys tailored for
                comfort and style.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-[#ecb100] text-black transition-transform hover:scale-105 hover:bg-[#f6c94c]"
                  asChild
                >
                  <Link href="#book">Book Ride</Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#ecb100] text-[#ecb100] transition-colors hover:bg-[#ecb100] hover:text-black"
                  asChild
                >
                  <Link href="/fleet">Explore Fleet</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="flex justify-center lg:justify-end">
            <HeroBookingWidget vehicles={vehicles} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}