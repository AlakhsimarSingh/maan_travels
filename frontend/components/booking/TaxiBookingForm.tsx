"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BookingDatePicker from "./BookingDatePicker";
import BookingTimePicker from "./BookingTimePicker";
import BookingSuccess from "@/components/common/BookingSuccess";
import PaymentMethodPicker, { PaymentType } from "./PaymentMethodPicker";
// import BookingStep from "./BookingStep";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { API_URL } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";
import BookingStep from "./BookingStep";

export default function TaxiBookingForm({
  rideMode,
  selectedVehicleId,
  routeId,
  price,
  startIndex = 1,
}: {
  rideMode: "oneway" | "round" | "local";
  selectedVehicleId: string;
  routeId?: string;
  price?: number;
  startIndex?: number;
}) {
  const [openStep, setOpenStep] = useState(startIndex);

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
    setForm((prev) => ({ ...prev, [field]: value }));
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
        rideMode === "local" ? `${form.duration} Hours - ${form.requirements}` : form.requirements
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

  const routeDone = !!(form.pickup && (rideMode === "local" || form.drop) && pickupDate && pickupTime);
  const detailsDone = !!(form.name && form.phone && form.persons);
  const routeSummary = form.pickup
    ? rideMode === "local"
      ? form.pickup
      : `${form.pickup}${form.drop ? " → " + form.drop : ""}`
    : undefined;

  return (
    <div className="space-y-2.5">
      {totalAmount > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-[#ecb100]/30 bg-[#ecb100]/5 px-4 py-3">
          <span className="text-sm text-white/70">Estimated fare</span>
          <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-lg font-medium text-[#ecb100]">
            ₹{totalAmount}
          </span>
        </div>
      )}

      <BookingStep
        index={startIndex}
        title="Route & Schedule"
        summary={routeSummary}
        isOpen={openStep === startIndex}
        isDone={routeDone}
        onToggle={() => setOpenStep(openStep === startIndex ? 0 : startIndex)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Pickup Location" value={form.pickup} onChange={(e) => updateField("pickup", e.target.value)} aria-label="Pickup Location" />
          {rideMode === "local" ? (
            <Input placeholder="City / Area for Local Travel" value={form.drop} onChange={(e) => updateField("drop", e.target.value)} aria-label="City or Area for Local Travel" />
          ) : (
            <Input placeholder="Drop Location" value={form.drop} onChange={(e) => updateField("drop", e.target.value)} aria-label="Drop Location" />
          )}

          <BookingDatePicker placeholder="Pickup Date" value={pickupDate} onChange={setPickupDate} />
          <BookingTimePicker placeholder="Pickup Time" value={pickupTime} onChange={setPickupTime} />

          {rideMode === "round" && (
            <>
              <BookingDatePicker placeholder="Return Date" value={returnDate} onChange={setReturnDate} />
              <BookingTimePicker placeholder="Return Time" value={returnTime} onChange={setReturnTime} />
            </>
          )}

          {rideMode === "local" && (
            <Select value={form.duration} onValueChange={(value) => updateField("duration", value)}>
              <SelectTrigger aria-label="Select Duration" className="h-12 bg-[#111] border-[#252525] text-white">
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 Hours</SelectItem>
                <SelectItem value="8">8 Hours</SelectItem>
                <SelectItem value="12">12 Hours</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpenStep(startIndex + 1)}
          className="mt-3 w-full rounded-xl bg-[#ecb100]/10 py-2 text-xs font-semibold text-[#ecb100] hover:bg-[#ecb100]/15"
        >
          Continue
        </button>
      </BookingStep>

      <BookingStep
        index={startIndex + 1}
        title="Your Details"
        summary={form.name ? `${form.name}${form.persons ? " · " + form.persons : ""}` : undefined}
        isOpen={openStep === startIndex + 1}
        isDone={detailsDone}
        onToggle={() => setOpenStep(openStep === startIndex + 1 ? 0 : startIndex + 1)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Full Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} aria-label="Full Name" />
          <Input placeholder="Mobile Number" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} aria-label="Mobile Number" />
          <Input placeholder="Email Address" value={form.email} onChange={(e) => updateField("email", e.target.value)} aria-label="Email Address" />

          <Select value={form.persons} onValueChange={(value) => updateField("persons", value)}>
            <SelectTrigger aria-label="Number of Passengers" className="h-12 bg-[#111] border-[#252525] text-white">
              <SelectValue placeholder="Passengers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">1-3 Persons</SelectItem>
              <SelectItem value="4-7">4-7 Persons</SelectItem>
              <SelectItem value="8+">8+ Persons</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <textarea
          placeholder="Special Requirements"
          value={form.requirements}
          onChange={(e) => updateField("requirements", e.target.value)}
          aria-label="Special Requirements"
          className="mt-3 min-h-24 w-full rounded-xl border border-[#252525] bg-[#111] p-4 text-white"
        />

        <button
          type="button"
          onClick={() => setOpenStep(startIndex + 2)}
          className="mt-3 w-full rounded-xl bg-[#ecb100]/10 py-2 text-xs font-semibold text-[#ecb100] hover:bg-[#ecb100]/15"
        >
          Continue
        </button>
      </BookingStep>

      <BookingStep
        index={startIndex + 2}
        title="Payment"
        isOpen={openStep === startIndex + 2}
        isDone={false}
        onToggle={() => setOpenStep(openStep === startIndex + 2 ? 0 : startIndex + 2)}
      >
        <PaymentMethodPicker
          totalAmount={totalAmount}
          paymentType={paymentType}
          onPaymentTypeChange={setPaymentType}
          partialAmount={partialAmount}
          onPartialAmountChange={setPartialAmount}
          onScreenshotChange={setScreenshot}
        />

        <Button onClick={submitBooking} disabled={loading} className="mt-4 h-12 w-full rounded-xl bg-[#ecb100] text-black hover:bg-[#f6c94c]">
          {loading ? "Processing..." : "Submit Taxi Booking"}
        </Button>
      </BookingStep>

      <BookingSuccess open={success} onClose={reset} bookingId={bookingId} totalAmount={paymentSummary?.total} amountPaid={paymentSummary?.paid} />
    </div>
  );
}