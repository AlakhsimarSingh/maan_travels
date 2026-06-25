"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import AirportTransferForm from "@/components/booking/AirportTransferForm";
import TaxiBookingForm from "@/components/booking/TaxiBookingForm";
import TourBookingForm from "@/components/booking/TourBookingForm";
import { useBookingModal } from "@/src/store/bookingModalStore";

export default function BookingModal() {
  const { open, type, prefill, closeModal } = useBookingModal();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, closeModal]);

  if (!open) return null;

  return (
    <div
      onClick={closeModal}
      className="overlay-enter fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto"
    >
      {/* min-h-full + my-auto keeps the modal vertically centred when content
          is short, but lets it grow past the viewport (with outer scroll) on
          mobile when the form is tall — no content is ever cut off. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-enter relative bg-[#141414] border border-[#252525] rounded-2xl w-full max-w-4xl my-auto"
      >
        <button
          onClick={closeModal}
          aria-label="Close booking modal"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] text-white/70 transition-colors hover:text-white hover:border-[#ecb100]/50"
        >
          <X size={18} />
        </button>

        <div className="p-4 sm:p-6 pt-14">
          {type === "taxi" && (
            <TaxiBookingForm
              rideMode={prefill.rideMode || "oneway"}
              selectedVehicleId={prefill.vehicleId || ""}
              routeId={prefill.routeId}
              price={prefill.price}
              // TODO: TaxiBookingForm doesn't yet accept pickup/drop/locked
              // props, so route-card bookings of type "taxi" still lose the
              // fixed pickup/drop info. Add the same `locked` pattern used
              // in TourBookingForm here once that file is updated.
            />
          )}

          {type === "airport" && (
            <AirportTransferForm
              routeId={prefill.routeId}
              vehicleId={prefill.vehicleId}
              price={prefill.price}
              pickup={prefill.pickup}
              airport={prefill.airport}
              // TODO: same as above — wire up `locked` once
              // AirportTransferForm supports it.
            />
          )}

          {type === "tour" && (
            <TourBookingForm
              routeId={prefill.routeId}
              vehicleId={prefill.vehicleId}
              price={prefill.price}
              pickup={prefill.pickup}
              destination={prefill.drop}
              locked={prefill.locked}
            />
          )}
        </div>
      </div>
    </div>
  );
}