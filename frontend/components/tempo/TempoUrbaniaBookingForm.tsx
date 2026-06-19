"use client";

import {
  CalendarDays,
  MapPin,
  Phone,
  User,
  Users,
  Route,
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
import { createTempoBooking } from "@/src/services/bookingService";

export default function TempoUrbaniaBookingForm({
  vehicle,
  onClose,
}: {
  vehicle: any;
  onClose: () => void;
}) {
  const [travelDate, setTravelDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | undefined>();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    destination: "",
    passengers: "",
    tripType: "Round Trip",
    requirements: "",
  });

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      if (!travelDate) {
        alert("Please select travel date");
        return;
      }

      setLoading(true);

      const res: any = await createTempoBooking({
        name: form.name,
        phone: form.phone,
        pickup: form.pickup,
        destination: form.destination,
        vehicleId: vehicle.id, // ✅ FIXED: always use selected vehicle
        passengers: form.passengers,
        tripType: form.tripType,
        requirements: form.requirements,
        travelDate: travelDate.toISOString(),
      });

      setBookingId(res?.booking?.id);
      setSuccess(true);

      // reset form
      setForm({
        name: "",
        phone: "",
        pickup: "",
        destination: "",
        passengers: "",
        tripType: "Round Trip",
        requirements: "",
      });

      setTravelDate(undefined);
    } catch (err) {
      console.error("Tempo booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 rounded-3xl border border-[#252525] bg-[#141414] p-8 shadow-[0_0_50px_rgba(236,177,0,0.08)]">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="uppercase tracking-[0.3em] text-sm text-[#ecb100]">
            Tempo Traveller Booking
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Book {vehicle.name}
          </h2>

          <p className="mt-2 text-[#8a8a8a]">
            Premium AC Traveller • Chauffeur Included
          </p>
        </div>

        <button onClick={onClose} className="text-[#8a8a8a] hover:text-white">
          ✕
        </button>
      </div>

      {/* GRID */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">

        <Input
          icon={<User size={18} className="text-[#ecb100]" />}
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <Input
          icon={<Phone size={18} className="text-[#ecb100]" />}
          placeholder="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <Input
          icon={<MapPin size={18} className="text-[#ecb100]" />}
          placeholder="Pickup Location"
          name="pickup"
          value={form.pickup}
          onChange={handleChange}
        />

        <Input
          icon={<Route size={18} className="text-[#ecb100]" />}
          placeholder="Destination"
          name="destination"
          value={form.destination}
          onChange={handleChange}
        />

        {/* DATE */}
        <div className="relative">
          <div className="absolute left-4 top-3.5 text-[#ecb100]">
            <CalendarDays size={18} />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full rounded-xl border border-[#252525] bg-black/40 py-3 pl-12 pr-4 text-left text-white">
                {travelDate ? travelDate.toDateString() : "Travel Date"}
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0 bg-[#141414] border-[#252525]">
              <Calendar
                mode="single"
                selected={travelDate}
                onSelect={setTravelDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Input
          icon={<Users size={18} className="text-[#ecb100]" />}
          placeholder="Passengers"
          name="passengers"
          value={form.passengers}
          onChange={handleChange}
        />

      </div>

      {/* TRIP TYPE */}
      <div className="mt-8">
        <label className="text-sm text-[#8a8a8a]">Trip Type</label>

        <select
          name="tripType"
          value={form.tripType}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-[#252525] bg-black/40 px-4 py-3 text-white"
        >
          <option>Round Trip</option>
          <option>One Way</option>
          <option>Multi Day Tour</option>
        </select>
      </div>

      {/* REQUIREMENTS */}
      <textarea
        name="requirements"
        value={form.requirements}
        onChange={handleChange}
        placeholder="Special Requirements"
        className="mt-6 min-h-32 w-full rounded-xl border border-[#252525] bg-black/40 p-4 text-white"
      />

      {/* BUTTON */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-8 w-full bg-[#ecb100] py-6 text-lg text-black"
      >
        {loading ? "Submitting..." : "Submit Traveller Booking Request"}
      </Button>

      {/* SUCCESS */}
      <BookingSuccess
        open={success}
        onClose={() => setSuccess(false)}
        bookingId={bookingId}
      />
    </section>
  );
}

/* ---------------- INPUT ---------------- */
function Input({ icon, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-3.5 text-[#ecb100]">
        {icon}
      </div>

      <input
        {...props}
        className="w-full rounded-xl border border-[#252525] bg-black/40 py-3 pl-12 pr-4 text-white"
      />
    </div>
  );
}