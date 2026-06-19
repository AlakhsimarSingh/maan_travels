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
} from "lucide-react";

import { useState } from "react";

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

export default function WeddingBookingForm({
  car,
}: {
  car: any;
}) {

  const [date, setDate] = useState<Date>();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    venue: "",
    guests: "",
    carsRequired: "",
    decoration: "",
    requirements: ""
  });

  const {
    loading,
    success,
    bookingId,
    start,
    done,
    reset
  } = useBookingStatus();

  const updateField = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitBooking = async () => {
    try {
      start();

      // 🔥 IMPORTANT DEBUG LOGS
      console.log("🚀 RAW CAR OBJECT:", car);
      console.log("🆔 CAR ID:", car.id);
      console.log("📦 FORM STATE:", form);
      console.log("📅 DATE:", date);

      const payload = {
        name: form.name,
        phone: form.phone,

        // 🔥 THIS IS CRITICAL DEBUG POINT
        luxuryCarId: String(car.id),

        pickup: form.pickup,
        venue: form.venue,

        weddingDate: date ? date.toISOString() : "",

        guests: Number(form.guests),
        carsRequired: Number(form.carsRequired),

        decoration: form.decoration,
        requirements: form.requirements
      };

      console.log("📤 FINAL PAYLOAD SENT TO API:", payload);

      const res = await createWeddingBooking(payload);

      console.log("📥 API RESPONSE:", res);

      done((res as any)?.booking?.id);

      setForm({
        name: "",
        phone: "",
        pickup: "",
        venue: "",
        guests: "",
        carsRequired: "",
        decoration: "",
        requirements: ""
      });

      setDate(undefined);

    } catch (error: any) {
      console.log("❌ BOOKING ERROR FULL:", error);

      // 🔥 extra backend error visibility
      if (error?.response) {
        console.log("❌ BACKEND RESPONSE:", error.response.data);
      }

      reset();
    }
  };

  return (
    <section
      className="
      rounded-3xl
      border
      border-[#252525]
      bg-[#141414]
      p-8
      shadow-[0_0_50px_rgba(236,177,0,0.08)]
      "
    >

      <div>
        <p className="uppercase tracking-[0.3em] text-sm text-[#ecb100]">
          Wedding Car Booking
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white">
          Book {car.name}
        </h2>

        <p className="mt-2 text-[#8a8a8a]">
          Royal wedding arrival experience with premium chauffeur service.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        <Input icon={<User size={18} />} placeholder="Full Name"
          value={form.name}
          onChange={(e: any) => updateField("name", e.target.value)}
        />

        <Input icon={<Phone size={18} />} placeholder="Phone Number"
          value={form.phone}
          onChange={(e: any) => updateField("phone", e.target.value)}
        />

        <Input icon={<MapPin size={18} />} placeholder="Pickup Location"
          value={form.pickup}
          onChange={(e: any) => updateField("pickup", e.target.value)}
        />

        <Input icon={<Building2 size={18} />} placeholder="Wedding Venue"
          value={form.venue}
          onChange={(e: any) => updateField("venue", e.target.value)}
        />

        <div className="relative">
          <div className="absolute left-4 top-3.5 text-[#ecb100]">
            <CalendarDays size={18} />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full rounded-xl border border-[#252525] bg-black/40 py-3 pl-12 text-left text-white">
                {date ? date.toDateString() : "Wedding Date"}
              </button>
            </PopoverTrigger>

            <PopoverContent className="bg-[#141414] border-[#252525] p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Input icon={<Users size={18} />} placeholder="Number of Guests"
          value={form.guests}
          onChange={(e: any) => updateField("guests", e.target.value)}
        />

        <Input icon={<Car size={18} />} placeholder="Number of Cars Required"
          value={form.carsRequired}
          onChange={(e: any) => updateField("carsRequired", e.target.value)}
        />

        <Input icon={<Sparkles size={18} />} placeholder="Decoration Requirements"
          value={form.decoration}
          onChange={(e: any) => updateField("decoration", e.target.value)}
        />

      </div>

      <textarea
        placeholder="Special Requirements (Entry decoration, flower setup, timing etc.)"
        value={form.requirements}
        onChange={(e: any) => updateField("requirements", e.target.value)}
        className="
        mt-6
        min-h-32
        w-full
        rounded-xl
        border
        border-[#252525]
        bg-black/40
        p-4
        text-white
        placeholder:text-[#666]
        outline-none
        focus:border-[#ecb100]
        "
      />

      <Button
        disabled={loading}
        onClick={submitBooking}
        className="mt-8 w-full bg-[#ecb100] py-6 text-lg text-black hover:bg-[#f6c94c]"
      >
        {loading ? "Processing..." : "Submit Wedding Booking Request"}
      </Button>

      <BookingSuccess
        open={success}
        onClose={reset}
        bookingId={bookingId}
      />

    </section>
  );
}

function Input({
  icon,
  placeholder,
  value,
  onChange
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-3.5 text-[#ecb100]">
        {icon}
      </div>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
        w-full
        rounded-xl
        border
        border-[#252525]
        bg-black/40
        py-3
        pl-12
        pr-4
        text-white
        placeholder:text-[#666]
        outline-none
        focus:border-[#ecb100]
        "
      />
    </div>
  );
}