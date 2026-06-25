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

/* ── Small shared field chrome — keeps every input speaking the same
   visual language (label, icon, dark fill, gold focus) instead of
   mixing styled and unstyled inputs. ── */

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

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-2.5 mt-1 first:mt-0">
      <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#ecb100]/85 whitespace-nowrap">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#252525]" />
    </div>
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

  // No RoutePricing exists for this route+vehicle combo — there's nothing
  // to pay against yet. PaymentMethodPicker already hides the full/partial/
  // later buttons in this case, but we also force the type back to
  // "later" here as a safety net so a stale "full"/"partial" selection
  // can never be submitted once price drops to unconfirmed.
  const priceUnconfirmed = totalAmount <= 0;

  useEffect(() => {
    if (priceUnconfirmed && paymentType !== "later") {
      onPaymentTypeReset();
    }
  }, [priceUnconfirmed]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPaymentTypeReset = () => setPaymentType("later");

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
    <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">

      {/* ── Price banner ── */}
      {totalAmount > 0 && (
        <div className="sm:col-span-2 relative overflow-hidden rounded-xl border border-[#ecb100]/25 bg-gradient-to-r from-[#ecb100]/[0.08] via-[#ecb100]/[0.04] to-transparent px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/45">
              Estimated Price
            </p>
            <p className="text-[11px] text-white/30 mt-0.5">For this route &amp; vehicle</p>
          </div>
          <span
            style={{ fontFamily: "var(--font-geist-mono)" }}
            className="text-2xl font-semibold text-[#ecb100] tabular-nums"
          >
            ₹{totalAmount}
          </span>
        </div>
      )}

      {/* ── Your details ── */}
      <SectionHeader label="Your Details" />

      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <FieldLabel icon={User}>Full Name</FieldLabel>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <Input
            placeholder="As per ID"
            value={form.name}
            onChange={e => updateField("name", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel icon={Phone}>Mobile Number</FieldLabel>
        <div className="relative">
          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <Input
            placeholder="10-digit number"
            value={form.phone}
            onChange={e => updateField("phone", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel icon={Mail}>Email Address</FieldLabel>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <Input
            placeholder="you@example.com"
            value={form.email}
            onChange={e => updateField("email", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      {/* ── Trip details ── */}
      <SectionHeader label="Trip Details" />

      {locked ? (
        /* Fixed-route summary — mirrors the route-line motif from the
           route card this booking started from, so it reads as the same
           route rather than a generic locked field. */
        <div className="sm:col-span-2 relative overflow-hidden rounded-xl border border-[#ecb100]/35 bg-gradient-to-br from-[#1c1608] to-[#111] px-4 py-4">
          <span className="absolute left-0 top-0 h-full w-[3px] bg-[#ecb100]" />

          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#ecb100]/80">
              Fixed Route
            </span>
            <span className="flex items-center gap-1 text-[11px] text-white/35">
              <Lock size={11} />
              Locked
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
              <p className="text-[15px] font-medium text-white truncate">
                {form.pickupCity || "—"}
              </p>
            </div>
            <ArrowRight size={14} className="text-[#ecb100]/50 flex-shrink-0" />
            <div className="min-w-0 text-right">
              <p className="text-[10px] text-white/35 uppercase tracking-wide mb-0.5">Destination</p>
              <p className="text-[15px] font-medium text-white truncate">
                {form.destination || "—"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={MapPin}>Pickup City</FieldLabel>
            <Select
              value={form.pickupCity}
              onValueChange={value => updateField("pickupCity", value)}
            >
              <SelectTrigger className="h-11 bg-[#111] border-[#252525] text-white focus:border-[#ecb100]">
                <SelectValue placeholder="Select pickup city" />
              </SelectTrigger>
              <SelectContent>
                {pickupLocations.map(l => (
                  <SelectItem key={l.id} value={l.name}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel icon={MapPin}>Destination</FieldLabel>
            <Select
              value={form.destination}
              onValueChange={value => updateField("destination", value)}
            >
              <SelectTrigger className="h-11 bg-[#111] border-[#252525] text-white focus:border-[#ecb100]">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {dropLocations.map(l => (
                  <SelectItem key={l.id} value={l.name}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div className="flex flex-col gap-1.5">
        <FieldLabel icon={CalendarDays}>Travel Date</FieldLabel>
        <div className="relative">
          <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="date"
            min={minDate}
            value={form.travelDate}
            onChange={e => updateField("travelDate", e.target.value)}
            className="w-full h-11 rounded-xl border border-[#252525] bg-[#111] pl-9 pr-3 text-white text-sm outline-none focus:border-[#ecb100] focus:ring-[2px] focus:ring-[#ecb100]/15 [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel icon={MapPin}>
          {locked ? "Exact Pickup Address" : "Pickup Address"}
        </FieldLabel>
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <Input
            placeholder={locked ? "House no., street, landmark" : "Pickup Address"}
            value={form.pickupAddress}
            onChange={e => updateField("pickupAddress", e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      {!locked && (
        <div className="sm:col-span-2 rounded-xl border border-[#252525] bg-[#111] px-4 py-3 text-[#c7c7c7] text-sm">
          {form.pickupCity && form.destination
            ? `Route: ${form.pickupCity} → ${form.destination}`
            : "Route will be generated automatically"}
        </div>
      )}

      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <FieldLabel icon={MessageSquareText}>Special Requirements (optional)</FieldLabel>
        <textarea
          placeholder="Anything we should know — extra stops, luggage, accessibility needs..."
          value={form.requirements}
          onChange={e => updateField("requirements", e.target.value)}
          className="min-h-28 rounded-xl border border-[#252525] bg-[#111] p-4 text-white text-sm placeholder:text-white/25 outline-none focus:border-[#ecb100] focus:ring-[2px] focus:ring-[#ecb100]/15"
        />
      </div>

      {/* ── Payment ── */}
      <SectionHeader label="Payment" />

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
        className="sm:col-span-2 h-12 bg-[#ecb100] text-black font-medium text-[15px] hover:bg-[#f6c94c] gap-2 mt-1"
      >
        {loading ? (
          "Processing..."
        ) : (
          <>
            Book Your Tour
            <ArrowRight size={16} />
          </>
        )}
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