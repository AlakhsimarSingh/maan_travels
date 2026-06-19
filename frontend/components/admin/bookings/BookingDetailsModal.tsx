"use client";

import { X } from "lucide-react";

export default function BookingDetailsModal({
  booking,
  open,
  onClose,
}: {
  booking: any;
  open: boolean;
  onClose: () => void;
}) {

  if (!open || !booking) return null;


  return (
    <div
      className="
        fixed inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          rounded-2xl
          border
          border-[#252525]
          bg-[#141414]
          p-6
          text-white
          max-h-[90vh]
          overflow-y-auto
        "
      >

        {/* HEADER */}

        <div className="flex justify-between items-start mb-6">

          <div>

            <h2 className="text-2xl font-bold">
              Booking Details
            </h2>

            <p className="text-sm text-[#8a8a8a] mt-1">
              {booking.serviceType}
            </p>

          </div>


          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2
              hover:bg-[#252525]
            "
          >
            <X size={20}/>
          </button>

        </div>



        {/* CUSTOMER */}

        <Section title="Customer">

          <Detail
            label="Name"
            value={booking.customer?.name}
          />

          <Detail
            label="Phone"
            value={booking.customer?.phone}
          />

          <Detail
            label="Email"
            value={
              booking.customer?.email || "-"
            }
          />

        </Section>




        {/* BOOKING */}

        <Section title="Booking Information">

          <Detail
            label="Status"
            value={booking.status}
          />

          <Detail
            label="Created"
            value={
              new Date(
                booking.createdAt
              ).toLocaleString()
            }
          />

        </Section>




        {/* TAXI */}

        {booking.taxi && (

          <Section title="Taxi Details">

            <Detail
              label="Ride Mode"
              value={booking.taxi.rideMode}
            />

            <Detail
              label="Pickup"
              value={booking.taxi.pickup}
            />

            <Detail
              label="Drop"
              value={booking.taxi.drop || "-"}
            />

            <Detail
              label="Vehicle"
              value={booking.taxi.vehicle}
            />

            <Detail
              label="Travel Date"
              value={
                booking.taxi.travelDate
                ?
                new Date(
                  booking.taxi.travelDate
                ).toLocaleDateString()
                :
                "-"
              }
            />

          </Section>

        )}





        {/* TOUR */}

        {booking.tour && (

          <Section title="Tour Details">


            <Detail
              label="Pickup City"
              value={booking.tour.pickupCity}
            />


            <Detail
              label="Destination"
              value={booking.tour.destination}
            />


            <Detail
              label="Route"
              value={booking.tour.route}
            />


            <Detail
              label="Pickup Address"
              value={booking.tour.pickupAddress}
            />


          </Section>

        )}





        {/* REQUIREMENTS */}

        {booking.requirements && (

          <Section title="Additional Requirements">

            <p className="text-[#c7c7c7]">
              {booking.requirements}
            </p>

          </Section>

        )}



      </div>

    </div>
  );
}





function Section({
  title,
  children,
}:{
  title:string;
  children:React.ReactNode;
}){

  return (

    <div
      className="
        mb-6
        rounded-xl
        border
        border-[#252525]
        bg-[#111]
        p-4
      "
    >

      <h3
        className="
          mb-4
          text-sm
          uppercase
          tracking-wide
          text-[#ecb100]
        "
      >
        {title}
      </h3>


      <div className="space-y-3">
        {children}
      </div>


    </div>

  );

}





function Detail({
  label,
  value,
}:{
  label:string;
  value:any;
}){

  return (

    <div className="flex justify-between gap-4">

      <span className="text-[#8a8a8a]">
        {label}
      </span>


      <span className="text-right">
        {value || "-"}
      </span>

    </div>

  );

}