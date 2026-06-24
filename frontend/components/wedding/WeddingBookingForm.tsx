"use client";

import {
  CalendarDays,
  Car,
  MapPin,
  Phone,
  User,
  Users,
  Building2,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import BookingSuccess from "@/components/common/BookingSuccess";
import { createWeddingBooking } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";

export default function WeddingBookingForm({ car }: { car: any }) {
  const [date, setDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    venue: "",
    guests: "",
    carsRequired: "1",
    decoration: "",
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

  const fieldError = (field: string, value: string) => touched[field] && !value;

  const submitBooking = async () => {
    const missing: string[] = [];
    if (!form.name) missing.push("name");
    if (!form.phone) missing.push("phone");
    if (!form.pickup) missing.push("pickup");
    if (!form.venue) missing.push("venue");
    if (!date) missing.push("date");

    if (missing.length > 0) {
      setTouched({ name: true, phone: true, pickup: true, venue: true });
      setFormError("Please fill in all required fields to continue.");
      return;
    }

    setFormError("");

    try {
      start();

      const payload = {
        name: form.name,
        phone: form.phone,
        luxuryCarId: String(car.id),
        pickup: form.pickup,
        venue: form.venue,
        weddingDate: date!.toISOString(),
        guests: Number(form.guests) || 0,
        carsRequired: Number(form.carsRequired) || 1,
        decoration: form.decoration,
        requirements: form.requirements,
      };

      const res = await createWeddingBooking(payload);

      if ((res as any)?.success === false) {
        setFormError((res as any)?.message || "Couldn't submit your request.");
        reset();
        return;
      }

      done((res as any)?.booking?.id);

      setForm({
        name: "",
        phone: "",
        pickup: "",
        venue: "",
        guests: "",
        carsRequired: "1",
        decoration: "",
        requirements: "",
      });
      setDate(undefined);
      setTouched({});
    } catch (error) {
      console.error(error);
      setFormError("Couldn't reach the server. Please try again.");
      reset();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* MAIN FORM */}
      <section className="overflow-hidden rounded-3xl border border-[#252525] bg-[#141414] shadow-[0_0_50px_rgba(236,177,0,0.08)]">
        {/* HEADER STRIP */}
        <div className="border-b border-[#252525] bg-gradient-to-r from-[#ecb100]/10 via-transparent to-transparent px-8 py-7">
          <p className="text-sm uppercase tracking-[0.3em] text-[#ecb100]">
            Wedding Car Booking
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Book {car.name}</h2>
          <p className="mt-2 text-[#8a8a8a]">
            Royal wedding arrival experience with premium chauffeur service.
          </p>
        </div>

        <div className="p-8">
          {/* SECTION: Contact */}
          <FormSection label="Your details">
            <div className="grid gap-5 md:grid-cols-2">
              <FieldInput
                icon={<User size={18} />}
                placeholder="Full name"
                value={form.name}
                onChange={(v) => updateField("name", v)}
                onBlur={() => markTouched("name")}
                error={fieldError("name", form.name)}
              />

              <FieldInput
                icon={<Phone size={18} />}
                placeholder="Phone number"
                value={form.phone}
                onChange={(v) => updateField("phone", v)}
                onBlur={() => markTouched("phone")}
                error={fieldError("phone", form.phone)}
              />
            </div>
          </FormSection>

          {/* SECTION: Event */}
          <FormSection label="Event details" className="mt-8">
            <div className="grid gap-5 md:grid-cols-2">
              <FieldInput
                icon={<MapPin size={18} />}
                placeholder="Pickup location"
                value={form.pickup}
                onChange={(v) => updateField("pickup", v)}
                onBlur={() => markTouched("pickup")}
                error={fieldError("pickup", form.pickup)}
              />

              <FieldInput
                icon={<Building2 size={18} />}
                placeholder="Wedding venue"
                value={form.venue}
                onChange={(v) => updateField("venue", v)}
                onBlur={() => markTouched("venue")}
                error={fieldError("venue", form.venue)}
              />

              {/* DATE PICKER */}
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]">
                  <CalendarDays size={18} />
                </div>

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      onBlur={() => markTouched("date")}
                      className={`h-12 w-full rounded-xl border bg-black/40 pl-12 text-left text-white transition-colors ${
                        fieldError("date", date ? "x" : "")
                          ? "border-red-500/60"
                          : "border-[#252525] focus:border-[#ecb100]"
                      }`}
                    >
                      {date ? date.toDateString() : "Wedding date"}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="border-[#252525] bg-[#141414] p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        setCalendarOpen(false);
                      }}
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <FieldInput
                icon={<Users size={18} />}
                placeholder="Number of guests"
                type="number"
                value={form.guests}
                onChange={(v) => updateField("guests", v)}
              />
            </div>
          </FormSection>

          {/* SECTION: Cars required — stepper instead of raw number input */}
          <FormSection label="Cars required" className="mt-8">
            <div className="flex items-center gap-4 rounded-xl border border-[#252525] bg-black/40 px-5 py-3">
              <Car size={18} className="text-[#ecb100]" />
              <span className="flex-1 text-white">Number of cars</span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "carsRequired",
                      String(Math.max(1, Number(form.carsRequired) - 1))
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333] text-white transition hover:border-[#ecb100]"
                >
                  −
                </button>
                <span className="w-6 text-center text-white">{form.carsRequired}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateField("carsRequired", String(Number(form.carsRequired) + 1))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333] text-white transition hover:border-[#ecb100]"
                >
                  +
                </button>
              </div>
            </div>
          </FormSection>

          {/* SECTION: Extras */}
          <FormSection label="Extras" className="mt-8">
            <FieldInput
              icon={<Sparkles size={18} />}
              placeholder="Decoration requirements (optional)"
              value={form.decoration}
              onChange={(v) => updateField("decoration", v)}
            />

            <div className="relative mt-5">
              <MessageSquare size={16} className="pointer-events-none absolute left-4 top-4 text-[#ecb100]" />
              <textarea
                placeholder="Special requirements — entry decoration, flower setup, timing etc. (optional)"
                value={form.requirements}
                onChange={(e) => updateField("requirements", e.target.value)}
                className="min-h-28 w-full rounded-xl border border-[#252525] bg-black/40 p-4 pl-11 text-white outline-none transition-colors placeholder:text-[#666] focus:border-[#ecb100]"
              />
            </div>
          </FormSection>

          {formError && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {formError}
            </div>
          )}

          <Button
            disabled={loading}
            onClick={submitBooking}
            className="group mt-8 h-14 w-full rounded-2xl bg-[#ecb100] text-base font-semibold text-black transition-all duration-200 hover:bg-[#f6c94c] hover:shadow-[0_8px_24px_-8px_rgba(236,177,0,0.4)] active:scale-[0.99] disabled:opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? "Submitting..." : "Submit booking request"}
              {!loading && (
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </span>
          </Button>
        </div>
      </section>

      {/* LIVE SUMMARY SIDEBAR */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 overflow-hidden rounded-3xl border border-[#252525] bg-[#141414] shadow-2xl">
          {car.image && (
            <div className="relative h-40 w-full">
              <Image src={car.image} alt={car.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            </div>
          )}

          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#ecb100]">Booking summary</p>
            <h3 className="mt-2 text-lg font-bold text-white">{car.name}</h3>

            <div className="mt-5 space-y-3 text-sm">
              <SummaryRow label="Pickup" value={form.pickup} />
              <SummaryRow label="Venue" value={form.venue} />
              <SummaryRow label="Date" value={date ? date.toDateString() : ""} />
              <SummaryRow label="Cars" value={form.carsRequired} />
              <SummaryRow label="Guests" value={form.guests} />
            </div>
          </div>
        </div>
      </aside>

      <BookingSuccess open={success} onClose={reset} bookingId={bookingId} />
    </div>
  );
}

function FormSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">{label}</p>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-white/40">{label}</span>
      <span className={`max-w-[60%] text-right ${value ? "text-white" : "text-white/25"}`}>
        {value || "—"}
      </span>
    </div>
  );
}

function FieldInput({
  icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: boolean;
  type?: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]">
        {icon}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`h-12 w-full rounded-xl border bg-black/40 pl-12 pr-4 text-white outline-none transition-colors placeholder:text-[#666] ${
          error ? "border-red-500/60" : "border-[#252525] focus:border-[#ecb100]"
        }`}
      />
    </div>
  );
}