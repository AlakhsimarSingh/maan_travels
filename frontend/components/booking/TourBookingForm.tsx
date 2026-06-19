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

type Location = { id: string; name: string; type: "PICKUP" | "DESTINATION" };

export default function TourBookingForm({
  routeId,
  vehicleId,
  price,
  pickup: prefillPickupCity,
  destination: prefillDestination,
}: {
  routeId?: string;
  vehicleId?: string;
  price?: number;
  pickup?: string;
  destination?: string;
}) {
  const [locations, setLocations] = useState<Location[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickupCity: prefillPickupCity || "",
    destination: prefillDestination || "",
    pickupAddress: "",
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
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_URL}/api/locations`);
        const data = await res.json();
        setLocations(data.locations || []);
      } catch (error) {
        console.log("Location fetch failed", error);
      }
    };

    fetchLocations();
  }, []);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submitBooking = async () => {
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
      data.append("requirements", form.requirements);
      if (vehicleId) data.append("vehicleId", vehicleId);
      if (routeId) data.append("routeId", routeId);
      data.append("paymentType", paymentType);
      data.append(
        "amountPaid",
        paymentType === "full" ? String(totalAmount) : paymentType === "partial" ? partialAmount : "0"
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

        setForm({ name: "", phone: "", email: "", pickupCity: "", destination: "", pickupAddress: "", requirements: "" });
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
    <div className="grid gap-6 md:grid-cols-2">

      {totalAmount > 0 && (
        <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-4 py-3">
          <span className="text-sm text-white/70">Estimated price</span>
          <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-lg font-medium text-[#ecb100]">
            ₹{totalAmount}
          </span>
        </div>
      )}

      <Input placeholder="Full Name" value={form.name} onChange={e => updateField("name", e.target.value)} />
      <Input placeholder="Mobile Number" value={form.phone} onChange={e => updateField("phone", e.target.value)} />
      <Input placeholder="Email Address" value={form.email} onChange={e => updateField("email", e.target.value)} />

      <Select value={form.pickupCity} onValueChange={value => updateField("pickupCity", value)}>
        <SelectTrigger className="bg-[#111] border-[#252525] text-white">
          <SelectValue placeholder="Select Pickup City" />
        </SelectTrigger>
        <SelectContent>
          {locations.filter(l => l.type === "PICKUP").map(l => (
            <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={form.destination} onValueChange={value => updateField("destination", value)}>
        <SelectTrigger className="bg-[#111] border-[#252525] text-white">
          <SelectValue placeholder="Select Destination" />
        </SelectTrigger>
        <SelectContent>
          {locations.filter(l => l.type === "DESTINATION").map(l => (
            <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input placeholder="Pickup Address" value={form.pickupAddress} onChange={e => updateField("pickupAddress", e.target.value)} />

      <div className="md:col-span-2 rounded-xl border border-[#252525] bg-[#111] px-4 py-3 text-[#c7c7c7]">
        {form.pickupCity && form.destination ? `Route: ${form.pickupCity} → ${form.destination}` : "Route will be generated automatically"}
      </div>

      <textarea
        placeholder="Special Requirements"
        value={form.requirements}
        onChange={e => updateField("requirements", e.target.value)}
        className="md:col-span-2 min-h-32 rounded-xl border border-[#252525] bg-[#111] p-4 text-white outline-none focus:border-[#ecb100]"
      />

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

      <Button size="lg" disabled={loading} onClick={submitBooking} className="md:col-span-2 bg-[#ecb100] text-black hover:bg-[#f6c94c]">
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