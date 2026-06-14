import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

import { tourPackages } from "@/src/data/packages";


type Props = {
  params: Promise<{
    slug:string;
  }>;
};



export default async function PackageDetailsPage({
  params,
}:Props){

  const {slug}=await params;


  const pkg =
    tourPackages.find(
      item=>item.slug===slug
    );


  if(!pkg){
    notFound();
  }



  return (

    <main className="pt-24 pb-24">


      {/* Hero */}

      <section
        className="
          relative
          h-[70vh]
          overflow-hidden
        "
      >

        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          priority
          className="
            object-cover
          "
        />


        <div
          className="
            absolute
            inset-0
            bg-black/70
          "
        />


        <div
          className="
            relative
            z-10
            mx-auto
            flex
            h-full
            max-w-7xl
            items-end
            px-6
            pb-16
          "
        >

          <div>


            <p
              className="
                uppercase
                tracking-[0.35em]
                text-[#ecb100]
              "
            >
              {pkg.duration}
            </p>


            <h1
              className="
                mt-4
                text-5xl
                font-bold
                text-white
                md:text-6xl
              "
            >
              {pkg.title}
            </h1>


            <p
              className="
                mt-5
                max-w-2xl
                text-lg
                text-[#c7c7c7]
              "
            >
              {pkg.shortDescription}
            </p>


          </div>

        </div>


      </section>





      <section
        className="
          mx-auto
          max-w-7xl
          px-6
          py-12
        "
      >

        <Breadcrumbs
          items={[
            {
              label:"Home",
              href:"/"
            },
            {
              label:"Packages",
              href:"/packages"
            },
            {
              label:pkg.title
            }
          ]}
        />



        <div
          className="
            mt-10
            grid
            gap-10
            lg:grid-cols-3
          "
        >



          {/* Main Content */}

          <div
            className="
              lg:col-span-2
            "
          >


            <h2
              className="
                text-3xl
                font-bold
                text-white
              "
            >
              Tour Highlights
            </h2>


            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >

              {
                pkg.highlights.map(item=>(

                  <span
                    key={item}
                    className="
                      rounded-full
                      border
                      border-[#252525]
                      bg-[#141414]
                      px-4
                      py-2
                      text-sm
                      text-[#c7c7c7]
                    "
                  >
                    {item}
                  </span>

                ))
              }

            </div>





            <h2
              className="
                mt-14
                text-3xl
                font-bold
                text-white
              "
            >
              Day Wise Itinerary
            </h2>



            <div
              className="
                mt-8
                space-y-6
              "
            >

            {
              pkg.itinerary.map(day=>(

                <div
                  key={day.day}
                  className="
                    rounded-3xl
                    border
                    border-[#252525]
                    bg-[#141414]
                    p-6
                  "
                >

                  <p
                    className="
                      text-[#ecb100]
                      font-semibold
                    "
                  >
                    {day.day}
                  </p>


                  <h3
                    className="
                      mt-2
                      text-xl
                      font-semibold
                      text-white
                    "
                  >
                    {day.title}
                  </h3>


                  {
                    day.description && (

                    <p
                      className="
                        mt-3
                        text-[#8a8a8a]
                      "
                    >
                      {day.description}
                    </p>

                    )
                  }



                  {
                    day.places && (

                    <ul
                      className="
                        mt-4
                        list-disc
                        space-y-1
                        pl-5
                        text-[#c7c7c7]
                      "
                    >

                    {
                      day.places.map(place=>(

                        <li key={place}>
                          {place}
                        </li>

                      ))
                    }

                    </ul>

                    )
                  }


                </div>

              ))
            }

            </div>


          </div>





          {/* CTA */}

          <aside>

            <div
              className="
                sticky
                top-28
                rounded-3xl
                border
                border-[#252525]
                bg-[#141414]
                p-8
              "
            >

              <h3
                className="
                  text-2xl
                  font-bold
                  text-white
                "
              >
                Plan This Journey
              </h3>


              <p
                className="
                  mt-3
                  text-[#8a8a8a]
                "
              >
                Get a customized quote with the best vehicle options.
              </p>


              <Button
                asChild
                className="
                  mt-6
                  w-full
                  bg-[#ecb100]
                  text-black
                "
              >

                <Link href="/booking">
                  Book Package
                </Link>

              </Button>


            </div>

          </aside>



        </div>


      </section>


    </main>

  );
}

export async function generateMetadata({
  params,
}: Props) {

  const { slug } = await params;


  const pkg =
    tourPackages.find(
      item => item.slug === slug
    );


  if (!pkg) {
    return {};
  }


  return {
    title: `${pkg.title} | Maan Travels`,
    description: pkg.shortDescription,
  };
}