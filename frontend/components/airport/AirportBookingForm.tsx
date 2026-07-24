"use client";

import { useEffect, useMemo, useState } from "react";

import { CalendarDays, Clock, MapPin, MapPinned, Users, Luggage, ArrowRightLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import BookingSuccess from "../common/BookingSuccess";
import PaymentMethodPicker, { PaymentType } from "../booking/PaymentMethodPicker";

import { API_URL } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";
import { Airport, AirportVehicle, AirportCity } from "@/src/lib/fetchAirportTransferData";

type Category = "Sedan" | "SUV" | "MPV";
type Direction = "TO_AIRPORT" | "FROM_AIRPORT";

type CityPriceCell = {
  cityId: string;
  vehicleId: string;
  direction: Direction;
  price: number;
};

export default function AirportBookingForm({
  airport,
  vehicles,
  cities,
  onStepChange,
}: {
  airport: Airport | null;
  vehicles: AirportVehicle[];
  cities: AirportCity[];
  onStepChange?: (step: number) => void;
}) {
  const [travelDate, setTravelDate] = useState<Date>();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const [direction, setDirection] = useState<Direction>("TO_AIRPORT");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [cityPricing, setCityPricing] = useState<CityPriceCell[]>([]);

  const [form, setForm] = useState({
    pickup: "",
    terminal: "",
    time: "",
    passengers: "",
    name: "",
    phone: "",
    suitcases: "",
    handbags: "",
  });

  const [paymentType, setPaymentType] = useState<PaymentType>("later");
  const [partialAmount, setPartialAmount] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<{ total: number; paid: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const { success, bookingId, done, reset } = useBookingStatus();

  // Pricing is per airport — clear the vehicle choice if the airport changes
  useEffect(() => {
    setSelectedVehicleId("");
  }, [airport?.id]);

  // Switching direction, or switching airport, can invalidate the chosen
  // city (a city might only support one direction) — reset it rather than
  // silently keeping a city that no longer applies.
  useEffect(() => {
    setSelectedCityId("");
  }, [direction, airport?.id]);

  // Fetch this airport's full city/vehicle/direction pricing grid whenever
  // the airport changes. Filtered client-side as the user picks city/direction.
  useEffect(() => {
    if (!airport?.id) {
      setCityPricing([]);
      return;
    }
    let cancelled = false;
    fetch(`${API_URL}/api/airport-cities/pricing/${airport.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCityPricing(data.pricing || []);
      })
      .catch(() => {
        if (!cancelled) setCityPricing([]);
      });
    return () => {
      cancelled = true;
    };
  }, [airport?.id]);

  // Report which internal step we're on, purely derived from existing
  // state. 0 = picking city/vehicle, 1 = filling trip details, 2 = payment/submit.
  useEffect(() => {
    if (!onStepChange) return;

    const tripDetailsComplete =
      !!form.pickup &&
      !!travelDate &&
      !!form.time &&
      !!form.passengers &&
      !!form.name &&
      !!form.phone &&
      !!form.suitcases &&
      !!form.handbags;

    const step =
      !selectedCityId || !selectedVehicleId ? 0 : !tripDetailsComplete ? 1 : 2;
    onStepChange(step);
  }, [
    selectedCityId,
    selectedVehicleId,
    form.pickup,
    travelDate,
    form.time,
    form.passengers,
    form.name,
    form.phone,
    form.suitcases,
    form.handbags,
    onStepChange,
  ]);

  const availableCities = useMemo(
    () => cities.filter((c) => (direction === "TO_AIRPORT" ? c.canPickup : c.canDrop)),
    [cities, direction]
  );

  const grouped = useMemo(() => ({
    Sedan: vehicles.filter(v => v.category?.toLowerCase().includes("sedan")),
    SUV: vehicles.filter(v => v.category?.toLowerCase().includes("suv")),
    MPV: vehicles.filter(v => v.category?.toLowerCase().includes("mpv")),
  }), [vehicles]);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  // City + direction pricing takes priority; falls back to the flat
  // per-airport pricing for airports that haven't been migrated to
  // city-based pricing yet.
  const priceFor = (vehicleId: string) => {
    if (!selectedCityId) return 0;
    const match = cityPricing.find(
      (p) => p.cityId === selectedCityId && p.vehicleId === vehicleId && p.direction === direction
    );
    return match?.price ?? 0;
  };

  const totalAmount = selectedVehicleId ? priceFor(selectedVehicleId) : 0;

  const suitcaseCapacity = selectedVehicle?.suitcaseCapacity ?? null;
  const passengerCapacity = selectedVehicle?.passengerCapacity ?? null;

  const suitcasesOverCapacity = suitcaseCapacity != null && Number(form.suitcases || 0) > suitcaseCapacity;
  const passengersOverCapacity = passengerCapacity != null && Number(form.passengers || 0) > passengerCapacity;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCategory = (cat: Category) => {
    setActiveCategory(activeCategory === cat ? null : cat);
  };

  const handleSubmit = async () => {
    if (!airport) {
      alert("Please select an airport above first");
      return;
    }

    if (!selectedCityId) {
      alert("Please select your city");
      return;
    }

    if (
      !form.pickup || !travelDate || !form.time || !selectedVehicleId ||
      !form.passengers || !form.name || !form.phone ||
      !form.suitcases || !form.handbags
    ) {
      alert("Please fill all required fields");
      return;
    }

    if ((paymentType === "full" || paymentType === "partial") && !screenshot) {
      alert("Please upload a screenshot of your payment");
      return;
    }

    if (paymentType === "partial" && (!partialAmount || Number(partialAmount) <= 0)) {
      alert("Please enter how much you're paying now");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name);
      data.append("phone", form.phone);
      data.append("pickup", form.pickup);
      data.append("airport", airport.name);
      data.append("airportId", airport.id);
      data.append("terminal", form.terminal);
      data.append("travelDate", travelDate.toISOString());
      data.append("pickupTime", form.time);
      data.append("vehicleId", selectedVehicleId);
      data.append("passengers", form.passengers);
      data.append("suitcases", form.suitcases);
      data.append("handbags", form.handbags);
      data.append("cityId", selectedCityId);
      data.append("direction", direction);
      data.append("paymentType", paymentType);
      data.append(
        "amountPaid",
        paymentType === "full" ? String(totalAmount) : paymentType === "partial" ? partialAmount : "0"
      );
      if (screenshot) data.append("paymentScreenshot", screenshot);

      const res = await fetch(`${API_URL}/api/airport-bookings`, {
        method: "POST",
        body: data,
      });

      const resData = await res.json();

      if (resData.success) {
        setPaymentSummary({
          total: resData.booking.totalAmount || totalAmount,
          paid: resData.booking.amountPaid || 0,
        });
        done(resData.booking?.id);
      } else {
        alert(resData.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to submit booking");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = `
    h-12 w-full rounded-xl border border-[#252525] bg-[#111]
    text-white placeholder:text-[#777] outline-none focus:border-[#ecb100]
  `;

  if (!airport) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#252525] bg-[#111] p-8 text-center text-white/60">
        Select an airport above to see pricing and start your booking.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <div className="flex items-center justify-between rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-4 py-3">
        <span className="text-sm text-white/70">Booking transfer to</span>
        <span className="font-medium text-[#ecb100]">{airport.name}</span>
      </div>

      <div>
        <p className="mb-3 text-sm uppercase tracking-wide text-white/50">Direction of travel</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDirection("TO_AIRPORT")}
            className={`
              flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all duration-200 sm:text-base
              ${direction === "TO_AIRPORT"
                ? "border-[#ecb100] bg-[#ecb100]/10 text-[#ecb100]"
                : "border-[#252525] bg-[#111] text-white/60 hover:border-[#ecb100]/30"}
            `}
          >
            <ArrowRightLeft size={16} className="shrink-0" />
            <span className="truncate">To Airport</span>
          </button>
          <button
            type="button"
            onClick={() => setDirection("FROM_AIRPORT")}
            className={`
              flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all duration-200 sm:text-base
              ${direction === "FROM_AIRPORT"
                ? "border-[#ecb100] bg-[#ecb100]/10 text-[#ecb100]"
                : "border-[#252525] bg-[#111] text-white/60 hover:border-[#ecb100]/30"}
            `}
          >
            <ArrowRightLeft size={16} className="rotate-180 shrink-0" />
            <span className="truncate">From Airport</span>
          </button>
        </div>
      </div>

      <div className="relative h-12">
        <MapPinned size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <select
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
          className={`${fieldClass} pl-12 pr-4 appearance-none`}
        >
          <option value="" className="bg-[#111]">
            {availableCities.length ? "Select your city" : "No cities available for this direction"}
          </option>
          {availableCities.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <div className="relative h-12">
          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
          <input
            name="pickup"
            value={form.pickup}
            onChange={handleChange}
            placeholder={direction === "TO_AIRPORT" ? "Pickup Address" : "Drop Address"}
            className={`${fieldClass} pl-12`}
          />
        </div>

        <div className="relative h-12">
          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
          <input
            name="terminal"
            value={form.terminal}
            onChange={handleChange}
            placeholder={direction === "TO_AIRPORT" ? "Drop point at airport (e.g. T1, T2, Domestic)" : "Pickup point at airport (e.g. T1, T2, Domestic)"}
            className={`${fieldClass} pl-12`}
          />
        </div>

        <p className="md:col-span-2 -mt-3 text-xs text-white/40">
          Prices shown are based on your selected city. Fares may vary for other locations and will be confirmed by our team.
        </p>

        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <button className={`${fieldClass} flex items-center gap-3 px-4 text-left`}>
                <CalendarDays size={18} className="shrink-0 text-[#ecb100]" />
                <span className="truncate">{travelDate ? format(travelDate, "dd MMM yyyy") : "Select Travel Date"}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-[#252525] bg-[#141414] p-0">
              <Calendar mode="single" selected={travelDate} onSelect={setTravelDate} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative">
          <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10" />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className={`${fieldClass} pl-12 [&::-webkit-calendar-picker-indicator]:invert`}
          />
        </div>
      </div>

      {selectedCityId ? (
        <div>
          <p className="mb-3 text-sm uppercase tracking-wide text-white/50">Choose your vehicle</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {(Object.keys(grouped) as Category[]).map((cat) => (
              <div key={cat} className="relative">
                <div
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={() => toggleCategory(cat)}
                  className={`
                    flex items-center justify-between rounded-2xl border bg-[#111] p-4 cursor-pointer transition-all duration-200
                    hover:border-[#ecb100]/40 sm:block
                    ${activeCategory === cat ? "border-[#ecb100]/60" : "border-[#252525]"}
                  `}
                >
                  <div>
                    <p className="font-medium text-white">{cat}</p>

                    {grouped[cat].some(v => v.id === selectedVehicleId) && (
                      <p className="mt-1 text-xs text-[#ecb100]">
                        {grouped[cat].find(v => v.id === selectedVehicleId)?.name}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-white/40 sm:hidden">
                    {grouped[cat].length} option{grouped[cat].length === 1 ? "" : "s"}
                  </span>
                </div>

                {activeCategory === cat && (
                  <div
                    onMouseLeave={() => setActiveCategory(null)}
                    className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-[#252525] bg-black/95 backdrop-blur-lg shadow-xl z-50 overflow-hidden"
                  >
                    {grouped[cat].length === 0 && (
                      <p className="px-4 py-3 text-sm text-white/40">No vehicles in this category</p>
                    )}

                    {grouped[cat].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVehicleId(v.id);
                          setActiveCategory(null);
                        }}
                        className={`
                          w-full text-left px-4 py-3.5 sm:py-3 text-sm transition-colors
                          ${selectedVehicleId === v.id ? "bg-[#ecb100]/10 text-[#ecb100]" : "text-white hover:bg-white/5"}
                        `}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{v.name}</span>
                          <span className="shrink-0" style={{ fontFamily: "var(--font-geist-mono)" }}>₹{priceFor(v.id)}</span>
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">
                          {v.passengerCapacity ?? "-"} seats · {v.suitcaseCapacity ?? "-"} bags
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#252525] p-8 text-center text-sm text-white/40">
          Select a direction and city above to see vehicle pricing.
        </div>
      )}

      {selectedVehicle && (
        <div className="rounded-xl border border-[#252525] bg-black/40 p-4 text-sm text-white">
          <p className="text-[#ecb100] font-medium">Selected: {selectedVehicle.name}</p>
          <p className="text-white/60 mt-1">
            Capacity: {selectedVehicle.passengerCapacity ?? "-"} passengers · {selectedVehicle.suitcaseCapacity ?? "-"} bags
          </p>
        </div>
      )}

      {selectedVehicle && totalAmount > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-4 py-3">
            <span className="text-sm text-white/70">Estimated fare</span>
            <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-lg font-medium text-[#ecb100]">
              ₹{totalAmount}
            </span>
          </div>
          <p className="text-xs text-white/40 px-1">
            Final fare may differ for other pickup/drop locations and will be confirmed by our team.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">

        <div className="relative h-12">
          <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
          <input
            type="number"
            name="passengers"
            value={form.passengers}
            onChange={handleChange}
            placeholder="Number of passengers"
            className={`${fieldClass} pl-12`}
          />
        </div>

        <div className="relative h-12">
          <Luggage size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
          <input
            type="number"
            name="suitcases"
            value={form.suitcases}
            onChange={handleChange}
            placeholder="Suitcases"
            className={`${fieldClass} pl-12`}
          />
        </div>

        <div className="relative h-12">
          <Luggage size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
          <input
            type="number"
            name="handbags"
            value={form.handbags}
            onChange={handleChange}
            placeholder="Handbags"
            className={`${fieldClass} pl-12`}
          />
        </div>

        <div className="relative h-12">
          <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={`${fieldClass} pl-12`}
          />
        </div>

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className={fieldClass}
        />
      </div>

      {(suitcasesOverCapacity || passengersOverCapacity) && (
        <div className="rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 p-4 text-sm text-[#ecb100]">
          {passengersOverCapacity && (
            <p>This vehicle seats up to {passengerCapacity} passengers. Our team will confirm if a larger vehicle is needed.</p>
          )}
          {suitcasesOverCapacity && (
            <p className={passengersOverCapacity ? "mt-2" : ""}>
              Your luggage exceeds this vehicle's boot capacity ({suitcaseCapacity} bags). We will provide you a roof rack for your extra luggage, no additional charges applied.
            </p>
          )}
        </div>
      )}

      <PaymentMethodPicker
        totalAmount={totalAmount}
        paymentType={paymentType}
        onPaymentTypeChange={setPaymentType}
        partialAmount={partialAmount}
        onPartialAmountChange={setPartialAmount}
        onScreenshotChange={setScreenshot}
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-12 rounded-xl bg-[#ecb100] font-semibold text-black hover:bg-[#f6c94c]"
      >
        {loading ? "Processing..." : "Request Airport Transfer"}
      </Button>

      <BookingSuccess
        open={success}
        onClose={reset}
        bookingId={bookingId}
        totalAmount={paymentSummary?.total}
        amountPaid={paymentSummary?.paid}
      />
    </div>
  );
}