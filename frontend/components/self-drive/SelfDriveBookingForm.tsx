"use client";

import { useState } from "react";

import {
  CalendarDays,
  Car,
  Phone,
  User,
  Fuel,
  Settings,
} from "lucide-react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import BookingSuccess from "@/components/common/BookingSuccess";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

/* ---------------- FIXED TYPE (MATCH DB) ---------------- */
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
};

export default function SelfDriveBookingForm({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle;
  onClose: () => void;
}) {
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    license: "",
    requirements: "",
  });

  /* ---------------- SUCCESS STATE ---------------- */
  const [successOpen, setSuccessOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string | undefined>();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/selfdrive-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          name: form.name,
          phone: form.phone,
          license: form.license,
          requirements: form.requirements,

          pickupDate: pickupDate?.toISOString(),
          returnDate: returnDate?.toISOString(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Booking failed");
        return;
      }

      // ✅ STORE BOOKING ID
      setBookingId(data.booking.id);

      // ✅ OPEN SUCCESS MODAL
      setSuccessOpen(true);
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  return (
    <section className="mt-16 rounded-3xl border border-[#252525] bg-[#141414] p-8">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="uppercase tracking-[0.3em] text-sm text-[#ecb100]">
            Self Drive Booking
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Book {vehicle.name}
          </h2>

          <p className="mt-2 text-[#8a8a8a]">
            ₹{vehicle.price}/day • {vehicle.fuelType} • {vehicle.transmission}
          </p>
        </div>

        <button onClick={onClose} className="text-[#8a8a8a] text-xl">
          ✕
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Summary icon={<Car size={18} />} label="Vehicle" value={vehicle.name} />
        <Summary icon={<Fuel size={18} />} label="Fuel" value={vehicle.fuelType || "-"} />
        <Summary icon={<Settings size={18} />} label="Gear" value={vehicle.transmission || "-"} />
      </div>

      {/* FORM */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">

        <Input
          icon={<User size={18} />}
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
        />

        <Input
          icon={<Phone size={18} />}
          placeholder="Phone Number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(v) => handleChange("phone", v)}
        />

        <DatePicker
          date={pickupDate}
          setDate={setPickupDate}
          placeholder="Pickup Date"
        />

        <DatePicker
          date={returnDate}
          setDate={setReturnDate}
          placeholder="Return Date"
        />

        <Input
          icon={<Car size={18} />}
          placeholder="Driving License Number"
          name="license"
          value={form.license}
          onChange={(v) => handleChange("license", v)}
        />

      </div>

      <textarea
        placeholder="Additional requirements or message"
        className="mt-6 min-h-32 w-full rounded-xl border border-[#252525] bg-black/40 p-4 text-white"
        value={form.requirements}
        onChange={(e) => handleChange("requirements", e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        className="mt-8 w-full bg-[#ecb100] text-black"
      >
        Confirm Booking Request
      </Button>

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
  name,
  type = "text",
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-3.5 text-[#ecb100]">
        {icon}
      </div>

      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#252525] bg-black/40 py-3 pl-12 pr-4 text-white"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ---------------- DATE PICKER ---------------- */
function DatePicker({
  date,
  setDate,
  placeholder,
}: {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative flex w-full items-center rounded-xl border border-[#252525] bg-black/40 py-3 pl-12 pr-4 text-left text-white",
            !date && "text-[#666]"
          )}
        >
          <CalendarDays size={18} className="absolute left-4 text-[#ecb100]" />
          {date ? format(date, "PPP") : placeholder}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto bg-[#141414] p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- SUMMARY ---------------- */
function Summary({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#252525] bg-black/30 p-4">
      <div className="flex items-center gap-2 text-[#ecb100] text-sm">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-white font-medium">{value}</p>
    </div>
  );
}