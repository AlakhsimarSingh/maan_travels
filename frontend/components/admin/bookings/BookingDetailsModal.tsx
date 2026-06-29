"use client";

import { useEffect, useState } from "react";
import { X, Phone, Mail } from "lucide-react";

import { PaymentScreenshot } from "@/components/admin/PaymentScreenshot";
import { updatePaymentStatus } from "@/src/services/bookingAdminService";

const paymentStatusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  verified: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
  not_required: "bg-gray-500/10 text-gray-400",
};

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function BookingDetailsModal({
  booking,
  open,
  onClose,
  onBookingUpdate,
}: {
  booking: any;
  open: boolean;
  onClose: () => void;
  onBookingUpdate?: () => void;
}) {
  const [paymentStatus, setPaymentStatus] = useState(booking?.paymentStatus || "pending");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setPaymentStatus(booking?.paymentStatus || "pending");
  }, [booking?.id, booking?.paymentStatus]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !booking) return null;

  const balance = (booking.totalAmount || 0) - (booking.amountPaid || 0);
  const isUnpaidOnPaper =
    (booking.paymentType === "full" || booking.paymentType === "partial") &&
    booking.totalAmount != null &&
    balance > 0;

  const handlePaymentStatusChange = async (status: string) => {
    setUpdating(true);
    try {
      const res = await updatePaymentStatus(booking.id, status);
      if (res?.success) {
        setPaymentStatus(status);
        onBookingUpdate?.();
      }
    } catch (err) {
      console.error("Payment status update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {/* ── MOBILE: slide-up sheet ── */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Sheet: starts at 8vh, bottom padding clears the 64px bottom nav */}
        <div className="fixed inset-x-0 bottom-0 top-[8vh] z-50 flex flex-col rounded-t-3xl border-t border-[#252525] bg-[#141414] text-white">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="h-1 w-10 rounded-full bg-[#333]" />
          </div>
          {/* Sticky header */}
          <ModalHeader booking={booking} onClose={onClose} statusColor={statusColor} />
          {/* Scrollable content — pb-20 clears the bottom nav */}
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 space-y-3">
            <ModalContent
              booking={booking}
              balance={balance}
              isUnpaidOnPaper={isUnpaidOnPaper}
              paymentStatus={paymentStatus}
              paymentStatusColor={paymentStatusColor}
              handlePaymentStatusChange={handlePaymentStatusChange}
              updating={updating}
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP: centered dialog ── */}
      <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Modal */}
        <div className="relative z-10 flex flex-col w-full max-w-2xl max-h-[88vh] rounded-2xl border border-[#252525] bg-[#141414] text-white shadow-2xl">
          {/* Sticky header */}
          <ModalHeader booking={booking} onClose={onClose} statusColor={statusColor} />
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 pb-6">
            <ModalContent
              booking={booking}
              balance={balance}
              isUnpaidOnPaper={isUnpaidOnPaper}
              paymentStatus={paymentStatus}
              paymentStatusColor={paymentStatusColor}
              handlePaymentStatusChange={handlePaymentStatusChange}
              updating={updating}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Shared header ──────────────────────────────────────────────
function ModalHeader({
  booking,
  onClose,
  statusColor,
}: {
  booking: any;
  onClose: () => void;
  statusColor: Record<string, string>;
}) {
  return (
    <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-[#1c1c1c] shrink-0">
      <div>
        <h2 className="text-[17px] font-bold">Booking Details</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-[#8a8a8a] capitalize">{booking.serviceType}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${
              statusColor[booking.status] || "bg-gray-500/10 text-gray-400"
            }`}
          >
            {booking.status}
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-xl p-2 hover:bg-[#252525] active:bg-[#2a2a2a] transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// ── Shared body content ────────────────────────────────────────
function ModalContent({
  booking,
  balance,
  isUnpaidOnPaper,
  paymentStatus,
  paymentStatusColor,
  handlePaymentStatusChange,
  updating,
}: {
  booking: any;
  balance: number;
  isUnpaidOnPaper: boolean;
  paymentStatus: string;
  paymentStatusColor: Record<string, string>;
  handlePaymentStatusChange: (s: string) => void;
  updating: boolean;
}) {
  return (
    <>
      {/* CUSTOMER */}
      <Section title="Customer">
        <p className="text-[15px] font-semibold text-white">{booking.customer?.name}</p>
        <div className="mt-2 flex flex-col gap-2">
          <a
            href={`tel:${booking.customer?.phone}`}
            className="flex items-center gap-2.5 rounded-xl border border-[#252525] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white active:bg-[#1a1a1a]"
          >
            <Phone size={14} className="text-[#ecb100]" />
            {booking.customer?.phone}
          </a>
          {booking.customer?.email && (
            <a
              href={`mailto:${booking.customer?.email}`}
              className="flex items-center gap-2.5 rounded-xl border border-[#252525] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white active:bg-[#1a1a1a]"
            >
              <Mail size={14} className="text-[#ecb100]" />
              {booking.customer?.email}
            </a>
          )}
        </div>
      </Section>

      {/* BOOKING INFO */}
      <Section title="Booking Info">
        <Detail label="Vehicle" value={booking.vehicle?.name} />
        <Detail label="Route" value={booking.route?.title} />
        <Detail
          label="Created"
          value={new Date(booking.createdAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      </Section>

      {/* PAYMENT */}
      <Section title="Payment">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <AmountChip label="Total" value={booking.totalAmount} />
          <AmountChip label="Paid" value={booking.amountPaid} highlight />
          <AmountChip label="Balance" value={balance > 0 ? balance : 0} danger={balance > 0} />
        </div>

        <Detail label="Payment Type" value={booking.paymentType} />

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#8a8a8a]">Payment Status</span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs capitalize ${
              paymentStatusColor[paymentStatus] || "bg-gray-500/10 text-gray-400"
            }`}
          >
            {paymentStatus}
          </span>
        </div>

        {isUnpaidOnPaper && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-400">
            Claimed "{booking.paymentType}" but ₹{balance} still unaccounted — verify screenshot carefully.
          </div>
        )}

        {booking.paymentScreenshot ? (
          <div className="pt-2">
            <PaymentScreenshot bookingId={booking.id} />
          </div>
        ) : (
          (booking.paymentType === "full" || booking.paymentType === "partial") && (
            <p className="text-xs text-red-400">
              No screenshot on file despite a {booking.paymentType} payment claim.
            </p>
          )
        )}
      </Section>

      {/* SERVICE-SPECIFIC */}
      {booking.taxi && (
        <Section title="Taxi Details">
          <Detail label="Mode" value={booking.taxi.rideMode} />
          <Detail label="Pickup" value={booking.taxi.pickup} />
          <Detail label="Drop" value={booking.taxi.drop || "-"} />
          <Detail label="Vehicle" value={booking.taxi.vehicle} />
          <Detail
            label="Travel Date"
            value={booking.taxi.travelDate ? new Date(booking.taxi.travelDate).toLocaleDateString("en-IN") : "-"}
          />
        </Section>
      )}

      {booking.airport && (
        <Section title="Airport Transfer">
          <Detail label="Pickup" value={booking.airport.pickup} />
          <Detail label="Airport" value={booking.airport.airport} />
          <Detail label="Terminal" value={booking.airport.terminal || "-"} />
          <Detail label="Travel Date" value={new Date(booking.airport.travelDate).toLocaleDateString("en-IN")} />
          <Detail label="Time" value={booking.airport.pickupTime} />
          <Detail label="Vehicle" value={booking.airport.vehicle} />
          <Detail label="Passengers" value={booking.airport.passengers} />
          <Detail label="Suitcases" value={booking.airport.suitcases} />
          <Detail label="Handbags" value={booking.airport.handbags} />
        </Section>
      )}

      {booking.tour && (
        <Section title="Tour Details">
          <Detail label="Pickup City" value={booking.tour.pickupCity} />
          <Detail label="Destination" value={booking.tour.destination} />
          <Detail label="Route" value={booking.tour.route} />
          <Detail label="Pickup Address" value={booking.tour.pickupAddress} />
          {booking.tour.travelDate && (
            <Detail
              label="Travel Date"
              value={new Date(booking.tour.travelDate).toLocaleString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            />
          )}
        </Section>
      )}

      {booking.selfDrive && (
        <Section title="Self Drive">
          <Detail label="Vehicle" value={booking.selfDrive.vehicle?.name} />
          <Detail label="Pickup Date" value={new Date(booking.selfDrive.pickupDate).toLocaleDateString("en-IN")} />
          <Detail label="Return Date" value={new Date(booking.selfDrive.returnDate).toLocaleDateString("en-IN")} />
          <Detail label="License" value={booking.selfDrive.license} />
        </Section>
      )}

      {booking.luxury && (
        <Section title="Luxury Car">
          <Detail label="Vehicle" value={booking.luxury.luxuryCar?.name} />
          <Detail label="Pickup" value={booking.luxury.pickup} />
          <Detail label="Destination" value={booking.luxury.destination} />
          <Detail label="Event Date" value={new Date(booking.luxury.eventDate).toLocaleDateString("en-IN")} />
          <Detail label="Hours" value={booking.luxury.hours} />
          <Detail label="Event Type" value={booking.luxury.eventType} />
        </Section>
      )}

      {booking.wedding && (
        <Section title="Wedding Car">
          <Detail label="Vehicle" value={booking.wedding.luxuryCar?.name} />
          <Detail label="Pickup" value={booking.wedding.pickup} />
          <Detail label="Venue" value={booking.wedding.venue} />
          <Detail label="Wedding Date" value={new Date(booking.wedding.weddingDate).toLocaleDateString("en-IN")} />
          <Detail label="Guests" value={booking.wedding.guests} />
          <Detail label="Cars Required" value={booking.wedding.carsRequired} />
          <Detail label="Decoration" value={booking.wedding.decoration || "-"} />
        </Section>
      )}

      {booking.tempo && (
        <Section title="Tempo / Urbania">
          <Detail label="Vehicle" value={booking.tempo.vehicle?.name} />
          <Detail label="Pickup" value={booking.tempo.pickup} />
          <Detail label="Destination" value={booking.tempo.destination} />
          <Detail label="Travel Date" value={new Date(booking.tempo.travelDate).toLocaleDateString("en-IN")} />
          <Detail label="Passengers" value={booking.tempo.passengers} />
          <Detail label="Suitcases" value={booking.tempo.suitcaseCount} />
          <Detail label="Trip Type" value={booking.tempo.tripType} />
        </Section>
      )}

      {/* REQUIREMENTS */}
      {(booking.requirements ||
        booking.taxi?.requirements ||
        booking.tour?.requirements ||
        booking.selfDrive?.requirements ||
        booking.luxury?.requirements ||
        booking.wedding?.requirements ||
        booking.tempo?.requirements) && (
        <Section title="Requirements">
          <p className="text-sm text-[#c7c7c7] leading-relaxed">
            {booking.requirements ||
              booking.taxi?.requirements ||
              booking.tour?.requirements ||
              booking.selfDrive?.requirements ||
              booking.luxury?.requirements ||
              booking.wedding?.requirements ||
              booking.tempo?.requirements}
          </p>
        </Section>
      )}
    </>
  );
}

// ── Primitives ─────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-4">
      <p className="mb-3 text-[10px] uppercase tracking-widest text-[#ecb100]">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-[#8a8a8a] shrink-0">{label}</span>
      <span className="text-sm text-right break-words max-w-[60%]">{value ?? "-"}</span>
    </div>
  );
}

function AmountChip({ label, value, highlight, danger }: {
  label: string; value: any; highlight?: boolean; danger?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-3 text-center ${
      highlight ? "border-[#ecb100]/20 bg-[#ecb100]/5"
      : danger ? "border-red-500/20 bg-red-500/5"
      : "border-[#1c1c1c] bg-[#0f0f0f]"
    }`}>
      <p className="text-[10px] text-[#555] mb-1">{label}</p>
      <p className={`text-sm font-semibold ${
        highlight ? "text-[#ecb100]" : danger ? "text-red-400" : "text-white"
      }`}>
        {value != null ? `₹${Number(value).toLocaleString("en-IN")}` : "-"}
      </p>
    </div>
  );
}