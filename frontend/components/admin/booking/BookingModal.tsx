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
    <div onClick={closeModal} className="overlay-enter fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="modal-enter relative bg-[#141414] border border-[#252525] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <button
          onClick={closeModal}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] text-white/70 transition-colors hover:text-white hover:border-[#ecb100]/50"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto p-6 pt-16">
          {type === "taxi" && (
            <TaxiBookingForm
              rideMode={prefill.rideMode || "oneway"}
              selectedVehicleId={prefill.vehicleId || ""}
              routeId={prefill.routeId}
              price={prefill.price}
            />
          )}

          {type === "airport" && (
            <AirportTransferForm
              routeId={prefill.routeId}
              vehicleId={prefill.vehicleId}
              price={prefill.price}
              pickup={prefill.pickup}
            />
          )}

          {type === "tour" && (
            <TourBookingForm
              routeId={prefill.routeId}
              vehicleId={prefill.vehicleId}
              price={prefill.price}
              pickup={prefill.pickup}
              destination={prefill.drop}
            />
          )}
        </div>
      </div>
    </div>
  );
}