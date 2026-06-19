"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

export default function PaymentSettingsPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/payment/settings`);
      const data = await res.json();
      setQrCode(data.settings?.qrCodeImage || null);
      setUpiId(data.settings?.upiId || "");
    } catch {
      setError("Failed to load payment settings");
    }
  };

  const save = async () => {
    setError("");
    setSaving(true);

    try {
      const data = new FormData();
      if (file) data.append("qrCode", file);
      if (upiId) data.append("upiId", upiId);

      const res = await fetch(`${API_URL}/api/payment/settings`, {
        method: "POST",
        body: data,
      });

      const resData = await res.json();

      if (!resData.success) {
        setError(resData.message || "Failed to save");
        return;
      }

      setFile(null);
      fetchSettings();
    } catch {
      setError("Failed to save payment settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 text-white space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">Payment settings</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {qrCode && (
        <img src={`${API_URL}${qrCode}`} alt="Current QR code" className="w-40 h-40 rounded-lg border border-[#252525]" />
      )}

      <div className="bg-[#111] border border-[#252525] p-5 rounded-2xl space-y-3">
        <div>
          <p className="text-sm text-white/70 mb-2">Upload new QR code</p>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
        </div>

        <input
          className="w-full p-2.5 bg-black border border-[#252525] rounded-lg outline-none focus:border-[#ecb100]/60"
          placeholder="UPI ID (optional)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />

        <button onClick={save} disabled={saving} className="bg-[#ecb100] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#f6c94c] disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}