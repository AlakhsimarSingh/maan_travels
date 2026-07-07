"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingDatePicker from "./BookingDatePicker";
import BookingSuccess from "@/components/common/BookingSuccess";
import BookingTimePicker, { formatTime12h } from "./BookingTimePicker";
import { API_URL } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";
import { useVehicles } from "@/src/hooks/useVehicles";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  MapPin,
  Navigation,
  User,
  Mail,
  Phone,
  MessageSquare,
  Car,
  ArrowRight,
  Check,
} from "lucide-react";

type Category = "Sedan" | "SUV" | "MPV";

export default function BookingForm() {
  const [rideType, setRideType] = useState<"taxi" | "local">("taxi");
  const [tripMode, setTripMode] = useState<"oneway" | "round">("oneway");

  const { vehicles } = useVehicles("taxi");
  const [travelDate, setTravelDate] = useState<Date>();
  const [travelTime, setTravelTime] = useState<string>("");

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

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { success, bookingId, done, reset } = useBookingStatus();

  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === form.vehicle);
  }, [form.vehicle, vehicles]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const grouped = useMemo(
    () => ({
      Sedan: vehicles.filter((v) => v.category?.toLowerCase().includes("sedan")),
      SUV: vehicles.filter((v) => v.category?.toLowerCase().includes("suv")),
      MPV: vehicles.filter((v) => v.category?.toLowerCase().includes("mpv")),
    }),
    [vehicles]
  );

  // Lightweight progress signal — purely visual, drives the summary rail
  const progress = useMemo(() => {
    const checks = [
      !!form.pickup,
      rideType === "local" || !!form.drop,
      !!travelDate,
      !!travelTime,
      !!form.vehicle,
      !!form.name && !!form.phone,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form.pickup, form.drop, travelDate, form.vehicle, form.name, form.phone, rideType]);

  const missingRequired = () => {
    const missing: string[] = [];
    if (!form.name) missing.push("Name");
    if (!form.phone) missing.push("Phone");
    if (!form.pickup) missing.push("Pickup location");
    if (rideType === "taxi" && !form.drop) missing.push("Drop location");
    if (!form.vehicle) missing.push("Vehicle");
    if (!travelDate) missing.push("Travel date");
    if (!travelTime) missing.push("Pickup time");
    return missing;
  };

  const [formError, setFormError] = useState<string | null>(null);

  // Drives entrance transitions without needing custom @keyframes anywhere
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const submitBooking = async () => {
    const missing = missingRequired();
    if (missing.length > 0) {
      setTouched({
        name: true,
        phone: true,
        pickup: true,
        drop: true,
        vehicle: true,
      });
      setFormError(`Still need: ${missing.join(", ")}`);
      return;
    }

    setFormError(null);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          pickup: form.pickup,
          drop: rideType === "taxi" ? form.drop : undefined,
          vehicleId: form.vehicle,
          rideMode: rideType === "local" ? "local" : tripMode,
          requirements: form.requirements,
          travelDate: travelDate?.toISOString() || null,
          pickupTime: travelTime || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        done(data.booking.id);
        setForm({
          name: "",
          email: "",
          phone: "",
          pickup: "",
          drop: "",
          vehicle: "",
          persons: "",
          requirements: "",
        });
        setTravelDate(undefined);
        setTravelTime("");
        setTouched({});
      } else {
        setFormError(data.message || "Booking couldn't go through. Please check your details.");
      }
    } catch (e) {
      console.log(e);
      setFormError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openCategory = (cat: Category) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveCategory(cat);
  };

  const closeCategory = () => {
    hoverTimeout.current = setTimeout(() => {
      setActiveCategory(null);
    }, 140);
  };

  const fieldError = (field: string, value: string) => touched[field] && !value;

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* MAIN FORM CARD */}
        <div
          className={`
            rounded-3xl border border-[#2a2a2a]
            bg-gradient-to-b from-[#141414] to-[#0f0f0f]
            p-6 shadow-2xl sm:p-8
            transition-all duration-700 ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
          `}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#ecb100]">
                Maan Travels
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-wide text-white">
                Ride Details
              </h2>
            </div>

            <div className="relative hidden h-14 w-14 items-center justify-center sm:flex">
              <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                <circle
                  cx="28" cy="28" r="24"
                  fill="none" stroke="#2a2a2a" strokeWidth="4"
                />
                <circle
                  cx="28" cy="28" r="24"
                  fill="none" stroke="#ecb100" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-[11px] font-medium text-white/70">
                {progress}%
              </span>
            </div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <Select value={rideType} onValueChange={(v) => setRideType(v as any)}>
              <SelectTrigger className="h-12 rounded-xl border-[#2a2a2a] bg-[#111] text-white transition focus:ring-2 focus:ring-[#ecb100]/30">
                <SelectValue placeholder="Ride Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taxi">Taxi</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                rideType === "taxi" ? "max-h-14 opacity-100" : "max-h-0 opacity-0 sm:max-h-14"
              }`}
            >
              {rideType === "taxi" && (
                <Select value={tripMode} onValueChange={(v) => setTripMode(v as any)}>
                  <SelectTrigger className="h-12 rounded-xl border-[#2a2a2a] bg-[#111] text-white transition focus:ring-2 focus:ring-[#ecb100]/30">
                    <SelectValue placeholder="Trip Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oneway">One Way</SelectItem>
                    <SelectItem value="round">Round Trip</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="relative mb-6 grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <MapPin
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]"
              />
              <Input
                placeholder="Pickup location"
                value={form.pickup}
                onChange={(e) => updateField("pickup", e.target.value)}
                onBlur={() => markTouched("pickup")}
                className={`h-12 rounded-xl border bg-[#111] pl-11 text-white transition-colors ${
                  fieldError("pickup", form.pickup)
                    ? "border-red-500/60"
                    : "border-[#2a2a2a] focus:border-[#ecb100]/60"
                }`}
              />
            </div>

            {rideType === "taxi" && (
              <div className="relative transition-opacity duration-300 ease-out">
                <Navigation
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]"
                />
                <Input
                  placeholder="Drop location"
                  value={form.drop}
                  onChange={(e) => updateField("drop", e.target.value)}
                  onBlur={() => markTouched("drop")}
                  className={`h-12 rounded-xl border bg-[#111] pl-11 text-white transition-colors ${
                    fieldError("drop", form.drop)
                      ? "border-red-500/60"
                      : "border-[#2a2a2a] focus:border-[#ecb100]/60"
                  }`}
                />
              </div>
            )}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <BookingDatePicker value={travelDate} onChange={setTravelDate} />
            <BookingTimePicker placeholder="Pickup Time" value={travelTime} onChange={setTravelTime} />
          </div>

          <div className="mb-2 grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]" />
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                onBlur={() => markTouched("name")}
                className={`h-12 rounded-xl border bg-[#111] pl-11 text-white transition-colors ${
                  fieldError("name", form.name)
                    ? "border-red-500/60"
                    : "border-[#2a2a2a] focus:border-[#ecb100]/60"
                }`}
              />
            </div>

            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]" />
              <Input
                placeholder="Email (optional)"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="h-12 rounded-xl border border-[#2a2a2a] bg-[#111] pl-11 text-white transition-colors focus:border-[#ecb100]/60"
              />
            </div>

            <div className="relative">
              <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]" />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                onBlur={() => markTouched("phone")}
                className={`h-12 rounded-xl border bg-[#111] pl-11 text-white transition-colors ${
                  fieldError("phone", form.phone)
                    ? "border-red-500/60"
                    : "border-[#2a2a2a] focus:border-[#ecb100]/60"
                }`}
              />
            </div>
          </div>

          {rideType === "taxi" && (
            <div className="mt-8">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-white/70">
                <Car size={15} className="text-[#ecb100]" />
                Choose your vehicle
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {(Object.keys(grouped) as Category[]).map((cat, i) => {
                  const hasSelection = form.vehicle && grouped[cat].some((v) => v.id === form.vehicle);
                  return (
                    <div key={cat} className="relative">
                      <div
                        onMouseEnter={() => openCategory(cat)}
                        onMouseLeave={closeCategory}
                        style={{ transitionDelay: `${i * 60}ms` }}
                        className={`
                          cursor-pointer rounded-2xl border p-4
                          transition-all duration-300
                          hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(236,177,0,0.25)]
                          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                          ${
                            hasSelection
                              ? "border-[#ecb100]/50 bg-[#ecb100]/5"
                              : "border-[#2a2a2a] bg-[#111] hover:border-[#ecb100]/40"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white">{cat}</p>
                          {hasSelection && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ecb100] text-black">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>

                        {hasSelection && (
                          <p className="mt-2 truncate text-xs text-[#ecb100]/80">
                            {grouped[cat].find((v) => v.id === form.vehicle)?.name}
                          </p>
                        )}
                        {!hasSelection && grouped[cat].length === 0 && (
                          <p className="mt-2 text-xs text-white/30">No vehicles</p>
                        )}
                        {!hasSelection && grouped[cat].length > 0 && (
                          <p className="mt-2 text-xs text-white/40">{grouped[cat].length} available</p>
                        )}
                      </div>

                      {activeCategory === cat && grouped[cat].length > 0 && (
                        <div
                          onMouseEnter={() => openCategory(cat)}
                          onMouseLeave={closeCategory}
                          className="
                            absolute left-0 top-full z-50 mt-2 w-full
                            origin-top transition-all duration-150 ease-out
                            overflow-hidden rounded-2xl border border-[#2a2a2a]
                            bg-black/95 shadow-xl backdrop-blur-lg
                          "
                        >
                          {grouped[cat].map((v) => (
                            <div
                              key={v.id}
                              onClick={() => {
                                updateField("vehicle", v.id);
                                setActiveCategory(null);
                              }}
                              className={`cursor-pointer px-4 py-3 text-sm transition ${
                                form.vehicle === v.id
                                  ? "bg-[#ecb100]/10 text-[#ecb100]"
                                  : "text-white hover:bg-white/5"
                              }`}
                            >
                              {v.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="relative mt-8">
            <MessageSquare size={16} className="pointer-events-none absolute left-4 top-4 text-[#ecb100]" />
            <textarea
              placeholder="Special requirements (optional)"
              value={form.requirements}
              onChange={(e) => updateField("requirements", e.target.value)}
              className="min-h-28 w-full rounded-2xl border border-[#2a2a2a] bg-[#111] p-4 pl-11 text-white transition-colors focus:border-[#ecb100]/60 focus:outline-none"
            />
          </div>

          {formError && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400 transition-opacity duration-300">
              {formError}
            </div>
          )}

          <Button
            disabled={loading}
            onClick={submitBooking}
            className="
              group mt-8 h-14 w-full rounded-2xl
              bg-[#ecb100] text-base font-semibold text-black
              transition-all duration-200
              hover:bg-[#f6c94c] hover:shadow-[0_8px_24px_-8px_rgba(236,177,0,0.4)]
              active:scale-[0.99]
              disabled:opacity-60
            "
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? "Processing..." : "Submit booking"}
              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              )}
            </span>
          </Button>
        </div>

        <aside className="hidden lg:block">
          <div
            className={`
              sticky top-24
              rounded-3xl border border-[#2a2a2a]
              bg-gradient-to-b from-[#141414] to-[#0f0f0f]
              p-6 shadow-2xl
              transition-all duration-700 ease-out delay-100
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
            `}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#ecb100]">
              Trip summary
            </p>

            <div className="mt-5 space-y-4 text-sm">
              <SummaryRow
                icon={<MapPin size={15} />}
                label="From"
                value={form.pickup}
              />
              {rideType === "taxi" && (
                <SummaryRow
                  icon={<Navigation size={15} />}
                  label="To"
                  value={form.drop}
                />
              )}
              <SummaryRow
                label="Travel date"
                value={travelDate ? travelDate.toDateString() : ""}
              />
              <SummaryRow
                icon={<Car size={15} />}
                label="Vehicle"
                value={selectedVehicle?.name || ""}
              />
              {selectedVehicle && (
                <div className="rounded-xl border border-[#2a2a2a] bg-black/30 p-3 text-xs text-white/60">
                  <p>{selectedVehicle.passengerCapacity ?? "-"} passengers · {selectedVehicle.suitcaseCapacity ?? "-"} bags</p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-dashed border-[#2a2a2a] pt-5">
              <p className="text-xs text-white/40">
                A team member will confirm pricing and availability shortly after you submit.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <BookingSuccess open={success} onClose={reset} bookingId={bookingId} />
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-2 text-white/40">
        {icon}
        {label}
      </span>
      <span
        className={`max-w-[60%] text-right transition-colors ${
          value ? "text-white" : "text-white/25"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}