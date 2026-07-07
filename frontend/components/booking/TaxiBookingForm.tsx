"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BookingDatePicker from "./BookingDatePicker";
// import BookingTimePicker from "./BookingTimePicker";
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
import BookingTimePicker from "./BookingTimePicker";

export default function TaxiBookingForm({
  rideMode,
  selectedVehicleId,
  routeId,
  price,
}: {
  rideMode: "oneway" | "round" | "local";
  selectedVehicleId: string;
  routeId?: string;
  price?: number;
}) {
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState<string>("");
  const [returnDate, setReturnDate] = useState<Date>();
  const [returnTime, setReturnTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    drop: "",
    persons: "",
    duration: "",
    requirements: "",
  });

  const [paymentType, setPaymentType] = useState<PaymentType>("later");
  const [partialAmount, setPartialAmount] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<{ total: number; paid: number } | null>(null);

  const { success, bookingId, done, reset } = useBookingStatus();

  const totalAmount = price || 0;

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

      const data = new FormData();
      data.append("name", form.name);
      data.append("phone", form.phone);
      data.append("email", form.email);
      data.append("pickup", form.pickup);
      data.append("drop", rideMode === "local" ? form.pickup : form.drop);
      data.append("rideMode", rideMode);
      data.append("vehicleId", selectedVehicleId);
      if (routeId) data.append("routeId", routeId);
      data.append("travelDate", pickupDate ? pickupDate.toISOString() : "");
      data.append("pickupTime", pickupTime || "");
      if (returnDate) data.append("returnDate", returnDate.toISOString());
      if (returnTime) data.append("returnTime", returnTime);
      data.append("persons", form.persons);
      data.append(
        "requirements",
        rideMode === "local"
          ? `${form.duration} Hours - ${form.requirements}`
          : form.requirements
      );
      data.append("paymentType", paymentType);
      data.append(
        "amountPaid",
        paymentType === "full" ? String(totalAmount) : paymentType === "partial" ? partialAmount : "0"
      );
      if (screenshot) data.append("paymentScreenshot", screenshot);

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        body: data,
      });

      const resData = await res.json();

      if (resData.success) {
        setPaymentSummary({
          total: resData.booking.totalAmount || totalAmount,
          paid: resData.booking.amountPaid || 0,
        });
        done(resData.booking.id);
      } else {
        alert(resData.message || "Booking failed");
      }
    } catch (e) {
      console.log(e);
      alert("Unable to submit booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">

      {totalAmount > 0 && (
        <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-4 py-3">
          <span className="text-sm text-white/70">Estimated fare</span>
          <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-lg font-medium text-[#ecb100]">
            ₹{totalAmount}
          </span>
        </div>
      )}

      <Input
        placeholder="Full Name"
        value={form.name}
        onChange={e => updateField("name", e.target.value)}
        aria-label="Full Name"
      />
      <Input
        placeholder="Mobile Number"
        value={form.phone}
        onChange={e => updateField("phone", e.target.value)}
        aria-label="Mobile Number"
      />
      <Input
        placeholder="Email Address"
        value={form.email}
        onChange={e => updateField("email", e.target.value)}
        aria-label="Email Address"
      />

      {/* Pickup date + time, always paired */}
      <div className="md:col-span-2 grid grid-cols-2 gap-3">
        <BookingDatePicker placeholder="Pickup Date" value={pickupDate} onChange={setPickupDate} />
        <BookingTimePicker placeholder="Pickup Time" value={pickupTime} onChange={setPickupTime} />
      </div>

      <Input
        placeholder="Pickup Location"
        value={form.pickup}
        onChange={e => updateField("pickup", e.target.value)}
        aria-label="Pickup Location"
      />

      {rideMode === "local" ? (
        <Input
          placeholder="City / Area for Local Travel"
          value={form.drop}
          onChange={e => updateField("drop", e.target.value)}
          aria-label="City or Area for Local Travel"
        />
      ) : (
        <Input
          placeholder="Drop Location"
          value={form.drop}
          onChange={e => updateField("drop", e.target.value)}
          aria-label="Drop Location"
        />
      )}

      {rideMode === "round" && (
        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          <BookingDatePicker placeholder="Return Date" value={returnDate} onChange={setReturnDate} />
          <BookingTimePicker placeholder="Return Time" value={returnTime} onChange={setReturnTime} />
        </div>
      )}

      {rideMode === "local" && (
        <Select value={form.duration} onValueChange={value => updateField("duration", value)}>
          <SelectTrigger
            aria-label="Select Duration"
            className="h-12 bg-[#111] border-[#252525] text-white"
          >
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4 Hours</SelectItem>
            <SelectItem value="8">8 Hours</SelectItem>
            <SelectItem value="12">12 Hours</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={form.persons} onValueChange={value => updateField("persons", value)}>
        <SelectTrigger
          aria-label="Number of Passengers"
          className="h-12 bg-[#111] border-[#252525] text-white"
        >
          <SelectValue placeholder="Passengers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1-3">1-3 Persons</SelectItem>
          <SelectItem value="4-7">4-7 Persons</SelectItem>
          <SelectItem value="8+">8+ Persons</SelectItem>
        </SelectContent>
      </Select>

      <textarea
        placeholder="Special Requirements"
        value={form.requirements}
        onChange={e => updateField("requirements", e.target.value)}
        aria-label="Special Requirements"
        className="md:col-span-2 min-h-32 rounded-xl border border-[#252525] bg-[#111] p-4 text-white"
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

      <Button
        onClick={submitBooking}
        disabled={loading}
        className="md:col-span-2 h-12 bg-[#ecb100] text-black hover:bg-[#f6c94c]"
      >
        {loading ? "Processing..." : "Submit Taxi Booking"}
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