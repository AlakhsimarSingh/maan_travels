import LuxuryCard from "./LuxuryCard";
import Reveal from "@/components/common/Reveal";

export default function LuxuryFleet({ cars }: { cars: any[] }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal className="text-center mb-14">
          <p className="uppercase tracking-[0.3em] text-[#ecb100]">Our Fleet</p>
          <h2 className="mt-4 text-4xl font-bold text-white">Luxury Cars Available For Rental</h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cars.length > 0 ? (
            cars.map((car, i) => (
              <Reveal key={car.id} delay={i * 80}>
                <LuxuryCard car={car} />
              </Reveal>
            ))
          ) : (
            <p className="text-[#8a8a8a] col-span-full text-center">
              No luxury cars available currently.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}