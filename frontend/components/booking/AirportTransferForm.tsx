"use client";

import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BookingDatePicker from "./BookingDatePicker";
import BookingSuccess from "@/components/common/BookingSuccess";
import PaymentMethodPicker, { PaymentType } from "./PaymentMethodPicker";

import { Clock, MapPin, MapPinned, User, Luggage, Car, PlaneTakeoff, ArrowRightLeft } from "lucide-react";

import { useBookingStatus } from "@/src/hooks/useBookingStatus";
import { useVehicles } from "@/src/hooks/useVehicles";
import { API_URL } from "@/src/services/bookingService";

type Direction = "TO_AIRPORT" | "FROM_AIRPORT";

type AirportOption = { id: string; name: string };
type CityOption = { id: string; name: string; canPickup: boolean; canDrop: boolean; active: boolean };
type CityPriceCell = { cityId: string; vehicleId: string; direction: Direction; price: number };

export default function AirportTransferForm({
  routeId,
  airportId: prefillAirportId,
  vehicleId,
  price,
  pickup: prefillPickup,
  airport: prefillAirport,
}: {
  routeId?: string;
  airportId?: string;
  vehicleId?: string;
  price?: number;
  pickup?: string;
  airport?: string;
}) {
  const { vehicles } = useVehicles("taxi");
  const [travelDate, setTravelDate] = useState<Date | undefined>(undefined);

  const [airports, setAirports] = useState<AirportOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [cityPricing, setCityPricing] = useState<CityPriceCell[]>([]);

  const [direction, setDirection] = useState<Direction>("TO_AIRPORT");
  const [selectedAirportId, setSelectedAirportId] = useState(prefillAirportId || "");
  const [selectedCityId, setSelectedCityId] = useState("");

  const [form, setForm] = useState({
    pickup: prefillPickup || "",
    time: "",
    vehicle: vehicleId || "",
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

  // Fetch real airports once — replaces the old hardcoded <option> list,
  // since pricing now depends on a real airportId, not just a name string.
  useEffect(() => {
    fetch(`${API_URL}/api/airports`)
      .then((res) => res.json())
      .then((data) => setAirports(data.airports || []))
      .catch(() => setAirports([]));
  }, []);

  // If the caller only gave us a name (legacy prefillAirport prop) and not
  // an id, resolve it once the airport list has loaded.
  useEffect(() => {
    if (selectedAirportId || !prefillAirport || !airports.length) return;
    const match = airports.find((a) => a.name === prefillAirport);
    if (match) setSelectedAirportId(match.id);
  }, [prefillAirport, airports, selectedAirportId]);

  // Cities available for the current direction
  useEffect(() => {
    fetch(`${API_URL}/api/airport-cities?direction=${direction}`)
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []))
      .catch(() => setCities([]));
  }, [direction]);

  // Switching direction may invalidate the chosen city
  useEffect(() => {
    setSelectedCityId("");
  }, [direction, selectedAirportId]);

  // Full pricing grid for the selected airport
  useEffect(() => {
    if (!selectedAirportId) {
      setCityPricing([]);
      return;
    }
    fetch(`${API_URL}/api/airport-cities/pricing/${selectedAirportId}`)
      .then((res) => res.json())
      .then((data) => setCityPricing(data.pricing || []))
      .catch(() => setCityPricing([]));
  }, [selectedAirportId]);

  const availableCities = useMemo(
    () => cities.filter((c) => (direction === "TO_AIRPORT" ? c.canPickup : c.canDrop)),
    [cities]
  );

  const selectedAirportName = airports.find((a) => a.id === selectedAirportId)?.name || prefillAirport || "";

  // City + direction pricing is the source of truth now. The `price` prop
  // (from a prefilled route/promo card) is only used as a placeholder
  // before a city has been chosen, so the fare display is never blank.
  const totalAmount = useMemo(() => {
    if (selectedCityId && form.vehicle) {
      const match = cityPricing.find(
        (p) => p.cityId === selectedCityId && p.vehicleId === form.vehicle && p.direction === direction
      );
      if (match) return match.price;
    }
    return price || 0;
  }, [selectedCityId, form.vehicle, cityPricing, direction, price]);

  // Sync if parent re-opens modal with new prefill values
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      pickup: prefillPickup || prev.pickup,
      vehicle: vehicleId || prev.vehicle,
    }));
    if (prefillAirportId) setSelectedAirportId(prefillAirportId);
  }, [prefillPickup, prefillAirportId, vehicleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!selectedAirportId) {
      alert("Please select an airport");
      return;
    }

    if (!selectedCityId) {
      alert("Please select your city");
      return;
    }

    if (
      !form.pickup || !travelDate || !form.time ||
      !form.vehicle || !form.passengers || !form.name || !form.phone ||
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
      data.append("airport", selectedAirportName);
      data.append("airportId", selectedAirportId);
      data.append("cityId", selectedCityId);
      data.append("direction", direction);
      data.append("travelDate", travelDate.toISOString());
      data.append("pickupTime", form.time);
      data.append("vehicleId", form.vehicle);
      data.append("passengers", form.passengers);
      data.append("suitcases", form.suitcases);
      data.append("handbags", form.handbags);
      if (routeId) data.append("routeId", routeId);
      data.append("paymentType", paymentType);
      data.append(
        "amountPaid",
        paymentType === "full"
          ? String(totalAmount)
          : paymentType === "partial"
          ? partialAmount
          : "0"
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
    h-12 w-full rounded-xl bg-[#111] border border-[#252525]
    text-white placeholder:text-[#777] outline-none focus:border-[#ecb100]
  `;

  const lockedFieldClass = `
    h-12 w-full rounded-xl bg-[#1a1a1a] border border-[#252525]
    text-[#ecb100] outline-none cursor-not-allowed opacity-80
  `;

  return (
    <div className="grid gap-5 md:grid-cols-2">

      {totalAmount > 0 && (
        <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-4 py-3">
          <span className="text-sm text-white/70">Estimated fare</span>
          <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-lg font-medium text-[#ecb100]">
            ₹{totalAmount}
          </span>
        </div>
      )}

      <div className="md:col-span-2">
        <p className="mb-3 text-sm uppercase tracking-wide text-white/50">Direction of travel</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDirection("TO_AIRPORT")}
            className={`
              flex items-center justify-center gap-2 h-12 rounded-xl border font-medium transition-all duration-200
              ${direction === "TO_AIRPORT"
                ? "border-[#ecb100] bg-[#ecb100]/10 text-[#ecb100]"
                : "border-[#252525] bg-[#111] text-white/60 hover:border-[#ecb100]/30"}
            `}
          >
            <ArrowRightLeft size={16} />
            To Airport
          </button>
          <button
            type="button"
            onClick={() => setDirection("FROM_AIRPORT")}
            className={`
              flex items-center justify-center gap-2 h-12 rounded-xl border font-medium transition-all duration-200
              ${direction === "FROM_AIRPORT"
                ? "border-[#ecb100] bg-[#ecb100]/10 text-[#ecb100]"
                : "border-[#252525] bg-[#111] text-white/60 hover:border-[#ecb100]/30"}
            `}
          >
            <ArrowRightLeft size={16} className="rotate-180" />
            From Airport
          </button>
        </div>
      </div>

      <div className="relative h-12">
        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <label htmlFor="pickup" className="sr-only">
          {direction === "TO_AIRPORT" ? "Pickup Address" : "Drop Address"}
        </label>
        <Input
          id="pickup"
          name="pickup"
          value={form.pickup}
          onChange={handleChange}
          placeholder={direction === "TO_AIRPORT" ? "Pickup Address" : "Drop Address"}
          className={`${fieldClass} pl-12`}
        />
      </div>

      <div className="relative h-12">
        <PlaneTakeoff size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        {prefillAirportId || prefillAirport ? (
          <>
            <label htmlFor="airport" className="sr-only">Airport</label>
            <Input
              id="airport"
              name="airport"
              value={selectedAirportName}
              readOnly
              aria-readonly="true"
              className={`${lockedFieldClass} pl-12`}
            />
          </>
        ) : (
          <>
            <label htmlFor="airport" className="sr-only">Select Airport</label>
            <select
              id="airport"
              name="airport"
              value={selectedAirportId}
              onChange={(e) => setSelectedAirportId(e.target.value)}
              aria-label="Select Airport"
              className={`${fieldClass} pl-12`}
            >
              <option value="">Select Airport</option>
              {airports.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="relative h-12">
        <MapPinned size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <label htmlFor="city" className="sr-only">Select City</label>
        <select
          id="city"
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
          aria-label="Select City"
          className={`${fieldClass} pl-12`}
        >
          <option value="">
            {availableCities.length ? "Select your city" : "No cities available for this direction"}
          </option>
          {availableCities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <BookingDatePicker
        placeholder="Select Travel Date"
        value={travelDate}
        onChange={setTravelDate}
      />

      <div className="relative h-12">
        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10" />
        <label htmlFor="time" className="sr-only">Pickup Time</label>
        <Input
          id="time"
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          aria-label="Pickup Time"
          className={`${fieldClass} pl-12 [&::-webkit-calendar-picker-indicator]:invert`}
        />
      </div>

      <div className="relative h-12">
        <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        {vehicleId ? (
          <>
            <label htmlFor="vehicle" className="sr-only">Vehicle</label>
            <Input
              id="vehicle"
              value={vehicles.find((v) => v.id === vehicleId)?.name || "Selected Vehicle"}
              readOnly
              aria-readonly="true"
              className={`${lockedFieldClass} pl-12`}
            />
          </>
        ) : (
          <>
            <label htmlFor="vehicle" className="sr-only">Choose Vehicle</label>
            <select
              id="vehicle"
              name="vehicle"
              value={form.vehicle}
              onChange={handleChange}
              aria-label="Choose Vehicle"
              className={`${fieldClass} pl-12`}
            >
              <option value="">Choose Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      <div>
        <label htmlFor="passengers" className="sr-only">Number of Passengers</label>
        <select
          id="passengers"
          name="passengers"
          value={form.passengers}
          onChange={handleChange}
          aria-label="Number of Passengers"
          className={fieldClass}
        >
          <option value="">Passengers</option>
          <option value="1">1 Passenger</option>
          <option value="2">2–4 Passengers</option>
          <option value="3">5–7 Passengers</option>
          <option value="4">8+ Passengers</option>
        </select>
      </div>

      <div className="relative h-12">
        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <label htmlFor="name" className="sr-only">Your Name</label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className={`${fieldClass} pl-12`}
        />
      </div>

      <label htmlFor="phone" className="sr-only">Phone Number</label>
      <Input
        id="phone"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className={fieldClass}
      />

      <div className="relative h-12">
        <Luggage size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <label htmlFor="suitcases" className="sr-only">Number of Suitcases</label>
        <Input
          id="suitcases"
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
        <label htmlFor="handbags" className="sr-only">Number of Handbags</label>
        <Input
          id="handbags"
          type="number"
          name="handbags"
          value={form.handbags}
          onChange={handleChange}
          placeholder="Handbags"
          className={`${fieldClass} pl-12`}
        />
      </div>

      <div className="md:col-span-2">
        <PaymentMethodPicker
          totalAmount={totalAmount}
          paymentType={paymentType}
          onPaymentTypeChange={setPaymentType}
          partialAmount={partialAmount}
          onPartialAmountChange={setPartialAmount}
          onScreenshotChange={setScreenshot}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="md:col-span-2 h-12 rounded-xl bg-[#ecb100] text-black font-semibold hover:bg-[#f6c94c]"
      >
        {loading ? "Processing..." : "Book Airport Transfer"}
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