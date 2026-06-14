import FleetCard from "./FleetCard";
import { cabVehicles } from "@/src/data/fleet";

export default function FleetSection() {
  return (
    <section id="fleet" className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <p
            className="
              mb-3
              uppercase
              tracking-[0.3em]
              text-[#ecb100]
            "
          >
            Our Fleet
          </p>


          <h2
            className="
              text-4xl
              font-bold
              text-white
              md:text-5xl
            "
          >
            Choose Your Preferred Vehicle
          </h2>


          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-[#8a8a8a]
            "
          >
            Comfortable sedans, premium SUVs and luxury vehicles
            for every journey.
          </p>

        </div>


        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {cabVehicles.map((item) => (

            <FleetCard
              key={item.id}
              name={item.name}
              image={item.image}
              description={`${item.category} • ${item.passengers}`}
            />

          ))}

        </div>


      </div>
    </section>
  );
}