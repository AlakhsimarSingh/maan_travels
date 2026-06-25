"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BookingSuccess from "@/components/common/BookingSuccess";
import PaymentMethodPicker, { PaymentType } from "./PaymentMethodPicker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { API_URL } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";

type Location = { id: string; name: string };

export default function TourBookingForm({
  routeId,
  vehicleId,
  price,
  pickup: prefillPickupCity,
  destination: prefillDestination,
  locked = false,
}: {
  routeId?: string;
  vehicleId?: string;
  price?: number;
  pickup?: string;
  destination?: string;
  // When true, this booking originated from a fixed Route card — pickup
  // city and destination are not editable, and we ask for the exact
  // pickup address instead.
  locked?: boolean;
}) {
  const [pickupLocations, setPickupLocations] = useState<Location[]>([]);
  const [dropLocations, setDropLocations] = useState<Location[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickupCity: prefillPickupCity || "",
    destination: prefillDestination || "",
    pickupAddress: "",
    travelDate: "",
    requirements: "",
  });

  const [paymentType, setPaymentType] = useState<PaymentType>("later");
  const [partialAmount, setPartialAmount] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<{ total: number; paid: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const { success, bookingId, done, reset } = useBookingStatus();

  const totalAmount = vehicleId ? price || 0 : 0;

  useEffect(() => {
    // Pickup/destination are fixed by the route — no need to fetch the
    // editable dropdown options at all.
    if (locked) return;

    const fetchLocations = async () => {
      try {
        const [pickupRes, dropRes] = await Promise.all([
          fetch(`${API_URL}/api/locations/pickup`),
          fetch(`${API_URL}/api/locations/drop`),
        ]);
        const [pickupData, dropData] = await Promise.all([
          pickupRes.json(),
          dropRes.json(),
        ]);
        setPickupLocations(pickupData.locations || []);
        setDropLocations(dropData.locations || []);
      } catch (error) {
        console.log("Location fetch failed", error);
      }
    };

    fetchLocations();
  }, [locked]);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submitBooking = async () => {
    if (locked && !form.pickupAddress.trim()) {
      alert("Please enter your exact pickup address");
      return;
    }

    if (!form.travelDate) {
      alert("Please select a travel date");
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

      const route = `${form.pickupCity} → ${form.destination}`;

      const data = new FormData();
      data.append("name", form.name);
      data.append("phone", form.phone);
      data.append("email", form.email);
      data.append("pickupCity", form.pickupCity);
      data.append("destination", form.destination);
      data.append("route", route);
      data.append("pickupAddress", form.pickupAddress);
      data.append("travelDate", form.travelDate);
      data.append("requirements", form.requirements);
      if (vehicleId) data.append("vehicleId", vehicleId);
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

      const res = await fetch(`${API_URL}/api/tour-bookings`, {
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
        setForm({
          name: "",
          phone: "",
          email: "",
          pickupCity: "",
          destination: "",
          pickupAddress: "",
          travelDate: "",
          requirements: "",
        });
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

  // Tomorrow's date as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">

      {totalAmount > 0 && (
        <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-4 py-3">
          <span className="text-sm text-white/70">Estimated price</span>
          <span
            style={{ fontFamily: "var(--font-geist-mono)" }}
            className="text-lg font-medium text-[#ecb100]"
          >
            ₹{totalAmount}
          </span>
        </div>
      )}

      <Input
        placeholder="Full Name"
        value={form.name}
        onChange={e => updateField("name", e.target.value)}
      />
      <Input
        placeholder="Mobile Number"
        value={form.phone}
        onChange={e => updateField("phone", e.target.value)}
      />
      <Input
        placeholder="Email Address"
        value={form.email}
        onChange={e => updateField("email", e.target.value)}
      />

      {/* Travel date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50 pl-1">Travel Date</label>
        <input
          type="date"
          min={minDate}
          value={form.travelDate}
          onChange={e => updateField("travelDate", e.target.value)}
          className="w-full rounded-xl border border-[#252525] bg-[#111] px-3 py-2.5 text-white text-sm outline-none focus:border-[#ecb100] [color-scheme:dark]"
        />
      </div>

      {locked ? (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 pl-1">Pickup City</label>
          <div className="w-full rounded-xl border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-white/80 text-sm">
            {form.pickupCity || "—"}
          </div>
        </div>
      ) : (
        <Select
          value={form.pickupCity}
          onValueChange={value => updateField("pickupCity", value)}
        >
          <SelectTrigger className="bg-[#111] border-[#252525] text-white">
            <SelectValue placeholder="Select Pickup City" />
          </SelectTrigger>
          <SelectContent>
            {pickupLocations.map(l => (
              <SelectItem key={l.id} value={l.name}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {locked ? (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50 pl-1">Destination</label>
          <div className="w-full rounded-xl border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-white/80 text-sm">
            {form.destination || "—"}
          </div>
        </div>
      ) : (
        <Select
          value={form.destination}
          onValueChange={value => updateField("destination", value)}
        >
          <SelectTrigger className="bg-[#111] border-[#252525] text-white">
            <SelectValue placeholder="Select Destination" />
          </SelectTrigger>
          <SelectContent>
            {dropLocations.map(l => (
              <SelectItem key={l.id} value={l.name}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Input
        placeholder={locked ? "Exact pickup address (house no., street, landmark)" : "Pickup Address"}
        value={form.pickupAddress}
        onChange={e => updateField("pickupAddress", e.target.value)}
        className="sm:col-span-2"
      />

      <div className="sm:col-span-2 rounded-xl border border-[#252525] bg-[#111] px-4 py-3 text-[#c7c7c7] text-sm">
        {form.pickupCity && form.destination
          ? `Route: ${form.pickupCity} → ${form.destination}`
          : "Route will be generated automatically"}
      </div>

      <textarea
        placeholder="Special Requirements (optional)"
        value={form.requirements}
        onChange={e => updateField("requirements", e.target.value)}
        className="sm:col-span-2 min-h-28 rounded-xl border border-[#252525] bg-[#111] p-4 text-white text-sm outline-none focus:border-[#ecb100]"
      />

      <div className="sm:col-span-2">
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
        size="lg"
        disabled={loading}
        onClick={submitBooking}
        className="sm:col-span-2 bg-[#ecb100] text-black hover:bg-[#f6c94c]"
      >
        {loading ? "Processing..." : "Book Your Tour"}
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