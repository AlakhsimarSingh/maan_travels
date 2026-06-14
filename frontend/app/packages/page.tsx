import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { tourPackages } from "@/src/data/packages";


export default function PackagesPage() {
  return (
    <main className="pt-32 pb-24">

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6">

        <div className="max-w-3xl mb-16">

          <p
            className="
              mb-4
              uppercase
              tracking-[0.35em]
              text-sm
              text-[#ecb100]
            "
          >
            Tour Packages
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
            Explore Beautiful
            <span className="block text-[#ecb100]">
              Journeys Across India
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
            Discover carefully planned holiday packages covering
            Himachal Pradesh, Punjab, Kashmir and North India with
            comfortable vehicles and professional chauffeurs.
          </p>

        </div>



        {/* Package Grid */}
        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {
            tourPackages.map((pkg)=>(

              <article

                key={pkg.id}

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
                  hover:shadow-[0_0_35px_rgba(236,177,0,0.12)]
                "

              >


                {/* Image */}
                <div
                  className="
                    relative
                    h-64
                    overflow-hidden
                  "
                >

                  <Image

                    src={pkg.image}

                    alt={pkg.title}

                    fill

                    className="
                      object-cover
                      transition
                      duration-500
                      group-hover:scale-110
                    "

                  />


                  {/* Overlay */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/70
                      to-transparent
                    "
                  />


                  <div
                    className="
                      absolute
                      bottom-4
                      left-5
                    "
                  >

                    <span
                      className="
                        rounded-full
                        bg-black/60
                        px-4
                        py-2
                        text-xs
                        text-[#ecb100]
                        backdrop-blur
                      "
                    >
                      {pkg.duration}
                    </span>

                  </div>


                </div>



                {/* Content */}
                <div className="p-6">


                  <p
                    className="
                      text-sm
                      text-[#ecb100]
                    "
                  >
                    {pkg.location}
                  </p>



                  <h2
                    className="
                      mt-2
                      text-2xl
                      font-semibold
                      text-white
                    "
                  >
                    {pkg.title}
                  </h2>



                  <p
                    className="
                      mt-4
                      line-clamp-3
                      text-sm
                      leading-relaxed
                      text-[#8a8a8a]
                    "
                  >
                    {pkg.shortDescription}
                  </p>



                  {/* Highlights */}

                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                    {pkg.highlights
                      .slice(0,3)
                      .map((item)=>(

                      <span
                        key={item}
                        className="
                          rounded-full
                          border
                          border-[#252525]
                          px-3
                          py-1
                          text-xs
                          text-[#c7c7c7]
                        "
                      >
                        {item}
                      </span>

                    ))}

                  </div>



                  <Button

                    asChild

                    className="
                      mt-6
                      w-full
                      bg-[#ecb100]
                      text-black
                      hover:bg-[#f6c94c]
                    "

                  >

                    <Link
                      href={`/packages/${pkg.slug}`}
                    >
                      View Package
                    </Link>

                  </Button>


                </div>


              </article>

            ))
          }


        </div>

      </section>

    </main>
  );
}