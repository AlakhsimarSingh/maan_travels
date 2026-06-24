"use client";

import { useEffect, useState, Fragment } from "react";
import { Trash2, Mail, Phone } from "lucide-react";

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

const statusStyles: Record<string, string> = {
  new: "bg-[#ecb100]/10 text-[#ecb100] border-[#ecb100]/30",
  contacted: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  closed: "bg-green-500/10 text-green-400 border-green-500/30",
};

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

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    await updateInquiryStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this inquiry?");
    if (!ok) return;

    await deleteInquiry(id);
    fetchInquiries();
  };

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Inquiries</h2>
          <p className="mt-1 text-[#8a8a8a]">
            Messages submitted through the contact form
            {newCount > 0 && (
              <span className="ml-2 rounded-full bg-[#ecb100]/10 px-2 py-0.5 text-xs text-[#ecb100]">
                {newCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#252525] bg-[#141414]">
        <table className="w-full text-white">
          <thead className="bg-[#111] text-[#8a8a8a]">
            <tr>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4 text-left">Received</th>
              <th>Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[#8a8a8a]">
                  Loading...
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-[#8a8a8a]">
                  No inquiries yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <Fragment key={inq.id}>
                  <tr
                    key={inq.id}
                    onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                    className="cursor-pointer border-t border-[#252525] transition hover:bg-[#1b1b1b]"
                  >
                    <td className="p-4">
                      <p className="font-medium">{inq.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8a8a8a]">
                        <Mail size={11} /> {inq.email}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8a8a8a]">
                        <Phone size={11} /> {inq.phone}
                      </p>
                    </td>

                    <td className="p-4 text-[#c7c7c7]">{inq.subject}</td>

                    <td className="p-4 text-sm text-[#8a8a8a]">
                      {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="text-center" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`rounded-full border px-3 py-1 text-xs outline-none ${statusStyles[inq.status] || statusStyles.new}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="text-red-400 transition hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>

                  {expanded === inq.id && (
                    <tr className="border-t border-[#252525] bg-[#0f0f0f]">
                      <td colSpan={5} className="p-5">
                        <p className="text-xs uppercase tracking-wide text-[#666]">Message</p>
                        <p className="mt-2 whitespace-pre-wrap text-[#c7c7c7]">{inq.message}</p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}