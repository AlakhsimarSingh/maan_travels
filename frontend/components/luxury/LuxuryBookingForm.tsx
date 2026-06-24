"use client";

import { useState } from "react";
import { CalendarDays, Crown, MapPin, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import BookingSuccess from "@/components/common/BookingSuccess";
import Reveal from "@/components/common/Reveal";
// import BookingProgress from "@/components/common/BookingProgress";

import { API_URL } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";
import BookingProgress from "../shared/BookingProgress";

export function LuxuryBookingForm({ car }: { car: any }) {
  const [eventDate, setEventDate] = useState<Date>();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    destination: "",
    hours: "",
    eventType: "",
    requirements: "",
  });

  const [loading, setLoading] = useState(false);

  const { success, bookingId, done, reset } = useBookingStatus();

  const totalAmount = car?.vehicle?.price || car?.vehicle?.rentalPerDay || 0;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------------- PROGRESS STEPS ---------------- */
  const steps = [
    { label: "Your Details", complete: Boolean(form.name && form.phone) },
    { label: "Trip Info", complete: Boolean(form.pickup && form.destination) },
    { label: "Schedule", complete: Boolean(eventDate && form.hours && form.eventType) },
    {
      label: "Ready",
      complete: Boolean(
        form.name && form.phone && form.pickup && form.destination && eventDate && form.hours && form.eventType
      ),
    },
  ];

  const submitBooking = async () => {
    if (!form.name || !form.phone || !form.pickup || !form.destination || !eventDate || !form.hours || !form.eventType) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/luxury`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          luxuryCarId: car.id,
          pickup: form.pickup,
          destination: form.destination,
          eventDate: eventDate.toISOString(),
          hours: form.hours,
          eventType: form.eventType,
          requirements: form.requirements,
        }),
      });

      const resData = await res.json();

      if (resData.success) {
        done(resData.bookingId || resData.booking?.id);
        setForm({ name: "", phone: "", pickup: "", destination: "", hours: "", eventType: "", requirements: "" });
        setEventDate(undefined);
      } else {
        alert(resData.message || "Booking failed");
      }
    } catch (error) {
      console.log(error);
      alert("Unable to submit booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#252525] bg-gradient-to-b from-[#161310] to-[#141414] p-8 shadow-[0_0_60px_rgba(236,177,0,0.08)]">

      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#ecb100]/10 blur-3xl" />

      <Reveal>
        <div className="relative flex items-center gap-2">
          <Crown size={16} className="text-[#ecb100]" />
          <p className="text-sm uppercase tracking-[0.3em] text-[#ecb100]">Luxury Car Booking</p>
        </div>

        <h2 className="relative mt-3 text-3xl font-bold text-white">Book {car.name}</h2>
        <p className="relative mt-2 text-[#8a8a8a]">Premium chauffeur driven luxury experience</p>
      </Reveal>

      {totalAmount > 0 && (
        <Reveal delay={80}>
          <div className="relative mt-8 flex items-center justify-between rounded-2xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-5 py-4">
            <span className="text-sm text-white/70">Estimated cost</span>
            <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-xl font-semibold text-[#ecb100]">
              ₹{totalAmount}
            </span>
          </div>
        </Reveal>
      )}

      {/* ---------------- PREMIUM PROGRESS BAR ---------------- */}
      <Reveal delay={110} className="mt-8 block">
        <BookingProgress steps={steps} />
      </Reveal>

      <Reveal delay={150}>
        <div className="relative mt-8 grid gap-6 md:grid-cols-2">

          <FieldInput icon={<User size={18} />} placeholder="Full Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          <FieldInput icon={<Phone size={18} />} placeholder="Phone Number" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          <FieldInput icon={<MapPin size={18} />} placeholder="Pickup Location" value={form.pickup} onChange={(e) => updateField("pickup", e.target.value)} />
          <FieldInput icon={<MapPin size={18} />} placeholder="Destination / Venue" value={form.destination} onChange={(e) => updateField("destination", e.target.value)} />

          <div className="relative">
            <div className="absolute left-4 top-3.5 z-10 text-[#ecb100]"><CalendarDays size={18} /></div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full rounded-xl border border-[#252525] bg-black/40 py-3 pl-12 pr-4 text-left text-[#c7c7c7] transition hover:border-[#ecb100]">
                  {eventDate ? eventDate.toLocaleDateString() : "Select Event Date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-[#252525] bg-[#141414] p-0" align="start">
                <Calendar mode="single" selected={eventDate} onSelect={setEventDate} className="bg-[#141414] text-white" />
              </PopoverContent>
            </Popover>
          </div>

          <Select value={form.hours} onValueChange={(v) => updateField("hours", v)}>
            <SelectTrigger className="h-[50px] rounded-xl border-[#252525] bg-black/40 text-white">
              <SelectValue placeholder="Required Hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 Hours</SelectItem>
              <SelectItem value="8">8 Hours</SelectItem>
              <SelectItem value="12">12 Hours</SelectItem>
              <SelectItem value="24">Full Day (24 Hours)</SelectItem>
              <SelectItem value="multi">Multi-day (specify below)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={form.eventType} onValueChange={(v) => updateField("eventType", v)}>
            <SelectTrigger className="h-[50px] rounded-xl border-[#252525] bg-black/40 text-white md:col-span-2">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Wedding">Wedding</SelectItem>
              <SelectItem value="Corporate Event">Corporate Event</SelectItem>
              <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
              <SelectItem value="Photoshoot">Photoshoot</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

        </div>

        <textarea
          placeholder="Special Requirements"
          value={form.requirements}
          onChange={(e) => updateField("requirements", e.target.value)}
          className="relative mt-6 min-h-32 w-full rounded-xl border border-[#252525] bg-black/40 p-4 text-white placeholder:text-[#666] outline-none transition-colors focus:border-[#ecb100]"
        />
      </Reveal>

      <Reveal delay={190}>
        <Button
          disabled={loading}
          onClick={submitBooking}
          className="relative mt-8 w-full bg-[#ecb100] py-6 text-lg text-black transition-transform hover:bg-[#f6c94c] hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? "Processing..." : "Submit Luxury Booking Request"}
        </Button>
      </Reveal>

      <BookingSuccess
        open={success}
        onClose={reset}
        bookingId={bookingId}
        title="Request Received"
        message="Our team will contact you shortly to confirm availability and details. Payment can be arranged once everything is confirmed."
      />
    </section>
  );
}

function FieldInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-3.5 text-[#ecb100]">{icon}</div>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#252525] bg-black/40 py-3 pl-12 pr-4 text-white outline-none transition-colors placeholder:text-[#666] focus:border-[#ecb100]"
      />
    </div>
  );
}