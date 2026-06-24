"use client";

import { useState } from "react";
import { User, Mail, Phone, Tag, MessageSquare, Send, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createInquiry } from "@/src/services/inquiryService";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const fieldError = (field: string, value: string) => touched[field] && !value;

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.message) {
      setTouched({ name: true, email: true, phone: true, message: true });
      setError("Please fill in all required fields.");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const res = await createInquiry(form);

      if ((res as any)?.success === false) {
        setError((res as any)?.message || "Couldn't send your message.");
        return;
      }

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTouched({});
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-[#ecb100]/30 bg-[#141414] p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ecb100]/10">
          <CheckCircle2 size={32} className="text-[#ecb100]" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-white">Message sent</h2>
        <p className="mt-2 max-w-sm text-[#8a8a8a]">
          Thanks for reaching out. Our team will get back to you shortly.
        </p>

        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm text-[#ecb100] underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#252525] bg-[#141414] p-8 transition-colors duration-300 hover:border-[#2a2a2a]">
      <h2 className="mb-6 text-2xl font-bold text-white">Send Message</h2>

      <div className="space-y-5">
        <FieldInput
          icon={<User size={18} />}
          placeholder="Your name"
          value={form.name}
          onChange={(v) => updateField("name", v)}
          onBlur={() => markTouched("name")}
          error={fieldError("name", form.name)}
        />

        <FieldInput
          icon={<Mail size={18} />}
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={(v) => updateField("email", v)}
          onBlur={() => markTouched("email")}
          error={fieldError("email", form.email)}
        />

        <FieldInput
          icon={<Phone size={18} />}
          placeholder="Mobile number"
          value={form.phone}
          onChange={(v) => updateField("phone", v)}
          onBlur={() => markTouched("phone")}
          error={fieldError("phone", form.phone)}
        />

        <FieldInput
          icon={<Tag size={18} />}
          placeholder="Subject (optional)"
          value={form.subject}
          onChange={(v) => updateField("subject", v)}
        />

        <div className="relative">
          <MessageSquare size={16} className="pointer-events-none absolute left-4 top-4 text-[#ecb100]" />
          <textarea
            placeholder="Your message"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            onBlur={() => markTouched("message")}
            className={`min-h-32 w-full rounded-xl border bg-[#111] p-4 pl-11 text-white outline-none transition-colors placeholder:text-[#666] ${
              fieldError("message", form.message)
                ? "border-red-500/60"
                : "border-[#252525] focus:border-[#ecb100]"
            }`}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="group w-full bg-[#ecb100] text-black transition-all duration-200 hover:bg-[#f6c94c] hover:shadow-[0_8px_24px_-8px_rgba(236,177,0,0.4)] active:scale-[0.98] disabled:opacity-60"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? "Sending..." : "Send Inquiry"}
            {!loading && (
              <Send size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}

function FieldInput({
  icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: boolean;
  type?: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb100]">
        {icon}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`h-12 w-full rounded-xl border bg-[#111] pl-12 pr-4 text-white outline-none transition-colors placeholder:text-[#666] ${
          error ? "border-red-500/60" : "border-[#252525] focus:border-[#ecb100]"
        }`}
      />
    </div>
  );
}