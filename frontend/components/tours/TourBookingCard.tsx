"use client";

import { MapPin, Phone, User, MessageSquare, ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import BookingSuccess from "@/components/common/BookingSuccess";
import { createTourBooking } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";

export default function TourBookingCard({
  pickup,
  destination,
}: {
  pickup: string;
  destination: string;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickupAddress: "",
    requirements: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState("");

  const { loading, success, bookingId, start, done, reset } = useBookingStatus();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const hasRoute = !!(pickup && destination);

  const submitBooking = async () => {
    if (!hasRoute) {
      setFormError("Select a pickup city and destination above first.");
      return;
    }

    if (!form.name || !form.phone || !form.pickupAddress) {
      setTouched({ name: true, phone: true, pickupAddress: true });
      setFormError("Please fill in your name, phone, and pickup address.");
      return;
    }

    setFormError("");

    try {
      start();

      const res = await createTourBooking({
        name: form.name,
        phone: form.phone,
        pickupCity: pickup,
        destination,
        route: `${pickup} → ${destination}`,
        pickupAddress: form.pickupAddress,
        requirements: form.requirements,
      });

      if ((res as any)?.success === false) {
        setFormError((res as any)?.message || "Couldn't submit your request.");
        reset();
        return;
      }

      done((res as any)?.booking?.id);

      setForm({ name: "", phone: "", pickupAddress: "", requirements: "" });
      setTouched({});
    } catch (error) {
      console.log(error);
      setFormError("Couldn't reach the server. Please try again.");
      reset();
    }
  };

  const fieldError = (field: string, value: string) => touched[field] && !value;

  return (
    <div className="mx-auto max-w-3xl px-6">
      <div className="overflow-hidden rounded-3xl border border-[#252525] bg-[#141414] shadow-2xl">
        {/* ROUTE HEADER */}
        <div className="border-b border-[#252525] bg-gradient-to-r from-[#ecb100]/10 via-transparent to-transparent px-8 py-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#ecb100]">
            Book your tour
          </p>

          <h2 className="mt-3 flex flex-wrap items-center gap-2 text-2xl font-bold text-white">
            {hasRoute ? (
              <>
                <span>{pickup}</span>
                <ArrowRight size={20} className="text-[#ecb100]" />
                <span>{destination}</span>
              </>
            ) : (
              <span className="text-white/40">Select your route above</span>
            )}
          </h2>
        </div>

        <div className="p-8">
          <div className="space-y-5">
            <FormInput
              icon={<User size={18} />}
              placeholder="Full name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              onBlur={() => markTouched("name")}
              error={fieldError("name", form.name)}
            />

            <FormInput
              icon={<Phone size={18} />}
              placeholder="Phone number"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
              onBlur={() => markTouched("phone")}
              error={fieldError("phone", form.phone)}
            />

            <FormInput
              icon={<MapPin size={18} />}
              placeholder="Pickup address"
              value={form.pickupAddress}
              onChange={(v) => updateField("pickupAddress", v)}
              onBlur={() => markTouched("pickupAddress")}
              error={fieldError("pickupAddress", form.pickupAddress)}
            />
          </div>

          <div className="relative mt-5">
            <MessageSquare size={16} className="pointer-events-none absolute left-4 top-4 text-[#ecb100]" />
            <textarea
              placeholder="Special requirements (optional)"
              value={form.requirements}
              onChange={(e) => updateField("requirements", e.target.value)}
              className="
                min-h-28 w-full rounded-xl border border-[#252525] bg-black/40
                p-4 pl-11 text-white outline-none transition-colors
                focus:border-[#ecb100]
              "
            />
          </div>

          {formError && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {formError}
            </div>
          )}

          <Button
            disabled={loading}
            onClick={submitBooking}
            className="
              group mt-6 h-13 w-full rounded-xl bg-[#ecb100] py-3.5
              text-base font-semibold text-black transition-all duration-200
              hover:bg-[#f6c94c] hover:shadow-[0_8px_24px_-8px_rgba(236,177,0,0.4)]
              active:scale-[0.99] disabled:opacity-60
            "
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? "Sending request..." : "Request quote"}
              {!loading && (
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </span>
          </Button>

          <p className="mt-3 text-center text-xs text-white/30">
            Our team will get back to you with pricing and itinerary details.
          </p>
        </div>
      </div>

      <BookingSuccess open={success} onClose={reset} bookingId={bookingId} />
    </div>
  );
}

function FormInput({
  icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]">
        {icon}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`
          h-12 w-full rounded-xl border bg-black/40 pl-12 pr-4
          text-white outline-none transition-colors
          ${error ? "border-red-500/60" : "border-[#252525] focus:border-[#ecb100]"}
        `}
      />
    </div>
  );
}