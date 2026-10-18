"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  User,
  Users,
  Car,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import BookingSuccess from "@/components/common/BookingSuccess";
import { FieldError } from "@/components/common/ContactInputs";

import { API_URL } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";
import {
  DEFAULT_PHONE_PREFIX,
  PHONE_PLACEHOLDER,
  formatPhoneInput,
  isPhoneEmpty,
  validatePhone,
} from "@/src/lib/contactValidation";

type Pkg = {
  title: string;
  duration: string;
  location: string;
};

const EMPTY_FORM = {
  name: "",
  phone: DEFAULT_PHONE_PREFIX,
  pickupCity: "",
  travellers: "",
  vehiclePreference: "",
  requirements: "",
};

export default function PackageBookingForm({
  pkg,
}: {
  pkg: Pkg;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [travelDate, setTravelDate] = useState<Date>();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const { success, bookingId, done, reset } = useBookingStatus();

  const updateField = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const phoneError =
    touched.phone && !isPhoneEmpty(form.phone) ? validatePhone(form.phone) : null;

  const submitBooking = async () => {
    if (!form.name.trim() || isPhoneEmpty(form.phone) || !form.pickupCity.trim() || !travelDate) {
      setTouched({ name: true, phone: true, pickupCity: true });
      setFormError("Please fill in your name, phone number, pickup city and travel date.");
      return;
    }

    const contactError = validatePhone(form.phone);
    if (contactError) {
      setTouched((prev) => ({ ...prev, phone: true }));
      setFormError(contactError);
      return;
    }

    setFormError("");

    try {
      setLoading(true);

      const requirements = [
        form.travellers && `Travellers: ${form.travellers}`,
        form.vehiclePreference && `Vehicle preference: ${form.vehiclePreference}`,
        form.requirements,
      ]
        .filter(Boolean)
        .join("\n");

      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("phone", form.phone);
      data.append("pickupCity", form.pickupCity.trim());
      data.append("destination", pkg.title);
      data.append("route", `${form.pickupCity.trim()} → ${pkg.title}`);
      data.append("travelDate", travelDate.toISOString());
      data.append("requirements", requirements);
      data.append("paymentType", "later");

      const res = await fetch(`${API_URL}/api/tour-bookings`, {
        method: "POST",
        body: data,
      });
      const resData = await res.json();

      if (resData.success) {
        done(resData.booking?.id);
        setForm(EMPTY_FORM);
        setTravelDate(undefined);
        setTouched({});
      } else {
        setFormError(resData.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-[#252525] bg-[#141414] p-8 shadow-[0_0_50px_rgba(236,177,0,0.08)]">
      {/* HEADER */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#ecb100]">Tour Booking</p>

        <h2 className="mt-3 text-3xl font-bold text-white">Book {pkg.title}</h2>

        <p className="mt-2 text-[#8a8a8a]">
          {pkg.duration}
          <span className="mx-2 text-[#ecb100]">•</span>
          {pkg.location}
        </p>
      </div>

      {/* FORM */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Input
          icon={<User size={18} />}
          placeholder="Full Name"
          value={form.name}
          onChange={(v) => updateField("name", v)}
          onBlur={() => markTouched("name")}
          invalid={touched.name && !form.name.trim()}
        />

        <div>
          <Input
            icon={<Phone size={18} />}
            placeholder={PHONE_PLACEHOLDER}
            type="tel"
            value={form.phone}
            onChange={(v) => updateField("phone", formatPhoneInput(v))}
            onBlur={() => markTouched("phone")}
            invalid={!!phoneError || (touched.phone && isPhoneEmpty(form.phone))}
          />
          <FieldError message={phoneError} />
        </div>

        <Input
          icon={<MapPin size={18} />}
          placeholder="Pickup City"
          value={form.pickupCity}
          onChange={(v) => updateField("pickupCity", v)}
          onBlur={() => markTouched("pickupCity")}
          invalid={touched.pickupCity && !form.pickupCity.trim()}
        />

        <div>
          <DatePicker value={travelDate} onChange={setTravelDate} />
        </div>

        <Input
          icon={<Users size={18} />}
          placeholder="Number of Travellers"
          type="number"
          value={form.travellers}
          onChange={(v) => updateField("travellers", v)}
        />

        <Input
          icon={<Car size={18} />}
          placeholder="Vehicle Preference (Sedan/SUV/Tempo)"
          value={form.vehiclePreference}
          onChange={(v) => updateField("vehiclePreference", v)}
        />
      </div>

      <textarea
        placeholder="Special Requirements"
        value={form.requirements}
        onChange={(e) => updateField("requirements", e.target.value)}
        className="mt-6 min-h-32 w-full rounded-xl border border-[#252525] bg-black/40 p-4 text-white placeholder:text-[#666] outline-none focus:border-[#ecb100]"
      />

      {formError && <p className="mt-4 text-sm text-red-400">{formError}</p>}

      <Button
        onClick={submitBooking}
        disabled={loading}
        className="mt-8 w-full bg-[#ecb100] py-6 text-lg text-black hover:bg-[#f6c94c]"
      >
        {loading ? "Submitting..." : "Submit Tour Request"}
      </Button>

      <BookingSuccess
        open={success}
        onClose={reset}
        bookingId={bookingId}
        title="Tour Request Received"
      />
    </section>
  );
}

function Input({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  invalid,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-3.5 text-[#ecb100]">{icon}</div>

      <input
        type={type}
        inputMode={type === "tel" ? "tel" : undefined}
        autoComplete={type === "tel" ? "tel" : undefined}
        min={type === "number" ? 1 : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-black/40 py-3 pl-12 pr-4 text-white placeholder:text-[#666] outline-none ${
          invalid ? "border-red-500/60" : "border-[#252525] focus:border-[#ecb100]"
        }`}
      />
    </div>
  );
}
