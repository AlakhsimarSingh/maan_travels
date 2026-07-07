"use client";

import { useEffect, useState } from "react";
import {
  X, Phone, Mail, MessageCircle, Send, ShieldCheck,
  ShieldX, CheckCircle2, XCircle, Loader2, AlertTriangle,
} from "lucide-react";

import { PaymentScreenshot } from "@/components/admin/PaymentScreenshot";
import { updatePaymentStatus, updateBookingStatus } from "@/src/services/bookingAdminService";
import { API_URL } from "@/src/services/bookingService";

// ── Types ──────────────────────────────────────────────────────
const paymentStatusColor: Record<string, string> = {
  pending:      "bg-yellow-500/10 text-yellow-400",
  verified:     "bg-green-500/10 text-green-400",
  rejected:     "bg-red-500/10 text-red-400",
  not_required: "bg-gray-500/10 text-gray-400",
};
const statusColor: Record<string, string> = {
  pending:   "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

type NotifyResult = {
  emailSent: boolean;
  emailError: string | null;
  waLink: string | null;
  hasEmail: boolean;
  hasPhone: boolean;
};

// ── Main component ─────────────────────────────────────────────
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
  const [bookingStatus, setBookingStatus] = useState(booking?.status || "pending");
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyResult, setNotifyResult] = useState<NotifyResult | null>(null);
  const [notifyType, setNotifyType] = useState<string | null>(null);

  useEffect(() => {
    setPaymentStatus(booking?.paymentStatus || "pending");
    setBookingStatus(booking?.status || "pending");
    setNotifyResult(null);
    setNotifyType(null);
  }, [booking?.id, booking?.paymentStatus, booking?.status]);

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
    booking.totalAmount != null && balance > 0;

  // ── Handlers ──────────────────────────────────────────────────
  const handlePaymentStatusChange = async (status: string) => {
    setUpdatingPayment(true);
    try {
      const res = await updatePaymentStatus(booking.id, status);
      if (res?.success) {
        setPaymentStatus(status);
        onBookingUpdate?.();
      }
    } finally {
      setUpdatingPayment(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    setUpdatingStatus(true);
    try {
      const res = await updateBookingStatus(booking.id, status);
      if (res?.success) {
        setBookingStatus(status);
        onBookingUpdate?.();
        // Auto-trigger notify panel for meaningful status changes
        if (status === "confirmed" || status === "cancelled" || status === "completed") {
          const notifyMap: Record<string, string> = {
            confirmed: "confirmed",
            cancelled: "cancelled",
            completed: "completed",
          };
          setNotifyType(notifyMap[status]);
          setNotifyResult(null);
        }
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const sendNotification = async (type: string) => {
    setNotifyLoading(true);
    setNotifyResult(null);
    try {
      const res = await fetch(`${API_URL}/api/notify/${booking.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      setNotifyResult(data);
      setNotifyType(type);
    } catch {
      setNotifyResult({
        emailSent: false,
        emailError: "Request failed",
        waLink: null,
        hasEmail: false,
        hasPhone: false,
      });
    } finally {
      setNotifyLoading(false);
    }
  };

  const inner = (
    <ModalContent
      booking={booking}
      balance={balance > 0 ? balance : 0}
      isUnpaidOnPaper={isUnpaidOnPaper}
      paymentStatus={paymentStatus}
      bookingStatus={bookingStatus}
      updatingPayment={updatingPayment}
      updatingStatus={updatingStatus}
      notifyLoading={notifyLoading}
      notifyResult={notifyResult}
      notifyType={notifyType}
      onPaymentStatusChange={handlePaymentStatusChange}
      onStatusChange={handleStatusChange}
      onSendNotification={sendNotification}
      onSetNotifyType={setNotifyType}
    />
  );

  return (
    <>
      {/* ── MOBILE: slide-up sheet ── */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed inset-x-0 bottom-0 top-[5vh] z-50 flex flex-col rounded-t-3xl border-t border-[#252525] bg-[#141414] text-white">
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="h-1 w-10 rounded-full bg-[#333]" />
          </div>
          <ModalHeader booking={booking} bookingStatus={bookingStatus} onClose={onClose} />
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
            {inner}
          </div>
        </div>
      </div>

      {/* ── DESKTOP: centered dialog ── */}
      <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 flex flex-col w-full max-w-2xl max-h-[88vh] rounded-2xl border border-[#252525] bg-[#141414] text-white shadow-2xl">
          <ModalHeader booking={booking} bookingStatus={bookingStatus} onClose={onClose} />
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {inner}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Header ─────────────────────────────────────────────────────
function ModalHeader({ booking, bookingStatus, onClose }: any) {
  return (
    <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-[#1c1c1c] shrink-0">
      <div>
        <h2 className="text-[17px] font-bold">Booking Details</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-[#8a8a8a] capitalize">{booking.serviceType}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${statusColor[bookingStatus] || "bg-gray-500/10 text-gray-400"}`}>
            {bookingStatus}
          </span>
        </div>
      </div>
      <button onClick={onClose} className="rounded-xl p-2 hover:bg-[#252525] transition-colors">
        <X size={18} />
      </button>
    </div>
  );
}

// ── Body ───────────────────────────────────────────────────────
function ModalContent({
  booking, balance, isUnpaidOnPaper,
  paymentStatus, bookingStatus,
  updatingPayment, updatingStatus,
  notifyLoading, notifyResult, notifyType,
  onPaymentStatusChange, onStatusChange,
  onSendNotification, onSetNotifyType,
}: any) {

  const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

  return (
    <>
      {/* CUSTOMER */}
      <Section title="Customer">
        <p className="text-[15px] font-semibold text-white">{booking.customer?.name}</p>
        <div className="mt-2 flex flex-col gap-2">
          <a href={`tel:${booking.customer?.phone}`}
            className="flex items-center gap-2.5 rounded-xl border border-[#252525] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white active:bg-[#1a1a1a]">
            <Phone size={14} className="text-[#ecb100]" />
            {booking.customer?.phone}
          </a>
          {booking.customer?.email && (
            <a href={`mailto:${booking.customer?.email}`}
              className="flex items-center gap-2.5 rounded-xl border border-[#252525] bg-[#0f0f0f] px-3 py-2.5 text-sm text-white active:bg-[#1a1a1a]">
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
        <Detail label="Created" value={new Date(booking.createdAt).toLocaleString("en-IN", {
          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
        })} />
      </Section>

      {/* STATUS CONTROL */}
      <Section title="Booking Status">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#8a8a8a]">Current status</span>
          <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusColor[bookingStatus] || "bg-gray-500/10 text-gray-400"}`}>
            {bookingStatus}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              disabled={updatingStatus || bookingStatus === s}
              onClick={() => onStatusChange(s)}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all active:scale-95 disabled:opacity-40 ${
                bookingStatus === s
                  ? "bg-[#ecb100]/10 text-[#ecb100] border border-[#ecb100]/30"
                  : "bg-[#0f0f0f] border border-[#1c1c1c] text-[#666] hover:border-[#333] hover:text-white"
              }`}
            >
              {updatingStatus && bookingStatus !== s ? (
                <Loader2 size={11} className="animate-spin" />
              ) : null}
              <span className="capitalize">{s}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* PAYMENT */}
      <Section title="Payment">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <AmountChip label="Total" value={booking.totalAmount} />
          <AmountChip label="Paid" value={booking.amountPaid} highlight />
          <AmountChip label="Balance" value={balance} danger={balance > 0} />
        </div>

        <Detail label="Payment Type" value={booking.paymentType} />

        {/* Payment status + verify/reject buttons */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#8a8a8a]">Payment Status</span>
          <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${paymentStatusColor[paymentStatus] || "bg-gray-500/10 text-gray-400"}`}>
            {paymentStatus}
          </span>
        </div>

        {(booking.paymentType === "full" || booking.paymentType === "partial") && (
          <div className="flex gap-2 mt-1">
            <button
              disabled={updatingPayment || paymentStatus === "verified"}
              onClick={() => onPaymentStatusChange("verified")}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-green-500/10 py-2 text-xs text-green-400 transition hover:bg-green-500/20 active:scale-95 disabled:opacity-40"
            >
              {updatingPayment && paymentStatus !== "verified" ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <ShieldCheck size={13} />
              )}
              {paymentStatus === "verified" ? "Verified" : "Verify payment"}
            </button>
            <button
              disabled={updatingPayment || paymentStatus === "rejected"}
              onClick={() => {
                onPaymentStatusChange("rejected");
                onSetNotifyType("payment_rejected");
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 py-2 text-xs text-red-400 transition hover:bg-red-500/20 active:scale-95 disabled:opacity-40"
            >
              {updatingPayment && paymentStatus !== "rejected" ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <ShieldX size={13} />
              )}
              {paymentStatus === "rejected" ? "Rejected" : "Reject payment"}
            </button>
          </div>
        )}

        {isUnpaidOnPaper && (
          <div className="mt-2 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-400 flex items-start gap-2">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            Claimed "{booking.paymentType}" but ₹{balance.toLocaleString("en-IN")} still unaccounted — verify screenshot carefully.
          </div>
        )}

        {booking.paymentScreenshot ? (
          <div className="pt-2"><PaymentScreenshot bookingId={booking.id} /></div>
        ) : (
          (booking.paymentType === "full" || booking.paymentType === "partial") && (
            <p className="text-xs text-red-400 mt-2">No screenshot on file despite a {booking.paymentType} payment claim.</p>
          )
        )}
      </Section>

      {/* ── NOTIFICATION PANEL ── */}
      <Section title="Notify Customer">
        <p className="text-xs text-[#555] mb-3">
          Send status updates via Email and WhatsApp.
        </p>

        {/* Quick-pick buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { type: "confirmed", label: "Confirmed", color: "blue" },
            { type: "cancelled", label: "Cancelled", color: "red" },
            { type: "payment_rejected", label: "Pay Again", color: "yellow" },
            { type: "completed", label: "Completed", color: "green" },
          ].map(({ type, label, color }) => {
            const colors: Record<string, string> = {
              blue:   "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
              red:    "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
              yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20",
              green:  "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20",
            };
            return (
              <button
                key={type}
                onClick={() => onSendNotification(type)}
                disabled={notifyLoading}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all active:scale-95 disabled:opacity-50 ${colors[color]}`}
              >
                {notifyLoading && notifyType === type ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Send size={11} />
                )}
                {label}
              </button>
            );
          })}
        </div>

        {/* Result */}
        {notifyResult && (
          <div className="space-y-2">
            {/* Email result */}
            {notifyResult.hasEmail ? (
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                notifyResult.emailSent
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}>
                {notifyResult.emailSent
                  ? <><CheckCircle2 size={13} /> Email sent to {booking.customer?.email}</>
                  : <><XCircle size={13} /> Email failed: {notifyResult.emailError}</>
                }
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-[#111] px-3 py-2 text-xs text-[#444]">
                <Mail size={13} /> No email on file — skipped
              </div>
            )}

            {/* WhatsApp link */}
            {notifyResult.waLink ? (
              <a
                href={notifyResult.waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-green-600/15 border border-green-600/25 px-3 py-2.5 text-xs text-green-400 hover:bg-green-600/25 transition-colors"
              >
                <MessageCircle size={13} />
                <span className="flex-1">Open WhatsApp to send message</span>
                <span className="text-green-600">→</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-[#111] px-3 py-2 text-xs text-[#444]">
                <MessageCircle size={13} /> No phone on file — WhatsApp unavailable
              </div>
            )}
          </div>
        )}
      </Section>

      {/* SERVICE-SPECIFIC SECTIONS */}
      {booking.taxi && (
        <Section title="Taxi Details">
          <Detail label="Mode" value={booking.taxi.rideMode} />
          <Detail label="Pickup" value={booking.taxi.pickup} />
          <Detail label="Drop" value={booking.taxi.drop || "-"} />
          <Detail label="Vehicle" value={booking.taxi.vehicle} />
          <Detail label="Travel Date" value={
            booking.taxi.travelDate
              ? new Date(booking.taxi.travelDate).toLocaleDateString("en-IN")
              : "-"
          } />
        </Section>
      )}

      {booking.airport && (
        <Section title="Airport Transfer">
          <Detail
            label="Direction"
            value={booking.airport.direction === "FROM_AIRPORT" ? "Airport → City (Drop)" : "City → Airport (Pickup)"}
          />
          <Detail label="City" value={booking.airport.city?.name || "-"} />
          <Detail label={booking.airport.direction === "FROM_AIRPORT" ? "Drop" : "Pickup"} value={booking.airport.pickup} />
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
            <Detail label="Travel Date" value={new Date(booking.tour.travelDate).toLocaleString("en-IN", {
              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
            })} />
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