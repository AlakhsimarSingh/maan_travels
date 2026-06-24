"use client";

import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Phone,
  User,
  Users,
  Route,
  Briefcase,
  MessageSquare,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import BookingSuccess from "@/components/common/BookingSuccess";
import Reveal from "@/components/common/Reveal";
// import BookingProgress from "@/components/common/BookingProgress";
import { createTempoBooking } from "@/src/services/bookingService";
import { cn } from "@/lib/utils";
import { TempoVehicle } from "@/src/lib/fetchTempoVehicles";
import BookingProgress from "../shared/BookingProgress";
// import type { TempoVehicle } from "@/src/lib/fetchTempoVehicles";

type FormState = {
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  passengers: string;
  suitcases: string;
  tripType: string;
  requirements: string;
};

type FormErrors = Partial<Record<keyof FormState | "travelDate", string>>;

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  pickup: "",
  destination: "",
  passengers: "",
  suitcases: "",
  tripType: "Round Trip",
  requirements: "",
};

export default function TempoUrbaniaBookingForm({
  vehicle,
  onClose,
}: {
  vehicle: TempoVehicle;
  onClose: () => void;
}) {
  const [travelDate, setTravelDate] = useState<Date | undefined>();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | undefined>();

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ---------------- PROGRESS STEPS ---------------- */
  const steps = [
    { label: "Your Details", complete: Boolean(form.name.trim() && form.phone.trim()) },
    { label: "Trip Info", complete: Boolean(form.pickup.trim() && form.destination.trim()) },
    {
      label: "Schedule",
      complete: Boolean(travelDate && form.passengers && Number(form.passengers) > 0),
    },
    {
      label: "Ready",
      complete: Boolean(
        form.name.trim() &&
          form.phone.trim() &&
          form.pickup.trim() &&
          form.destination.trim() &&
          travelDate &&
          form.passengers &&
          Number(form.passengers) > 0
      ),
    },
  ];

  /* ---------------- VALIDATION ---------------- */
  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.name.trim()) next.name = "Enter your full name";

    if (!form.phone.trim()) next.phone = "Enter a phone number";
    else if (!/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, "")))
      next.phone = "Enter a valid phone number";

    if (!form.pickup.trim()) next.pickup = "Enter a pickup location";
    if (!form.destination.trim()) next.destination = "Enter a destination";

    if (!form.passengers || Number(form.passengers) <= 0) {
      next.passengers = "Enter the number of passengers";
    } else if (
      vehicle.passengerCapacity &&
      Number(form.passengers) > vehicle.passengerCapacity
    ) {
      next.passengers = `This vehicle seats up to ${vehicle.passengerCapacity} passengers`;
    }

    if (!travelDate) next.travelDate = "Select a travel date";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    setSubmitError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);

      const res: any = await createTempoBooking({
        name: form.name.trim(),
        phone: form.phone.trim(),
        pickup: form.pickup.trim(),
        destination: form.destination.trim(),
        vehicleId: vehicle.id,
        passengers: form.passengers,
        suitcases: form.suitcases || "0",
        tripType: form.tripType,
        requirements: form.requirements.trim(),
        travelDate: travelDate!.toISOString(),
      } as any);

      if (!res?.success) {
        setSubmitError(res?.message || "Booking failed. Please try again.");
        return;
      }

      setBookingId(res?.booking?.id);
      setSuccess(true);

      setForm(EMPTY_FORM);
      setTravelDate(undefined);
    } catch (err) {
      console.error("Tempo booking error:", err);
      setSubmitError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 overflow-hidden rounded-3xl border border-[#252525] bg-[#141414] shadow-[0_0_50px_rgba(236,177,0,0.08)]">
      <div className="grid lg:grid-cols-[300px_1fr]">
        {/* ---------------- VEHICLE SUMMARY ---------------- */}
        <Reveal className="relative border-b border-[#252525] bg-black/40 p-6 lg:border-b-0 lg:border-r block">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#8a8a8a] transition hover:text-white"
            aria-label="Close booking form"
          >
            <X size={18} />
          </button>

          <p className="text-xs uppercase tracking-[0.3em] text-[#ecb100]">
            Tempo Traveller Booking
          </p>

          {vehicle.imageUrl && (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="mt-4 h-32 w-full rounded-xl object-cover"
            />
          )}

          <h2 className="mt-4 text-xl font-bold text-white">{vehicle.name}</h2>
          <p className="text-sm text-[#8a8a8a]">{vehicle.category} • Chauffeur included</p>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-[#8a8a8a]">
              <span>Seats</span>
              <span className="text-white">{vehicle.passengerCapacity || "—"}</span>
            </div>
            <div className="flex justify-between text-[#8a8a8a]">
              <span>Luggage</span>
              <span className="text-white">
                {vehicle.suitcaseCapacity ? `${vehicle.suitcaseCapacity} bags` : "—"}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/10 p-4">
            <p className="text-xs text-[#8a8a8a]">Starting at</p>
            <p className="text-xl font-bold text-[#ecb100]">₹{vehicle.price}</p>
          </div>
        </Reveal>

        {/* ---------------- FORM ---------------- */}
        <div className="p-6 sm:p-8">
          <Reveal delay={60}>
            <h3 className="text-lg font-semibold text-white">Your details</h3>
            <p className="mt-1 text-sm text-[#8a8a8a]">
              Fill in your trip details — our team will confirm availability by phone.
            </p>
          </Reveal>

          {/* ---------------- PREMIUM PROGRESS BAR ---------------- */}
          <Reveal delay={100} className="mt-6 block">
            <BookingProgress steps={steps} />
          </Reveal>

          <Reveal delay={140} className="block">
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Input
                icon={<User size={18} />}
                placeholder="Full Name"
                value={form.name}
                error={errors.name}
                onChange={(v) => handleChange("name", v)}
              />

              <Input
                icon={<Phone size={18} />}
                placeholder="Phone Number"
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={(v) => handleChange("phone", v)}
              />

              <Input
                icon={<MapPin size={18} />}
                placeholder="Pickup Location"
                value={form.pickup}
                error={errors.pickup}
                onChange={(v) => handleChange("pickup", v)}
              />

              <Input
                icon={<Route size={18} />}
                placeholder="Destination"
                value={form.destination}
                error={errors.destination}
                onChange={(v) => handleChange("destination", v)}
              />

              {/* DATE */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "relative flex w-full items-center rounded-xl border bg-black/40 py-3 pl-12 pr-4 text-left text-white",
                        errors.travelDate ? "border-red-500/60" : "border-[#252525]",
                        !travelDate && "text-[#666]"
                      )}
                    >
                      <CalendarDays size={18} className="absolute left-4 text-[#ecb100]" />
                      {travelDate ? travelDate.toDateString() : "Travel Date"}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto border-[#252525] bg-[#141414] p-0">
                    <Calendar
                      mode="single"
                      selected={travelDate}
                      onSelect={(d) => {
                        setTravelDate(d);
                        if (errors.travelDate)
                          setErrors((prev) => ({ ...prev, travelDate: undefined }));
                      }}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.travelDate && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.travelDate}</p>
                )}
              </div>

              <Input
                icon={<Users size={18} />}
                placeholder="Passengers"
                type="number"
                value={form.passengers}
                error={errors.passengers}
                onChange={(v) => handleChange("passengers", v)}
              />

              <Input
                icon={<Briefcase size={18} />}
                placeholder="Suitcases (optional)"
                type="number"
                value={form.suitcases}
                onChange={(v) => handleChange("suitcases", v)}
              />
            </div>

            {/* TRIP TYPE */}
            <div className="mt-5">
              <label className="text-xs font-medium text-[#8a8a8a]">Trip Type</label>

              <select
                value={form.tripType}
                onChange={(e) => handleChange("tripType", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#252525] bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ecb100]/60"
              >
                <option>Round Trip</option>
                <option>One Way</option>
                <option>Multi Day Tour</option>
              </select>
            </div>

            {/* REQUIREMENTS */}
            <div className="relative mt-5">
              <div className="absolute left-4 top-3.5 text-[#ecb100]">
                <MessageSquare size={18} />
              </div>
              <textarea
                value={form.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                placeholder="Special requirements (optional)"
                className="min-h-28 w-full rounded-xl border border-[#252525] bg-black/40 p-4 pl-12 text-white placeholder:text-[#666] focus:border-[#ecb100]/60 focus:outline-none"
              />
            </div>
          </Reveal>

          {submitError && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {submitError}
            </p>
          )}

          <Reveal delay={180} className="block">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 w-full bg-[#ecb100] py-6 text-lg text-black transition-transform hover:bg-[#f6c94c] hover:scale-[1.01] active:scale-[0.99]"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} />
                  Submit Traveller Booking Request
                </span>
              )}
            </Button>

            <p className="mt-3 text-center text-xs text-[#666]">
              No payment required now — our team will call to confirm details.
            </p>
          </Reveal>
        </div>
      </div>

      <BookingSuccess
        open={success}
        onClose={() => setSuccess(false)}
        bookingId={bookingId}
        title="Request Received"
        message="Our team will contact you shortly to confirm availability and details. Payment can be arranged once everything is confirmed."
      />
    </section>
  );
}

/* ---------------- INPUT ---------------- */
function Input({
  icon,
  placeholder,
  type = "text",
  value,
  error,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="relative">
        <div className="absolute left-4 top-3.5 text-[#ecb100]">{icon}</div>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-xl border bg-black/40 py-3 pl-12 pr-4 text-white placeholder:text-[#666] focus:outline-none",
            error ? "border-red-500/60" : "border-[#252525] focus:border-[#ecb100]/60"
          )}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}