"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingDatePicker from "./BookingDatePicker";
import BookingSuccess from "@/components/common/BookingSuccess";

import { API_URL } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Vehicle = {
  id: string;
  name: string;
  category: string;
  passengerCapacity?: number | null;
  suitcaseCapacity?: number | null;
};

type Category = "Sedan" | "SUV" | "MPV";

export default function BookingForm() {
  const [rideType, setRideType] = useState<"taxi" | "local">("taxi");
  const [tripMode, setTripMode] = useState<"oneway" | "round">("oneway");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [travelDate, setTravelDate] = useState<Date>();

  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    drop: "",
    vehicle: "",
    persons: "",
    requirements: "",
  });

  const { success, bookingId, done, reset } = useBookingStatus();

  const selectedVehicle = useMemo(() => {
    return vehicles.find(v => v.id === form.vehicle);
  }, [form.vehicle, vehicles]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/vehicles`);
        const data = await res.json();
        setVehicles(data.vehicles || []);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const grouped = useMemo(() => ({
    Sedan: vehicles.filter(v => v.category?.toLowerCase().includes("sedan")),
    SUV: vehicles.filter(v => v.category?.toLowerCase().includes("suv")),
    MPV: vehicles.filter(v => v.category?.toLowerCase().includes("mpv")),
  }), [vehicles]);

  const submitBooking = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rideMode: tripMode.toUpperCase(),
          travelDate: travelDate?.toISOString() || null,
        }),
      });

      const data = await res.json();

      if (data.success) done(data.booking.id);
      else alert("Failed");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // smoother hover control (no flicker, premium feel)
  const openCategory = (cat: Category) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveCategory(cat);
  };

  const closeCategory = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveCategory(null);
    }, 140);
  };

  return (
    <div className="mx-auto max-w-5xl rounded-3xl border border-[#2a2a2a] bg-gradient-to-b from-[#141414] to-[#0f0f0f] p-8 shadow-2xl">

      {/* HEADER */}
      <h2 className="mb-8 text-3xl font-semibold tracking-wide text-white">
        Ride Details
      </h2>

      {/* TOP SELECTORS */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">

        <Select value={rideType} onValueChange={(v) => setRideType(v as any)}>
          <SelectTrigger className="h-12 bg-[#111] border-[#2a2a2a] text-white rounded-xl focus:ring-2 focus:ring-yellow-500/30 transition">
            <SelectValue placeholder="Ride Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="taxi">Taxi</SelectItem>
            <SelectItem value="local">Local</SelectItem>
          </SelectContent>
        </Select>

        {rideType === "taxi" && (
          <Select value={tripMode} onValueChange={(v) => setTripMode(v as any)}>
            <SelectTrigger className="h-12 bg-[#111] border-[#2a2a2a] text-white rounded-xl focus:ring-2 focus:ring-yellow-500/30 transition">
              <SelectValue placeholder="Trip Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oneway">One Way</SelectItem>
              <SelectItem value="round">Round Trip</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* INPUT GRID */}
      <div className="grid gap-6 md:grid-cols-2">

        {["name", "email", "phone"].map((field) => (
          <Input
            key={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={(form as any)[field]}
            onChange={e => updateField(field, e.target.value)}
            className="h-12 bg-[#111] border-[#2a2a2a] text-white rounded-xl focus:ring-2 focus:ring-yellow-500/30 transition"
          />
        ))}

        <BookingDatePicker value={travelDate} onChange={setTravelDate} />

        <Input
          placeholder="Pickup"
          value={form.pickup}
          onChange={e => updateField("pickup", e.target.value)}
          className="h-12 bg-[#111] border-[#2a2a2a] text-white rounded-xl"
        />

        {rideType === "taxi" && (
          <Input
            placeholder="Drop"
            value={form.drop}
            onChange={e => updateField("drop", e.target.value)}
            className="h-12 bg-[#111] border-[#2a2a2a] text-white rounded-xl"
          />
        )}
      </div>

      {/* VEHICLE CATEGORY SECTION */}
      {rideType === "taxi" && (
        <div className="mt-10 grid grid-cols-3 gap-5">

          {(Object.keys(grouped) as Category[]).map(cat => (
            <div key={cat} className="relative">

              {/* CATEGORY CARD */}
              <div
                onMouseEnter={() => openCategory(cat)}
                onMouseLeave={closeCategory}
                className={`rounded-2xl border border-[#2a2a2a] bg-[#111] p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-yellow-500/40`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">{cat}</p>

                  {form.vehicle &&
                    grouped[cat].some(v => v.id === form.vehicle) && (
                      <span className="text-xs text-yellow-400">Selected</span>
                    )}
                </div>

                {form.vehicle &&
                  grouped[cat].find(v => v.id === form.vehicle) && (
                    <p className="text-xs text-gray-400 mt-2 truncate">
                      {
                        grouped[cat].find(v => v.id === form.vehicle)?.name
                      }
                    </p>
                  )}
              </div>

              {/* DROPDOWN */}
              {activeCategory === cat && (
                <div
                  onMouseEnter={() => openCategory(cat)}
                  onMouseLeave={closeCategory}
                  className="absolute left-0 top-full mt-2 w-full rounded-2xl border border-[#2a2a2a] bg-black/95 backdrop-blur-lg shadow-xl z-50 overflow-hidden animate-in fade-in duration-150"
                >
                  {grouped[cat].map(v => (
                    <div
                      key={v.id}
                      onClick={() => {
                        updateField("vehicle", v.id);
                        setActiveCategory(null);
                      }}
                      className={`px-4 py-3 text-sm cursor-pointer transition ${
                        form.vehicle === v.id
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "text-white hover:bg-white/5"
                      }`}
                    >
                      {v.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SELECTED VEHICLE INFO */}
      {selectedVehicle && (
        <div className="mt-6 rounded-2xl border border-[#2a2a2a] bg-black/40 p-4 text-sm text-white backdrop-blur">
          <p>Capacity: {selectedVehicle.passengerCapacity ?? "-"} passengers</p>
          <p>Storage: {selectedVehicle.suitcaseCapacity ?? "-"} bags</p>
          <p className="text-yellow-400 mt-1 font-medium">
            Selected: {selectedVehicle.name}
          </p>
        </div>
      )}

      {/* REQUIREMENTS */}
      <textarea
        placeholder="Special Requirements"
        value={form.requirements}
        onChange={e => updateField("requirements", e.target.value)}
        className="mt-6 min-h-32 w-full rounded-2xl border border-[#2a2a2a] bg-[#111] p-4 text-white focus:ring-2 focus:ring-yellow-500/30 transition"
      />

      {/* SUBMIT */}
      <Button
        disabled={loading}
        onClick={submitBooking}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold hover:scale-[1.01] transition"
      >
        {loading ? "Processing..." : "Submit Booking"}
      </Button>

      <BookingSuccess
        open={success}
        onClose={reset}
        bookingId={bookingId}
      />
    </div>
  );
}