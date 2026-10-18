"use client";

import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  CalendarDays,
  MapPin,
  MessageSquareText,
  Lock,
  ArrowRight,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import BookingSuccess from "@/components/common/BookingSuccess";
import PaymentMethodPicker, { PaymentType } from "./PaymentMethodPicker";
import BookingStep from "./BookingStep";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { API_URL } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";
import { EmailInput, PhoneInput } from "@/components/common/ContactInputs";
import { DEFAULT_PHONE_PREFIX, isValidPhone, validateEmail, validatePhone } from "@/src/lib/contactValidation";

type Location = { id: string; name: string };

function FieldLabel({
  icon: Icon,
  children,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-white/40 pl-0.5">
      {Icon && <Icon size={11} className="text-[#ecb100]/70" />}
      {children}
    </label>
  );
}

const fieldClass =
  "h-11 pl-9 bg-[#111] border-[#252525] text-white placeholder:text-white/25 focus-visible:border-[#ecb100] focus-visible:ring-[#ecb100]/15 focus-visible:ring-[2px]";

export default function TourBookingForm({
  routeId,
  vehicleId,
  price,
  pickup: prefillPickupCity,
  destination: prefillDestination,
  locked = false,
  startIndex = 1,
}: {
  routeId?: string;
  vehicleId?: string;
  price?: number;
  pickup?: string;
  destination?: string;
  locked?: boolean;
  startIndex?: number;
}) {
  const [pickupLocations, setPickupLocations] = useState<Location[]>([]);
  const [dropLocations, setDropLocations] = useState<Location[]>([]);
  const [openStep, setOpenStep] = useState(startIndex);

  const [form, setForm] = useState({
    name: "",
    phone: DEFAULT_PHONE_PREFIX,
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
  const [showContactErrors, setShowContactErrors] = useState(false);

  const { success, bookingId, done, reset } = useBookingStatus();

  const totalAmount = vehicleId ? price || 0 : 0;
  const priceUnconfirmed = totalAmount <= 0;

  useEffect(() => {
    if (priceUnconfirmed && paymentType !== "later") {
      setPaymentType("later");
    }
  }, [priceUnconfirmed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (locked) return;

    const fetchLocations = async () => {
      try {
        const [pickupRes, dropRes] = await Promise.all([
          fetch(`${API_URL}/api/locations/pickup`),
          fetch(`${API_URL}/api/locations/drop`),
        ]);
        const [pickupData, dropData] = await Promise.all([pickupRes.json(), dropRes.json()]);
        setPickupLocations(pickupData.locations || []);
        setDropLocations(dropData.locations || []);
      } catch (error) {
        console.log("Location fetch failed", error);
      }
    };

    fetchLocations();
  }, [locked]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitBooking = async () => {
    const contactError = validatePhone(form.phone) || validateEmail(form.email, { required: false });
    if (contactError) {
      setShowContactErrors(true);
      setOpenStep(startIndex + 1);
      alert(contactError);
      return;
    }

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
        setForm({
          name: "",
          phone: DEFAULT_PHONE_PREFIX,
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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const routeDone = !!((locked ? form.pickupAddress : form.pickupCity && form.destination) && form.travelDate);
  const detailsDone = !!(form.name && isValidPhone(form.phone));
  const routeSummary = form.pickupCity && form.destination ? `${form.pickupCity} → ${form.destination}` : undefined;

  return (
    <div className="space-y-2.5">
      {totalAmount > 0 && (
        <div className="relative overflow-hidden rounded-xl border border-[#ecb100]/25 bg-gradient-to-r from-[#ecb100]/[0.08] via-[#ecb100]/[0.04] to-transparent px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/45">Estimated Price</p>
            <p className="text-[11px] text-white/30 mt-0.5">For this route &amp; vehicle</p>
          </div>
          <span style={{ fontFamily: "var(--font-geist-mono)" }} className="text-2xl font-semibold text-[#ecb100] tabular-nums">
            ₹{totalAmount}
          </span>
        </div>
      )}

      <BookingStep
        index={startIndex}
        title="Route & Date"
        summary={routeSummary}
        isOpen={openStep === startIndex}
        isDone={routeDone}
        onToggle={() => setOpenStep(openStep === startIndex ? 0 : startIndex)}
      >
        {locked ? (
          <div className="relative overflow-hidden rounded-xl border border-[#ecb100]/35 bg-gradient-to-br from-[#1c1608] to-[#111] px-4 py-4">
            <span className="absolute left-0 top-0 h-full w-[3px] bg-[#ecb100]" />

            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#ecb100]/80">Fixed Route</span>
              <span className="flex items-center gap-1 text-[11px] text-white/35">
                <Lock size={11} /> Locked
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="relative w-[7px] h-[7px] rounded-full bg-[#ecb100] flex-shrink-0">
                <span className="route-dot-pulse" />
              </span>
              <span className="route-line" />
              <span className="w-[7px] h-[7px] rounded-full border-[1.5px] border-[#ecb100] flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] text-white/35 uppercase tracking-wide mb-0.5">Pickup</p>
                <p className="text-[15px] font-medium text-white truncate">{form.pickupCity || "—"}</p>
              </div>
              <ArrowRight size={14} className="text-[#ecb100]/50 flex-shrink-0" />
              <div className="min-w-0 text-right">
                <p className="text-[10px] text-white/35 uppercase tracking-wide mb-0.5">Destination</p>
                <p className="text-[15px] font-medium text-white truncate">{form.destination || "—"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <FieldLabel icon={MapPin}>Pickup City</FieldLabel>
              <Select value={form.pickupCity} onValueChange={(value) => updateField("pickupCity", value)}>
                <SelectTrigger aria-label="Pickup City" className="h-11 bg-[#111] border-[#252525] text-white focus:border-[#ecb100]">
                  <SelectValue placeholder="Select pickup city" />
                </SelectTrigger>
                <SelectContent>
                  {pickupLocations.map((l) => (
                    <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel icon={MapPin}>Destination</FieldLabel>
              <Select value={form.destination} onValueChange={(value) => updateField("destination", value)}>
                <SelectTrigger aria-label="Destination" className="h-11 bg-[#111] border-[#252525] text-white focus:border-[#ecb100]">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {dropLocations.map((l) => (
                    <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={CalendarDays}>Travel Date</FieldLabel>
            <div className="relative">
              <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
              <input
                type="date"
                min={minDate}
                value={form.travelDate}
                onChange={(e) => updateField("travelDate", e.target.value)}
                aria-label="Travel Date"
                className="w-full h-11 rounded-xl border border-[#252525] bg-[#111] pl-9 pr-3 text-white text-sm outline-none focus:border-[#ecb100] focus:ring-[2px] focus:ring-[#ecb100]/15 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={MapPin}>{locked ? "Exact Pickup Address" : "Pickup Address"}</FieldLabel>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <Input
                placeholder={locked ? "House no., street, landmark" : "Pickup Address"}
                value={form.pickupAddress}
                onChange={(e) => updateField("pickupAddress", e.target.value)}
                className={fieldClass}
                aria-label={locked ? "Exact Pickup Address" : "Pickup Address"}
              />
            </div>
          </div>
        </div>

        {!locked && (
          <div className="mt-3 rounded-xl border border-[#252525] bg-[#111] px-4 py-3 text-[#c7c7c7] text-sm">
            {form.pickupCity && form.destination ? `Route: ${form.pickupCity} → ${form.destination}` : "Route will be generated automatically"}
          </div>
        )}

        <button type="button" onClick={() => setOpenStep(startIndex + 1)} className="mt-3 w-full rounded-xl bg-[#ecb100]/10 py-2 text-xs font-semibold text-[#ecb100] hover:bg-[#ecb100]/15">
          Continue
        </button>
      </BookingStep>

      <BookingStep
        index={startIndex + 1}
        title="Your Details"
        summary={form.name || undefined}
        isOpen={openStep === startIndex + 1}
        isDone={detailsDone}
        onToggle={() => setOpenStep(openStep === startIndex + 1 ? 0 : startIndex + 1)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <FieldLabel icon={User}>Full Name</FieldLabel>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <Input placeholder="As per ID" value={form.name} onChange={(e) => updateField("name", e.target.value)} className={fieldClass} aria-label="Full Name" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={Phone}>Mobile Number</FieldLabel>
            <PhoneInput
              icon={<Phone size={15} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-white/25" />}
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
              showError={showContactErrors}
              className={fieldClass}
              aria-label="Mobile Number"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={Mail}>Email Address</FieldLabel>
            <EmailInput
              icon={<Mail size={15} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-white/25" />}
              placeholder="you@example.com"
              value={form.email}
              onChange={(v) => updateField("email", v)}
              showError={showContactErrors}
              className={fieldClass}
              aria-label="Email Address"
            />
          </div>
        </div>

        <button type="button" onClick={() => setOpenStep(startIndex + 2)} className="mt-3 w-full rounded-xl bg-[#ecb100]/10 py-2 text-xs font-semibold text-[#ecb100] hover:bg-[#ecb100]/15">
          Continue
        </button>
      </BookingStep>

      <BookingStep
        index={startIndex + 2}
        title="Notes & Payment"
        isOpen={openStep === startIndex + 2}
        isDone={false}
        onToggle={() => setOpenStep(openStep === startIndex + 2 ? 0 : startIndex + 2)}
      >
        <div className="flex flex-col gap-1.5">
          <FieldLabel icon={MessageSquareText}>Special Requirements (optional)</FieldLabel>
          <textarea
            placeholder="Anything we should know — extra stops, luggage, accessibility needs..."
            value={form.requirements}
            onChange={(e) => updateField("requirements", e.target.value)}
            aria-label="Special Requirements"
            className="min-h-24 rounded-xl border border-[#252525] bg-[#111] p-4 text-white text-sm placeholder:text-white/25 outline-none focus:border-[#ecb100] focus:ring-[2px] focus:ring-[#ecb100]/15"
          />
        </div>

        <div className="mt-3">
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
          className="mt-4 h-12 w-full bg-[#ecb100] text-black font-medium text-[15px] hover:bg-[#f6c94c] gap-2"
        >
          {loading ? "Processing..." : <>Book Your Tour <ArrowRight size={16} /></>}
        </Button>
      </BookingStep>

      <BookingSuccess open={success} onClose={reset} bookingId={bookingId} totalAmount={paymentSummary?.total} amountPaid={paymentSummary?.paid} />
    </div>
  );
}