"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { PaymentScreenshot } from "@/components/admin/PaymentScreenshot";
import { updatePaymentStatus } from "@/src/services/bookingAdminService";

const paymentStatusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  verified: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
  not_required: "bg-gray-500/10 text-gray-400",
};

export default function BookingDetailsModal({
  booking,
  open,
  onClose,
  onBookingUpdate,
}: {
  booking: any;
  open: boolean;
  onClose: () => void;
  onBookingUpdate?: () => void;
}) {
  const [paymentStatus, setPaymentStatus] = useState(booking?.paymentStatus || "pending");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setPaymentStatus(booking?.paymentStatus || "pending");
  }, [booking?.id, booking?.paymentStatus]);

  if (!open || !booking) return null;

  const balance = (booking.totalAmount || 0) - (booking.amountPaid || 0);
  const isUnpaidOnPaper =
    (booking.paymentType === "full" || booking.paymentType === "partial") &&
    booking.totalAmount != null &&
    balance > 0;

  const handlePaymentStatusChange = async (status: string) => {
    setUpdating(true);
    try {
      const res = await updatePaymentStatus(booking.id, status);
      if (res?.success) {
        setPaymentStatus(status);
        onBookingUpdate?.();
      }
    } catch (err) {
      console.error("Payment status update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-2xl rounded-2xl border border-[#252525] bg-[#141414] p-6 text-white max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Booking Details</h2>
            <p className="text-sm text-[#8a8a8a] mt-1">{booking.serviceType}</p>
          </div>

          <button onClick={onClose} className="rounded-lg p-2 hover:bg-[#252525]">
            <X size={20} />
          </button>
        </div>

        {/* CUSTOMER */}
        <Section title="Customer">
          <Detail label="Name" value={booking.customer?.name} />
          <Detail label="Phone" value={booking.customer?.phone} />
          <Detail label="Email" value={booking.customer?.email || "-"} />
        </Section>

        {/* BOOKING */}
        <Section title="Booking Information">
          <Detail label="Status" value={booking.status} />
          <Detail label="Vehicle" value={booking.vehicle?.name} />
          <Detail label="Route" value={booking.route?.title} />
          <Detail label="Created" value={new Date(booking.createdAt).toLocaleString()} />
        </Section>

        {/* PAYMENT */}
        <Section title="Payment">
          <Detail label="Payment Type" value={booking.paymentType} />
          <Detail
            label="Total Amount"
            value={booking.totalAmount != null ? `₹${booking.totalAmount}` : "-"}
          />
          <Detail
            label="Amount Paid"
            value={booking.amountPaid != null ? `₹${booking.amountPaid}` : "₹0"}
          />
          {booking.totalAmount != null && (
            <Detail label="Balance Due" value={`₹${balance > 0 ? balance : 0}`} />
          )}

          <div className="flex justify-between gap-4 items-center">
            <span className="text-[#8a8a8a]">Payment Status</span>
            <span
              className={`rounded-full px-3 py-1 text-xs capitalize ${
                paymentStatusColor[paymentStatus] || "bg-gray-500/10 text-gray-400"
              }`}
            >
              {paymentStatus}
            </span>
          </div>

          {isUnpaidOnPaper && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-400">
              Claimed payment type is "{booking.paymentType}" but ₹{balance} of the total is still
              unaccounted for — check the screenshot carefully before verifying.
            </div>
          )}

          {booking.paymentScreenshot ? (
            <div className="pt-2">
              <PaymentScreenshot bookingId={booking.id} />
            </div>
          ) : (
            (booking.paymentType === "full" || booking.paymentType === "partial") && (
              <p className="text-xs text-red-400">
                No screenshot on file, despite a {booking.paymentType} payment claim.
              </p>
            )
          )}

          {/* {(booking.paymentType === "full" || booking.paymentType === "partial") && (
            // <div className="flex gap-3 pt-3 border-t border-dashed border-[#252525]">
            //   <button
            //     onClick={() => handlePaymentStatusChange("verified")}
            //     disabled={updating || paymentStatus === "verified"}
            //     className="flex-1 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-400 transition hover:bg-green-500/20 disabled:opacity-50"
            //   >
            //     {paymentStatus === "verified" ? "Verified" : "Mark Verified"}
            //   </button>
            //   <button
            //     onClick={() => handlePaymentStatusChange("rejected")}
            //     disabled={updating || paymentStatus === "rejected"}
            //     className="flex-1 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
            //   >
            //     {paymentStatus === "rejected" ? "Rejected" : "Mark Rejected"}
            //   </button>
            // </div>
          )} */}
        </Section>

        {/* TAXI */}
        {booking.taxi && (
          <Section title="Taxi Details">
            <Detail label="Ride Mode" value={booking.taxi.rideMode} />
            <Detail label="Pickup" value={booking.taxi.pickup} />
            <Detail label="Drop" value={booking.taxi.drop || "-"} />
            <Detail label="Vehicle" value={booking.taxi.vehicle} />
            <Detail
              label="Travel Date"
              value={
                booking.taxi.travelDate
                  ? new Date(booking.taxi.travelDate).toLocaleDateString()
                  : "-"
              }
            />
          </Section>
        )}

        {/* AIRPORT */}
        {booking.airport && (
          <Section title="Airport Transfer Details">
            <Detail label="Pickup" value={booking.airport.pickup} />
            <Detail label="Airport" value={booking.airport.airport} />
            <Detail label="Terminal / Drop Point" value={booking.airport.terminal || "-"} />
            <Detail
              label="Travel Date"
              value={new Date(booking.airport.travelDate).toLocaleDateString()}
            />
            <Detail label="Pickup Time" value={booking.airport.pickupTime} />
            <Detail label="Vehicle" value={booking.airport.vehicle} />
            <Detail label="Passengers" value={booking.airport.passengers} />
            <Detail label="Suitcases" value={booking.airport.suitcases} />
            <Detail label="Handbags" value={booking.airport.handbags} />
          </Section>
        )}

        {/* TOUR */}
        {booking.tour && (
          <Section title="Tour Details">
            <Detail label="Pickup City" value={booking.tour.pickupCity} />
            <Detail label="Destination" value={booking.tour.destination} />
            <Detail label="Route" value={booking.tour.route} />
            <Detail label="Pickup Address" value={booking.tour.pickupAddress} />
          </Section>
        )}

        {/* SELF DRIVE */}
        {booking.selfDrive && (
          <Section title="Self Drive Details">
            <Detail label="Vehicle" value={booking.selfDrive.vehicle?.name} />
            <Detail
              label="Pickup Date"
              value={new Date(booking.selfDrive.pickupDate).toLocaleDateString()}
            />
            <Detail
              label="Return Date"
              value={new Date(booking.selfDrive.returnDate).toLocaleDateString()}
            />
            <Detail label="License" value={booking.selfDrive.license} />
          </Section>
        )}

        {/* LUXURY */}
        {booking.luxury && (
          <Section title="Luxury Car Details">
            <Detail label="Vehicle" value={booking.luxury.luxuryCar?.name} />
            <Detail label="Pickup" value={booking.luxury.pickup} />
            <Detail label="Destination" value={booking.luxury.destination} />
            <Detail
              label="Event Date"
              value={new Date(booking.luxury.eventDate).toLocaleDateString()}
            />
            <Detail label="Hours" value={booking.luxury.hours} />
            <Detail label="Event Type" value={booking.luxury.eventType} />
          </Section>
        )}

        {/* WEDDING */}
        {booking.wedding && (
          <Section title="Wedding Car Details">
            <Detail label="Vehicle" value={booking.wedding.luxuryCar?.name} />
            <Detail label="Pickup" value={booking.wedding.pickup} />
            <Detail label="Venue" value={booking.wedding.venue} />
            <Detail
              label="Wedding Date"
              value={new Date(booking.wedding.weddingDate).toLocaleDateString()}
            />
            <Detail label="Guests" value={booking.wedding.guests} />
            <Detail label="Cars Required" value={booking.wedding.carsRequired} />
            <Detail label="Decoration" value={booking.wedding.decoration || "-"} />
          </Section>
        )}

        {/* TEMPO / URBANIA */}
        {booking.tempo && (
          <Section title="Tempo / Urbania Details">
            <Detail label="Vehicle" value={booking.tempo.vehicle?.name} />
            <Detail label="Pickup" value={booking.tempo.pickup} />
            <Detail label="Destination" value={booking.tempo.destination} />
            <Detail
              label="Travel Date"
              value={new Date(booking.tempo.travelDate).toLocaleDateString()}
            />
            <Detail label="Passengers" value={booking.tempo.passengers} />
            <Detail label="Suitcases" value={booking.tempo.suitcaseCount} />
            <Detail label="Trip Type" value={booking.tempo.tripType} />
          </Section>
        )}

        {/* REQUIREMENTS */}
        {(booking.requirements ||
          booking.taxi?.requirements ||
          booking.tour?.requirements ||
          booking.selfDrive?.requirements ||
          booking.luxury?.requirements ||
          booking.wedding?.requirements ||
          booking.tempo?.requirements) && (
          <Section title="Additional Requirements">
            <p className="text-[#c7c7c7]">
              {booking.requirements ||
                booking.taxi?.requirements ||
                booking.tour?.requirements ||
                booking.selfDrive?.requirements ||
                booking.luxury?.requirements ||
                booking.wedding?.requirements ||
                booking.tempo?.requirements}
            </p>
          </Section>
        )}

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-[#252525] bg-[#111] p-4">
      <h3 className="mb-4 text-sm uppercase tracking-wide text-[#ecb100]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[#8a8a8a]">{label}</span>
      <span className="text-right">{value ?? "-"}</span>
    </div>
  );
}