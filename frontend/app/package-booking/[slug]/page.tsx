import { notFound } from "next/navigation";

import { tourPackages } from "@/src/data/packages";

import PackageBookingForm from "@/components/packages/PackageBookingForm";

import Breadcrumbs from "@/components/shared/Breadcrumbs";



type Props = {
  params: Promise<{
    slug:string;
  }>;
};





export default async function PackageBookingPage({
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

    <main
      className="
      pt-28
      pb-24
      "
    >


      <section
        className="
        mx-auto
        max-w-7xl
        px-6
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
              label:pkg.title,
              href:`/packages/${pkg.slug}`
            },
            {
              label:"Booking"
            }
          ]}

        />







        <div
          className="
          mt-12
          grid
          items-start
          gap-10
          lg:grid-cols-3
          "
        >





          {/* PACKAGE SUMMARY CARD */}


          <aside
            className="
            lg:sticky
            lg:top-28

            rounded-3xl
            border
            border-[#252525]

            bg-[#141414]

            p-8

            h-fit
            "
          >



            <p
              className="
              uppercase
              tracking-[0.3em]
              text-sm
              text-[#ecb100]
              "
            >
              Selected Package
            </p>





            <h1
              className="
              mt-4
              text-3xl
              font-bold
              text-white
              "
            >
              {pkg.title}
            </h1>





            <p
              className="
              mt-3
              text-[#8a8a8a]
              "
            >
              {pkg.duration}
            </p>







            <div
              className="
              mt-8
              space-y-4
              "
            >





              <div
                className="
                rounded-xl

                border
                border-[#252525]

                bg-black/30

                p-4
                "
              >


                <p
                  className="
                  text-xs
                  uppercase
                  text-[#8a8a8a]
                  "
                >
                  Tour Type
                </p>


                <p
                  className="
                  mt-1
                  text-white
                  "
                >
                  Custom Cab Package
                </p>


              </div>







              <div
                className="
                rounded-xl

                border
                border-[#252525]

                bg-black/30

                p-4
                "
              >


                <p
                  className="
                  text-xs
                  uppercase
                  text-[#8a8a8a]
                  "
                >
                  Duration
                </p>



                <p
                  className="
                  mt-1
                  text-white
                  "
                >
                  {pkg.duration}
                </p>



              </div>






              <div
                className="
                rounded-xl

                border
                border-[#252525]

                bg-black/30

                p-4
                "
              >


                <p
                  className="
                  text-xs
                  uppercase
                  text-[#8a8a8a]
                  "
                >
                  Destination
                </p>



                <p
                  className="
                  mt-1
                  text-white
                  "
                >
                  {pkg.location}
                </p>



              </div>





            </div>



          </aside>









          {/* BOOKING FORM */}


          <div
            className="
            lg:col-span-2
            "
          >


            <PackageBookingForm
              pkg={pkg}
            />



          </div>





        </div>





      </section>



    </main>


  );

}








export async function generateMetadata({
 params,
}:Props){


 const {slug}=await params;



 const pkg =
  tourPackages.find(
    item=>item.slug===slug
  );



 if(!pkg){
  return {};
 }



 return {

  title:`Book ${pkg.title} | Maan Travels`,

  description:
   `Reserve your ${pkg.title} with Maan Travels.`

 };


}