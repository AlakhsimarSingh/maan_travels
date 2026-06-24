"use client";

import {
  MapPin,
  Phone,
  User,
  MessageSquare,
  ArrowRight,
  Check,
  Route as RouteIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { createTourBooking } from "@/src/services/bookingService";
import { useBookingStatus } from "@/src/hooks/useBookingStatus";

const STEPS = [
  { key: "route", label: "Route" },
  { key: "details", label: "Your Details" },
  { key: "confirmed", label: "Confirmed" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export default function TourBookingCard({
  pickup,
  destination,
}: {
  pickup: string;
  destination: string;
}) {
  const hasRoute = !!(pickup && destination);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickupAddress: "",
    requirements: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState("");

  const { loading, success, bookingId, start, done, reset } = useBookingStatus();

  // The step is DERIVED from state, not manually set — this keeps the
  // progress bar always honest about where the user actually is, rather
  // than risking it drifting out of sync with a separately-tracked value.
  const currentStep: StepKey = success ? "confirmed" : hasRoute ? "details" : "route";
  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  // Track the previous step so we can animate the direction of travel
  const [prevStepIndex, setPrevStepIndex] = useState(currentStepIndex);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  useEffect(() => {
    if (currentStepIndex !== prevStepIndex) {
      setDirection(currentStepIndex > prevStepIndex ? "forward" : "back");
      setPrevStepIndex(currentStepIndex);
    }
  }, [currentStepIndex, prevStepIndex]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const submitBooking = async () => {
    if (!hasRoute) {
      setFormError("Select a pickup city and destination above first.");
      return;
    }

    if (!form.name || !form.phone || !form.pickupAddress) {
      setTouched({ name: true, phone: true, pickupAddress: true });
      setFormError("Please fill in your name, phone, and pickup address.");
      return;
    }

    setFormError("");

    try {
      start();

      const res = await createTourBooking({
        name: form.name,
        phone: form.phone,
        pickupCity: pickup,
        destination,
        route: `${pickup} → ${destination}`,
        pickupAddress: form.pickupAddress,
        requirements: form.requirements,
      });

      if ((res as any)?.success === false) {
        setFormError((res as any)?.message || "Couldn't submit your request.");
        reset();
        return;
      }

      done((res as any)?.booking?.id);

      setForm({ name: "", phone: "", pickupAddress: "", requirements: "" });
      setTouched({});
    } catch (error) {
      console.log(error);
      setFormError("Couldn't reach the server. Please try again.");
      reset();
    }
  };

  const fieldError = (field: string, value: string) => touched[field] && !value;

  return (
    <div className="mx-auto max-w-3xl px-6">
      <div className="overflow-hidden rounded-3xl border border-[#252525] bg-[#141414] shadow-2xl">
        {/* PROGRESS BAR */}
        <StepProgress currentIndex={currentStepIndex} />

        {/* ROUTE HEADER */}
        <div className="border-b border-[#252525] bg-gradient-to-r from-[#ecb100]/10 via-transparent to-transparent px-8 py-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#ecb100]">
            Book your tour
          </p>

          <h2 className="mt-3 flex flex-wrap items-center gap-2 text-2xl font-bold text-white">
            {hasRoute ? (
              <>
                <span>{pickup}</span>
                <ArrowRight size={20} className="text-[#ecb100]" />
                <span>{destination}</span>
              </>
            ) : (
              <span className="text-white/40">Select your route above</span>
            )}
          </h2>
        </div>

        {/* STEP CONTENT — animated cross-fade + slide between steps */}
        <div className="relative overflow-hidden">
          <div
            key={currentStep}
            className={direction === "forward" ? "step-enter-forward" : "step-enter-back"}
          >
            {currentStep === "route" && <RouteStepEmptyState />}

            {currentStep === "details" && (
              <div className="p-8">
                <div className="space-y-5">
                  <FormInput
                    icon={<User size={18} />}
                    placeholder="Full name"
                    value={form.name}
                    onChange={(v) => updateField("name", v)}
                    onBlur={() => markTouched("name")}
                    error={fieldError("name", form.name)}
                  />

                  <FormInput
                    icon={<Phone size={18} />}
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(v) => updateField("phone", v)}
                    onBlur={() => markTouched("phone")}
                    error={fieldError("phone", form.phone)}
                  />

                  <FormInput
                    icon={<MapPin size={18} />}
                    placeholder="Pickup address"
                    value={form.pickupAddress}
                    onChange={(v) => updateField("pickupAddress", v)}
                    onBlur={() => markTouched("pickupAddress")}
                    error={fieldError("pickupAddress", form.pickupAddress)}
                  />
                </div>

                <div className="relative mt-5">
                  <MessageSquare
                    size={16}
                    className="pointer-events-none absolute left-4 top-4 text-[#ecb100]"
                  />
                  <textarea
                    placeholder="Special requirements (optional)"
                    value={form.requirements}
                    onChange={(e) => updateField("requirements", e.target.value)}
                    className="
                      min-h-28 w-full rounded-xl border border-[#252525] bg-black/40
                      p-4 pl-11 text-white outline-none transition-colors
                      focus:border-[#ecb100]
                    "
                  />
                </div>

                {formError && (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                    {formError}
                  </div>
                )}

                <Button
                  disabled={loading}
                  onClick={submitBooking}
                  className="
                    group mt-6 h-13 w-full rounded-xl bg-[#ecb100] py-3.5
                    text-base font-semibold text-black transition-all duration-200
                    hover:bg-[#f6c94c] hover:shadow-[0_8px_24px_-8px_rgba(236,177,0,0.4)]
                    active:scale-[0.99] disabled:opacity-60
                  "
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Sending request..." : "Request quote"}
                    {!loading && (
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    )}
                  </span>
                </Button>

                <p className="mt-3 text-center text-xs text-white/30">
                  Our team will get back to you with pricing and itinerary details.
                </p>
              </div>
            )}

            {currentStep === "confirmed" && (
              <ConfirmedStep
                pickup={pickup}
                destination={destination}
                bookingId={bookingId}
                onBookAnother={reset}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PROGRESS BAR ---------------- */
function StepProgress({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="bg-black/40 px-8 pt-6 pb-5">
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const isComplete = i < currentIndex;
          const isActive = i === currentIndex;

          return (
            <div key={step.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-500 ${
                    isComplete
                      ? "border-[#ecb100] bg-[#ecb100] text-black"
                      : isActive
                      ? "border-[#ecb100] bg-[#ecb100]/10 text-[#ecb100] scale-110 shadow-[0_0_0_4px_rgba(236,177,0,0.15)]"
                      : "border-[#2a2a2a] bg-black/30 text-[#555]"
                  }`}
                >
                  {isComplete ? (
                    <Check size={16} className="step-check-pop" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium uppercase tracking-wide transition-colors duration-300 ${
                    isActive ? "text-[#ecb100]" : isComplete ? "text-white/70" : "text-[#555]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="mx-2 h-[2px] flex-1 overflow-hidden rounded-full bg-[#2a2a2a]">
                  <div
                    className="h-full bg-[#ecb100] transition-all duration-700 ease-out"
                    style={{ width: isComplete ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- STEP 1: ROUTE EMPTY STATE ---------------- */
function RouteStepEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#252525] bg-black/40 text-[#ecb100]">
        <RouteIcon size={22} />
      </div>
      <p className="text-white/70">
        Pick a pickup city and destination above to continue.
      </p>
    </div>
  );
}

/* ---------------- STEP 3: CONFIRMED ---------------- */
function ConfirmedStep({
  pickup,
  destination,
  bookingId,
  onBookAnother,
}: {
  pickup: string;
  destination: string;
  bookingId?: string;
  onBookAnother: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-8 py-14 text-center">
      <div className="step-check-pop flex h-16 w-16 items-center justify-center rounded-full bg-[#ecb100] text-black">
        <Check size={28} strokeWidth={3} />
      </div>

      <h3 className="text-2xl font-bold text-white">Request received!</h3>

      <p className="max-w-sm text-sm text-white/60">
        We've received your tour request for{" "}
        <span className="text-white">
          {pickup} → {destination}
        </span>
        . Our team will reach out shortly with pricing and itinerary details.
      </p>

      {bookingId && (
        <p className="rounded-full border border-[#252525] bg-black/40 px-4 py-1.5 text-xs text-white/40">
          Reference ID: {bookingId}
        </p>
      )}

      <Button
        onClick={onBookAnother}
        variant="outline"
        className="mt-2 border-[#252525] text-white hover:bg-white/5"
      >
        Plan another trip
      </Button>
    </div>
  );
}

/* ---------------- INPUT ---------------- */
function FormInput({
  icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]">
        {icon}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`
          h-12 w-full rounded-xl border bg-black/40 pl-12 pr-4
          text-white outline-none transition-colors
          ${error ? "border-red-500/60" : "border-[#252525] focus:border-[#ecb100]"}
        `}
      />
    </div>
  );
}