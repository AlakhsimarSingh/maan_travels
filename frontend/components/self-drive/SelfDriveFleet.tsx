"use client";

import { useRef, useState } from "react";

import { selfDriveVehicles } from "@/src/data/selfDrive";

import SelfDriveCard from "./SelfDriveCard";
import SelfDriveBookingForm from "./SelfDriveBookingForm";


export default function SelfDriveFleet() {


  const [selectedVehicle, setSelectedVehicle] =
    useState<number | null>(null);


  const [bookingVehicle, setBookingVehicle] =
    useState<any | null>(null);
    const bookingRef = useRef<HTMLDivElement | null>(null);



  return (

    <section className="py-24">


      <div className="mx-auto max-w-7xl px-6">



        {/* HEADER */}

        <div className="mb-14 text-center">


          <p
            className="
              uppercase
              tracking-[0.3em]
              text-[#ecb100]
            "
          >
            Self Drive Rentals
          </p>



          <h2
            className="
              mt-4
              text-4xl
              font-bold
              text-white
            "
          >
            Choose Your Perfect Vehicle
          </h2>



          <p
            className="
              mt-4
              text-[#8a8a8a]
            "
          >
            Premium vehicles available for flexible self-drive rentals.
          </p>


        </div>





        {/* VEHICLE GRID */}

        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >


          {
            selfDriveVehicles.map((vehicle)=>{


              const isSelected =
                selectedVehicle === vehicle.id;



              return (

                <div
                  key={vehicle.id}

                  className={`
                    ${
                      isSelected
                      ? "lg:col-span-3 md:col-span-2"
                      : ""
                    }
                  `}
                >


                  <SelfDriveCard

                    vehicle={vehicle}

                    expanded={isSelected}

                    onToggle={()=>{

                      setSelectedVehicle(
                        isSelected
                        ? null
                        : vehicle.id
                      );

                    }}


                    onBook={() => {
                    setBookingVehicle(vehicle);

                    setTimeout(() => {
                        bookingRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                        });
                    }, 100);
                    }}

                  />


                </div>

              );


            })
          }


        </div>





        {/* BOOKING FORM */}

        {
            bookingVehicle && (
                <div
                ref={bookingRef}
                className="mt-20 scroll-mt-24"
                >
                <SelfDriveBookingForm
                    vehicle={bookingVehicle}
                    onClose={() => setBookingVehicle(null)}
                />
                </div>
            )
        }



      </div>


    </section>

  );

}