"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Car,
  Phone,
  User,
  Fuel,
  Settings,
  IdCard,
  MessageSquare,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { format, differenceInCalendarDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import BookingSuccess from "@/components/common/BookingSuccess";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Vehicle = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category: string;

  fuelType?: string | null;
  transmission?: string | null;

  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;

  price: number;
  rentalPerDay?: number | null;
};

type FormState = {
  name: string;
  phone: string;
  license: string;
  requirements: string;
};

type FormErrors = Partial<Record<keyof FormState | "pickupDate" | "returnDate", string>>;

export default function SelfDriveBookingForm({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle;
  onClose: () => void;
}) {
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    license: "",
    requirements: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string | undefined>();

  const dailyRate = vehicle.rentalPerDay || vehicle.price;

  const totalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    const days = differenceInCalendarDays(returnDate, pickupDate);
    return days > 0 ? days : days === 0 ? 1 : 0;
  }, [pickupDate, returnDate]);

  const estimatedTotal = totalDays > 0 ? totalDays * dailyRate : 0;

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.name.trim()) next.name = "Enter your full name";
    if (!form.phone.trim()) next.phone = "Enter a phone number";
    else if (!/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, "")))
      next.phone = "Enter a valid phone number";

    if (!form.license.trim()) next.license = "Driving license number is required";

    if (!pickupDate) next.pickupDate = "Select a pickup date";
    if (!returnDate) next.returnDate = "Select a return date";
    if (pickupDate && returnDate && returnDate < pickupDate) {
      next.returnDate = "Return date can't be before pickup date";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    setSubmitError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);

      const res = await fetch(`${API_URL}/api/selfdrive-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          name: form.name.trim(),
          phone: form.phone.trim(),
          license: form.license.trim(),
          requirements: form.requirements.trim(),

          pickupDate: pickupDate?.toISOString(),
          returnDate: returnDate?.toISOString(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setSubmitError(data.message || "Booking failed. Please try again.");
        return;
      }

      setBookingId(data.booking?.id);
      setSuccessOpen(true);
    } catch (err) {
      console.error("Booking error:", err);
      setSubmitError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[#252525] bg-[#141414]">
      <div className="grid lg:grid-cols-[320px_1fr]">
        {/* ---------------- VEHICLE SUMMARY SIDEBAR ---------------- */}
        <div className="relative border-b border-[#252525] bg-black/40 p-6 lg:border-b-0 lg:border-r">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#8a8a8a] transition hover:text-white"
            aria-label="Close booking form"
          >
            ✕
          </button>

          <p className="uppercase tracking-[0.3em] text-xs text-[#ecb100]">Self Drive Booking</p>

          {vehicle.imageUrl && (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="mt-4 h-36 w-full rounded-xl object-cover"
            />
          )}

          <h2 className="mt-4 text-2xl font-bold text-white">{vehicle.name}</h2>
          <p className="text-sm text-[#8a8a8a]">{vehicle.category}</p>

          <div className="mt-5 space-y-3">
            <SummaryRow icon={<Fuel size={16} />} label="Fuel" value={vehicle.fuelType || "-"} />
            <SummaryRow
              icon={<Settings size={16} />}
              label="Transmission"
              value={vehicle.transmission || "-"}
            />
            <SummaryRow
              icon={<Car size={16} />}
              label="Capacity"
              value={`${vehicle.passengerCapacity || "-"} seats • ${vehicle.suitcaseCapacity || "-"} bags`}
            />
          </div>

          <div className="mt-6 rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/10 p-4">
            <p className="text-xs text-[#8a8a8a]">Daily rate</p>
            <p className="text-2xl font-bold text-[#ecb100]">₹{dailyRate}</p>

            {totalDays > 0 && (
              <div className="mt-3 border-t border-[#ecb100]/20 pt-3 text-sm">
                <div className="flex justify-between text-[#c7c7c7]">
                  <span>{totalDays} {totalDays === 1 ? "day" : "days"}</span>
                  <span>₹{estimatedTotal}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#8a8a8a]">
                  Estimated total — final price confirmed on call.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- FORM ---------------- */}
        <div className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">Your details</h3>
          <p className="mt-1 text-sm text-[#8a8a8a]">
            Fill in your details and rental dates — we'll confirm availability by phone.
          </p>

          {/* DATES */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <DatePicker
              date={pickupDate}
              setDate={(d) => {
                setPickupDate(d);
                if (errors.pickupDate) setErrors((prev) => ({ ...prev, pickupDate: undefined }));
              }}
              placeholder="Pickup date"
              error={errors.pickupDate}
              minDate={new Date()}
            />

            <DatePicker
              date={returnDate}
              setDate={(d) => {
                setReturnDate(d);
                if (errors.returnDate) setErrors((prev) => ({ ...prev, returnDate: undefined }));
              }}
              placeholder="Return date"
              error={errors.returnDate}
              minDate={pickupDate || new Date()}
            />
          </div>

          {/* PERSONAL DETAILS */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              icon={<User size={18} />}
              placeholder="Full name"
              value={form.name}
              error={errors.name}
              onChange={(v) => handleChange("name", v)}
            />

            <Input
              icon={<Phone size={18} />}
              placeholder="Phone number"
              type="tel"
              value={form.phone}
              error={errors.phone}
              onChange={(v) => handleChange("phone", v)}
            />
          </div>

          <div className="mt-4">
            <Input
              icon={<IdCard size={18} />}
              placeholder="Driving license number/Passport Number"
              value={form.license}
              error={errors.license}
              onChange={(v) => handleChange("license", v)}
            />
          </div>

          {/* REQUIREMENTS */}
          <div className="relative mt-4">
            <div className="absolute left-4 top-3.5 text-[#ecb100]">
              <MessageSquare size={18} />
            </div>
            <textarea
              placeholder="Additional requirements or message (optional)"
              className="min-h-28 w-full rounded-xl border border-[#252525] bg-black/40 p-4 pl-12 text-white placeholder:text-[#666] focus:border-[#ecb100]/60 focus:outline-none"
              value={form.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
            />
          </div>

          {submitError && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {submitError}
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 w-full bg-[#ecb100] text-black hover:bg-[#f6c94c]"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Sending request...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                Confirm booking request
              </span>
            )}
          </Button>

          <p className="mt-3 text-center text-xs text-[#666]">
            No payment required now — our team will call to confirm details.
          </p>
        </div>
      </div>

      {/* ---------------- SUCCESS MODAL ---------------- */}
      <BookingSuccess
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          onClose();
        }}
        bookingId={bookingId}
        title="Self Drive Booking Confirmed"
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
          className={cn(
            "w-full rounded-xl border bg-black/40 py-3 pl-12 pr-4 text-white placeholder:text-[#666] focus:outline-none",
            error ? "border-red-500/60" : "border-[#252525] focus:border-[#ecb100]/60"
          )}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

/* ---------------- DATE PICKER ---------------- */
function DatePicker({
  date,
  setDate,
  placeholder,
  error,
  minDate,
}: {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder: string;
  error?: string;
  minDate?: Date;
}) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "relative flex w-full items-center rounded-xl border bg-black/40 py-3 pl-12 pr-4 text-left text-white",
              error ? "border-red-500/60" : "border-[#252525]",
              !date && "text-[#666]"
            )}
          >
            <CalendarDays size={18} className="absolute left-4 text-[#ecb100]" />
            {date ? format(date, "PPP") : placeholder}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto bg-[#141414] p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={minDate ? { before: minDate } : undefined}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

/* ---------------- SUMMARY ROW ---------------- */
function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-[#8a8a8a]">
        {icon}
        {label}
      </span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}