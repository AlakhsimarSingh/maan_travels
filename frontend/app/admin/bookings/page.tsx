"use client";

import { useEffect, useState } from "react";

import BookingDetailsModal from "@/components/admin/bookings/BookingDetailsModal";

import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "@/src/services/bookingAdminService";


const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];


const statusColor: Record<string, string> = {

  pending:
    "bg-yellow-500/10 text-yellow-400",

  confirmed:
    "bg-blue-500/10 text-blue-400",

  completed:
    "bg-green-500/10 text-green-400",

  cancelled:
    "bg-red-500/10 text-red-400",

};



export default function AdminBookingsPage() {


  const [bookings, setBookings] =
    useState<any[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [selectedBooking, setSelectedBooking] =
    useState<any>(null);



  const fetchBookings = async () => {

    try {

      setLoading(true);

      const res =
        await getAllBookings();


      if (res?.success) {

        setBookings(res.bookings);

      } else {

        setBookings([]);

      }


    } catch (err) {

      console.error(
        "Booking fetch error:",
        err
      );

      setBookings([]);


    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchBookings();

  }, []);




  const handleStatusChange = async (
    id:string,
    status:string
  ) => {


    try {

      await updateBookingStatus(
        id,
        status
      );

      fetchBookings();


    } catch(error){

      console.error(
        "Status update failed:",
        error
      );

    }

  };





  const handleDelete = async (
    id:string
  ) => {


    const ok =
      confirm(
        "Delete this booking permanently?"
      );


    if(!ok) return;



    try {

      await deleteBooking(id);

      fetchBookings();


    } catch(error){

      console.error(
        "Delete failed:",
        error
      );

    }

  };





  return (

    <div className="space-y-6">


      {/* HEADER */}

      <div>

        <h2 className="text-3xl font-bold text-white">
          Bookings
        </h2>


        <p className="mt-1 text-sm text-[#8a8a8a]">
          Manage customer bookings and track service status
        </p>

      </div>





      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[#252525]
          bg-[#141414]
        "
      >


        <table className="w-full text-sm text-white">


          <thead
            className="
              bg-[#0f0f0f]
              text-xs
              uppercase
              tracking-wider
              text-[#8a8a8a]
            "
          >

            <tr>

              <th className="p-4 text-left">
                Customer
              </th>


              <th className="text-left">
                Service
              </th>


              <th>
                Status
              </th>


              <th>
                Date
              </th>


              <th className="p-4 text-right">
                Actions
              </th>


            </tr>

          </thead>





          <tbody>


            {loading && (

              Array.from({
                length:5
              }).map((_,i)=>(

                <tr
                  key={i}
                  className="border-t border-[#1b1b1b]"
                >

                  <td
                    colSpan={5}
                    className="p-4"
                  >

                    <div
                      className="
                        h-4
                        w-full
                        rounded
                        bg-[#1a1a1a]
                        animate-pulse
                      "
                    />

                  </td>

                </tr>

              ))

            )}





            {!loading &&
            bookings.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="
                    p-8
                    text-center
                    text-[#8a8a8a]
                  "
                >
                  No bookings found
                </td>

              </tr>

            )}






            {!loading &&
            bookings.map((b)=>(


              <tr
                key={b.id}
                className="
                  border-t
                  border-[#1b1b1b]
                  hover:bg-[#1b1b1b]
                  transition
                "
              >



                {/* CUSTOMER */}

                <td className="p-4">

                  <div className="font-medium">

                    {b.customer?.name}

                  </div>


                  <div className="text-xs text-[#8a8a8a]">

                    {b.customer?.phone}

                  </div>


                </td>





                {/* SERVICE */}

                <td className="text-[#c7c7c7]">

                  {b.serviceType}

                </td>





                {/* STATUS */}

                <td>

                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      gap-2
                    "
                  >

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        capitalize
                        ${
                          statusColor[b.status]
                          ||
                          "bg-gray-500/10 text-gray-400"
                        }
                      `}
                    >

                      {b.status}

                    </span>




                    <select

                      value={b.status}

                      onChange={(e)=>
                        handleStatusChange(
                          b.id,
                          e.target.value
                        )
                      }


                      className="
                        rounded
                        border
                        border-[#252525]
                        bg-black
                        p-1
                        text-xs
                        text-white
                      "

                    >

                      {STATUS_OPTIONS.map((s)=>(

                        <option
                          key={s}
                          value={s}
                        >

                          {s}

                        </option>

                      ))}


                    </select>


                  </div>


                </td>






                {/* DATE */}

                <td className="text-[#8a8a8a]">

                  {
                    new Date(
                      b.createdAt
                    ).toLocaleDateString()
                  }

                </td>






                {/* ACTIONS */}

                <td
                  className="
                    space-x-3
                    p-4
                    text-right
                  "
                >

                  <button

                    onClick={()=>
                      setSelectedBooking(b)
                    }

                    className="
                      text-[#ecb100]
                      hover:underline
                    "

                  >

                    View Details

                  </button>




                  <button

                    onClick={()=>
                      handleDelete(b.id)
                    }

                    className="
                      text-red-400
                      hover:text-red-500
                    "

                  >

                    Delete

                  </button>


                </td>


              </tr>


            ))}


          </tbody>


        </table>


      </div>





      {/* DETAILS MODAL */}

      <BookingDetailsModal
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onBookingUpdate={fetchBookings}
      />


    </div>

  );

}