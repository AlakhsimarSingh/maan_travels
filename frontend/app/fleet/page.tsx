import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cabVehicles } from "@/src/data/fleet";


export default function FleetPage() {
  return (
    <main className="pt-32 pb-24">

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6">

        <div className="mb-16 max-w-3xl">

          <p
            className="
              mb-4
              uppercase
              tracking-[0.35em]
              text-sm
              text-[#ecb100]
            "
          >
            Our Fleet
          </p>


          <h1
            className="
              text-5xl
              font-bold
              leading-tight
              text-white
              md:text-6xl
            "
          >
            Premium Vehicles
            <span className="block text-[#ecb100]">
              For Every Journey
            </span>
          </h1>


          <p
            className="
              mt-6
              max-w-2xl
              text-lg
              leading-relaxed
              text-[#8a8a8a]
            "
          >
            Choose from our well-maintained fleet of comfortable
            sedans, premium SUVs and luxury vehicles driven by
            professional chauffeurs.
          </p>


          <Button
            asChild
            className="
              mt-8
              bg-[#ecb100]
              text-black
              hover:bg-[#f6c94c]
            "
          >
            <Link href="/booking">
              Book Now
            </Link>
          </Button>


        </div>



        {/* Fleet Grid */}
        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {cabVehicles.map((vehicle) => (

            <div
              key={vehicle.id}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-[#252525]
                bg-[#141414]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#ecb100]
                hover:shadow-[0_0_30px_rgba(236,177,0,0.12)]
              "
            >

              <div
                className="
                  relative
                  h-64
                  overflow-hidden
                "
              >

                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-110
                  "
                />

              </div>



              <div className="p-6">


                <h2
                  className="
                    text-2xl
                    font-semibold
                    text-white
                  "
                >
                  {vehicle.name}
                </h2>



                <p
                  className="
                    mt-3
                    text-[#8a8a8a]
                  "
                >
                  {vehicle.category}
                </p>



                <div
                  className="
                    mt-5
                    flex
                    justify-between
                    text-sm
                    text-[#c7c7c7]
                  "
                >

                  <span>
                    {vehicle.passengers}
                  </span>


                  <span>
                    {vehicle.luggage}
                  </span>

                </div>


              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Bottom CTA */}
      <section
        className="
          mx-auto
          mt-24
          max-w-5xl
          rounded-3xl
          border
          border-[#252525]
          bg-[#141414]
          px-8
          py-12
          text-center
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            text-white
          "
        >
          Ready for your next journey?
        </h2>


        <p
          className="
            mt-3
            text-[#8a8a8a]
          "
        >
          Book a comfortable ride with Maan Travels today.
        </p>


        <Button
          asChild
          className="
            mt-6
            bg-[#ecb100]
            text-black
            hover:bg-[#f6c94c]
          "
        >

          <Link href="/booking">
            Book Your Ride
          </Link>

        </Button>


      </section>


    </main>
  );
}