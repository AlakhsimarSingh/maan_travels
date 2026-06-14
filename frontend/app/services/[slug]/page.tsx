import Image from "next/image";
import { notFound } from "next/navigation";

import { services } from "@/src/data/services";


export default function ServicePage({
  params,
}: {
  params: {
    slug:string;
  };
}) {


  const service =
    services.find(
      item => item.slug === params.slug
    );


  if(!service){
    notFound();
  }



  return (

    <main>


      {/* Hero */}

      <section
        className="
          relative
          h-[70vh]
        "
      >

        <Image
          src={service.heroImage}
          alt={service.title}
          fill
          className="object-cover"
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
            flex
            h-full
            items-center
          "
        >

          <div
            className="
              mx-auto
              max-w-7xl
              px-6
            "
          >

            <h1
              className="
                text-5xl
                font-bold
                text-white
              "
            >
              {service.title}
            </h1>


            <p
              className="
                mt-5
                max-w-2xl
                text-lg
                text-[#c7c7c7]
              "
            >
              {service.shortDescription}
            </p>


          </div>

        </div>

      </section>



      {/* Content */}


      <section className="py-24">

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-12
            px-6
            lg:grid-cols-2
          "
        >


          <div>

            <h2
              className="
                mb-5
                text-3xl
                font-bold
                text-white
              "
            >
              About This Service
            </h2>


            <p
              className="
                text-[#c7c7c7]
              "
            >
              {service.description}
            </p>


          </div>



          <div
            className="
              rounded-3xl
              border
              border-[#252525]
              bg-[#141414]
              p-8
            "
          >

            <h3
              className="
                mb-6
                text-2xl
                font-bold
                text-white
              "
            >
              Why Choose Us
            </h3>


            <ul className="space-y-4">

              {service.features.map(
                feature=>(
                  <li
                    key={feature}
                    className="
                      text-[#c7c7c7]
                    "
                  >
                    ✓ {feature}
                  </li>
                )
              )}

            </ul>


          </div>


        </div>

      </section>


    </main>
  );
}