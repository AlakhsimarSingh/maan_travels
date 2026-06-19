"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BookingDatePicker from "./BookingDatePicker";
import BookingSuccess from "@/components/common/BookingSuccess";
import PaymentMethodPicker, { PaymentType } from "./PaymentMethodPicker";

import { Clock, MapPin, User, Luggage, Car } from "lucide-react";

import { useBookingStatus } from "@/src/hooks/useBookingStatus";
import { API_URL } from "@/src/services/bookingService";

type Vehicle = { id: string; name: string };

export default function AirportTransferForm({
  routeId,
  vehicleId,
  price,
  pickup: prefillPickup,
}: {
  routeId?: string;
  vehicleId?: string;
  price?: number;
  pickup?: string;
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [travelDate, setTravelDate] = useState<Date>();

  const [form, setForm] = useState({
    pickup: prefillPickup || "",
    airport: "",
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

  const priceValid = vehicleId ? form.vehicle === vehicleId : false;
  const totalAmount = priceValid ? price || 0 : 0;

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vehicles`);
        const data = await res.json();
        setVehicles(data.vehicles || []);
      } catch (err) {
        console.error("Vehicle loading failed", err);
      }
    };

    loadVehicles();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !form.pickup || !form.airport || !travelDate || !form.time ||
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
      data.append("airport", form.airport);
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
    h-12 w-full rounded-xl bg-[#111] border border-[#252525]
    text-white placeholder:text-[#777] outline-none focus:border-[#ecb100]
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

      <div className="relative h-12">
        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <Input name="pickup" value={form.pickup} onChange={handleChange} placeholder="Pickup Address" className={`${fieldClass} pl-12`} />
      </div>

      <div className="relative h-12">
        <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <select name="airport" value={form.airport} onChange={handleChange} className={`${fieldClass} pl-12`}>
          <option value="">Select Airport</option>
          <option>Amritsar Airport</option>
          <option>Chandigarh Airport</option>
          <option>Adampur Airport</option>
          <option>Delhi Airport</option>
          <option>Ludhiana Airport</option>
        </select>
      </div>

      <BookingDatePicker placeholder="Select Travel Date" onChange={setTravelDate} />

      <div className="relative h-12">
        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10" />
        <Input type="time" name="time" value={form.time} onChange={handleChange} className={`${fieldClass} pl-12 [&::-webkit-calendar-picker-indicator]:invert`} />
      </div>

      <div className="relative h-12">
        <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <select name="vehicle" value={form.vehicle} onChange={handleChange} className={`${fieldClass} pl-12`}>
          <option value="">Choose Vehicle</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
          ))}
        </select>
      </div>

      <select name="passengers" value={form.passengers} onChange={handleChange} className={fieldClass}>
        <option value="">Passengers</option>
        <option value="1">1 Passenger</option>
        <option value="2">2-4 Passengers</option>
        <option value="3">5-7 Passengers</option>
        <option value="4">8+ Passengers</option>
      </select>

      <div className="relative h-12">
        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className={`${fieldClass} pl-12`} />
      </div>

      <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className={fieldClass} />

      <div className="relative h-12">
        <Luggage size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <Input type="number" name="suitcases" value={form.suitcases} onChange={handleChange} placeholder="Suitcases" className={`${fieldClass} pl-12`} />
      </div>

      <div className="relative h-12">
        <Luggage size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100] z-10" />
        <Input type="number" name="handbags" value={form.handbags} onChange={handleChange} placeholder="Handbags" className={`${fieldClass} pl-12`} />
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

      <Button onClick={handleSubmit} disabled={loading} className="md:col-span-2 h-12 rounded-xl bg-[#ecb100] text-black font-semibold hover:bg-[#f6c94c]">
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