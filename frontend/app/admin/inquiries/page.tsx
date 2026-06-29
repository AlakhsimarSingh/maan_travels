"use client";

import { useEffect, useState, Fragment } from "react";
import { Trash2, Mail, Phone, ChevronDown, MessageSquare } from "lucide-react";

import {
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "@/src/services/inquiryService";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const statusStyles: Record<string, string> = {
  new: "bg-[#ecb100]/10 text-[#ecb100] border-[#ecb100]/30",
  contacted: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  closed: "bg-green-500/10 text-green-400 border-green-500/30",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await getAllInquiries();
      setInquiries(res.success ? res.inquiries : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    await updateInquiryStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await deleteInquiry(id);
    fetchInquiries();
  };

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-28 md:pb-10">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#ecb100] mb-1">
            Contact Form
          </p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Inquiries</h1>
          <p className="mt-1 text-sm text-[#555]">
            Messages submitted through the contact form
          </p>
        </div>
        {newCount > 0 && (
          <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-[#ecb100]/25 bg-[#ecb100]/10 px-3 py-1.5">
            <MessageSquare size={12} className="text-[#ecb100]" />
            <span className="text-xs font-semibold text-[#ecb100]">{newCount} new</span>
          </div>
        )}
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#111] border border-[#1c1c1c] animate-pulse" />
          ))}
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && inquiries.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#252525] py-20 text-center text-sm text-[#444]">
          No inquiries yet.
        </div>
      )}

      {/* ── MOBILE: card list ── */}
      {!loading && inquiries.length > 0 && (
        <div className="md:hidden space-y-3">
          {inquiries.map((inq) => {
            const isOpen = expanded === inq.id;
            return (
              <div
                key={inq.id}
                className={`rounded-2xl border bg-[#111] overflow-hidden transition-colors ${
                  inq.status === "new"
                    ? "border-[#ecb100]/20"
                    : "border-[#1c1c1c]"
                }`}
              >
                {/* Top: tap to expand */}
                <button
                  className="w-full text-left px-4 pt-4 pb-3"
                  onClick={() => setExpanded(isOpen ? null : inq.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{inq.name}</p>
                      <p className="text-xs text-[#ecb100] mt-0.5 truncate">{inq.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] capitalize ${statusStyles[inq.status] || statusStyles.new}`}>
                        {inq.status}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-[#444] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#444] mt-1.5">{formatDate(inq.createdAt)}</p>
                </button>

                {/* Contact links */}
                <div className="flex gap-2 px-4 pb-3">
                  <a
                    href={`tel:${inq.phone}`}
                    className="flex items-center gap-1.5 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] px-3 py-1.5 text-xs text-white active:bg-[#1a1a1a]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone size={11} className="text-[#ecb100]" />
                    {inq.phone}
                  </a>
                  <a
                    href={`mailto:${inq.email}`}
                    className="flex items-center gap-1.5 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] px-3 py-1.5 text-xs text-[#8a8a8a] truncate active:bg-[#1a1a1a]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail size={11} />
                    {inq.email}
                  </a>
                </div>

                {/* Expanded message */}
                {isOpen && (
                  <div className="mx-4 mb-3 rounded-xl border border-[#1c1c1c] bg-[#0a0a0a] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#333] mb-2">Message</p>
                    <p className="text-sm text-[#c7c7c7] whitespace-pre-wrap leading-relaxed">
                      {inq.message}
                    </p>
                  </div>
                )}

                {/* Bottom actions */}
                <div className="flex items-center gap-2 border-t border-[#1c1c1c] px-4 py-2.5">
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className="flex-1 rounded-lg border border-[#252525] bg-[#0f0f0f] px-2 py-1.5 text-xs text-white outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 text-red-400 active:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DESKTOP: table ── */}
      {!loading && inquiries.length > 0 && (
        <div className="hidden md:block overflow-hidden rounded-2xl border border-[#1c1c1c] bg-[#111]">
          <table className="w-full text-white text-sm">
            <thead className="bg-[#0d0d0d] text-[#444] text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Received</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {inquiries.map((inq) => (
                <Fragment key={inq.id}>
                  <tr
                    onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                    className="cursor-pointer border-t border-[#1a1a1a] transition hover:bg-[#161616]"
                  >
                    <td className="p-4">
                      <p className="font-medium text-white">{inq.name}</p>
                      <a
                        href={`mailto:${inq.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5 flex items-center gap-1 text-xs text-[#555] hover:text-[#ecb100] transition-colors"
                      >
                        <Mail size={10} /> {inq.email}
                      </a>
                      <a
                        href={`tel:${inq.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5 flex items-center gap-1 text-xs text-[#555] hover:text-[#ecb100] transition-colors"
                      >
                        <Phone size={10} /> {inq.phone}
                      </a>
                    </td>

                    <td className="p-4 text-[#c7c7c7] max-w-[200px]">
                      <p className="truncate">{inq.subject}</p>
                    </td>

                    <td className="p-4 text-[#555] whitespace-nowrap">
                      {formatDate(inq.createdAt)}
                    </td>

                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`rounded-full border px-3 py-1 text-xs outline-none cursor-pointer ${statusStyles[inq.status] || statusStyles.new}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="rounded-lg p-1.5 text-[#444] transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>

                  {expanded === inq.id && (
                    <tr className="border-t border-[#1a1a1a] bg-[#0d0d0d]">
                      <td colSpan={5} className="px-5 py-4">
                        <p className="text-[10px] uppercase tracking-widest text-[#333] mb-2">
                          Message
                        </p>
                        <p className="text-sm text-[#c7c7c7] whitespace-pre-wrap leading-relaxed max-w-2xl">
                          {inq.message}
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}