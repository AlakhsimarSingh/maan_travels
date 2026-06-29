"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldX,
  Clock,
  Smartphone,
  Plus,
  Copy,
  Check,
  Loader2,
  Globe,
  LogOut,
  ChevronRight,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getAdminDevices,
  approveAdminDevice,
  revokeAdminDevice,
  deleteAdminDevice,
  createDeviceInvite,
  getCurrentDevice,
  logoutAdminDevice,
} from "@/src/services/adminDeviceService";

type Device = {
  id: string;
  name: string;
  userAgent?: string | null;
  status: "pending" | "approved" | "revoked";
  lastUsed?: string | null;
  createdAt: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteExpiresAt, setInviteExpiresAt] = useState<string | null>(null);
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const [actingOn, setActingOn] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const [devicesRes, meRes] = await Promise.all([
        getAdminDevices(),
        getCurrentDevice(),
      ]);
      if (devicesRes?.success) setDevices(devicesRes.devices || []);
      if (meRes?.success) setCurrentDeviceId(meRes.device?.id || null);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  const handleGenerateInvite = async () => {
    setGeneratingInvite(true);
    setInviteCode(null);
    try {
      const res = await createDeviceInvite();
      if (res?.success) {
        setInviteCode(res.invite.code);
        setInviteExpiresAt(res.invite.expiresAt);
      }
    } catch (err) {
      console.error("Failed to create invite:", err);
    } finally {
      setGeneratingInvite(false);
    }
  };

  const handleCopyInvite = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = async (id: string) => {
    setActingOn(id);
    try { await approveAdminDevice(id); fetchDevices(); }
    finally { setActingOn(null); }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this device's access?")) return;
    setActingOn(id);
    try { await revokeAdminDevice(id); fetchDevices(); }
    finally { setActingOn(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently remove this device?")) return;
    setActingOn(id);
    try { await deleteAdminDevice(id); fetchDevices(); }
    finally { setActingOn(null); }
  };

  const handleLogout = async () => {
    if (!confirm("Log out this device from the admin panel?")) return;
    setLoggingOut(true);
    try {
      await logoutAdminDevice();
      router.replace("/admin/register-device");
    } finally {
      setLoggingOut(false);
    }
  };

  const pendingDevices = devices.filter((d) => d.status === "pending");
  const otherDevices = devices.filter((d) => d.status !== "pending");

  return (
    // Extra bottom padding on mobile so content clears the bottom nav bar
    <div className="max-w-2xl mx-auto space-y-6 pb-28 md:pb-10">

      {/* PAGE HEADER */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#ecb100] mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-[#555]">
          Manage devices that can access this panel.
        </p>
      </div>

      {/* ── INVITE GENERATOR ── */}
      <Card>
        <CardHeader
          title="Add a new device"
          subtitle="Generate a one-time code, enter it on the new device's registration screen. Expires in 15 minutes."
        />

        {inviteCode && (
          <div className="mt-4 rounded-xl border border-[#ecb100]/25 bg-[#ecb100]/8 p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#ecb100]/60 mb-2">
              Invite code · expires {inviteExpiresAt ? formatDate(inviteExpiresAt) : "soon"}
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 truncate font-mono text-lg font-semibold tracking-widest text-[#ecb100]">
                {inviteCode}
              </code>
              <button
                onClick={handleCopyInvite}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  copied
                    ? "bg-green-500/15 text-green-400"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerateInvite}
          disabled={generatingInvite}
          className="mt-4 flex items-center gap-2 rounded-xl bg-[#ecb100] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#f6c94c] active:scale-[0.98] disabled:opacity-60"
        >
          {generatingInvite ? (
            <><Loader2 size={15} className="animate-spin" /> Generating…</>
          ) : (
            <><Plus size={15} /> Generate invite code</>
          )}
        </button>
      </Card>

      {/* ── PENDING APPROVALS ── */}
      {pendingDevices.length > 0 && (
        <div className="rounded-2xl border border-[#ecb100]/25 bg-[#ecb100]/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-[#ecb100]" />
            <p className="text-sm font-semibold text-white">
              Pending approval
              <span className="ml-2 rounded-full bg-[#ecb100]/20 px-2 py-0.5 text-xs text-[#ecb100]">
                {pendingDevices.length}
              </span>
            </p>
          </div>

          <div className="space-y-2.5">
            {pendingDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center gap-3 rounded-xl border border-[#252525] bg-black/30 px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#252525] bg-[#0f0f0f]">
                  <Smartphone size={15} className="text-[#555]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{device.name}</p>
                  <p className="text-[11px] text-[#444]">
                    Requested {formatDate(device.createdAt)}
                  </p>
                </div>
                <button
                  disabled={actingOn === device.id}
                  onClick={() => handleApprove(device.id)}
                  className="shrink-0 rounded-lg bg-green-500/15 px-3 py-1.5 text-xs font-medium text-green-400 transition hover:bg-green-500/25 active:scale-95 disabled:opacity-50"
                >
                  {actingOn === device.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    "Approve"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DEVICE LIST ── */}
      <Card>
        <CardHeader
          title="Authorized devices"
          subtitle="Only approved devices can access this admin panel."
        />

        <div className="mt-4 space-y-2">
          {loading &&
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-[#0f0f0f] animate-pulse" />
            ))}

          {!loading && otherDevices.length === 0 && (
            <p className="py-6 text-center text-sm text-[#444]">No devices yet.</p>
          )}

          {!loading &&
            otherDevices.map((device) => {
              const isCurrent = device.id === currentDeviceId;
              const isApproved = device.status === "approved";

              return (
                <div
                  key={device.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    isCurrent
                      ? "border-[#ecb100]/20 bg-[#ecb100]/5"
                      : "border-[#1c1c1c] bg-[#0f0f0f]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        isApproved
                          ? isCurrent
                            ? "border-[#ecb100]/30 bg-[#ecb100]/10"
                            : "border-[#1c1c1c] bg-[#141414]"
                          : "border-red-500/20 bg-red-500/5"
                      }`}
                    >
                      <Smartphone
                        size={16}
                        className={
                          isApproved
                            ? isCurrent
                              ? "text-[#ecb100]"
                              : "text-[#555]"
                            : "text-red-400"
                        }
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-white truncate">
                          {device.name}
                        </p>
                        {isCurrent && (
                          <span className="rounded-full bg-[#ecb100]/15 px-2 py-0.5 text-[10px] text-[#ecb100]">
                            This device
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
                            isApproved
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {isApproved ? (
                            <><ShieldCheck size={10} /> Approved</>
                          ) : (
                            <><ShieldX size={10} /> Revoked</>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#444] mt-0.5">
                        Last used:{" "}
                        {device.lastUsed ? formatDate(device.lastUsed) : "Never"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isCurrent && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1c1c1c]">
                      {isApproved && (
                        <button
                          disabled={actingOn === device.id}
                          onClick={() => handleRevoke(device.id)}
                          className="flex-1 rounded-lg bg-red-500/10 py-1.5 text-xs text-red-400 transition hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
                        >
                          Revoke access
                        </button>
                      )}
                      <button
                        disabled={actingOn === device.id}
                        onClick={() => handleDelete(device.id)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-[#1c1c1c] px-3 py-1.5 text-xs text-[#555] transition hover:border-red-500/30 hover:text-red-400 active:scale-95 disabled:opacity-50"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  )}

                  {isCurrent && (
                    <p className="mt-2 text-[11px] text-[#333]">
                      You cannot modify your own device from this panel.
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </Card>

      {/* ── ACCOUNT ACTIONS ── */}
      <Card>
        <CardHeader title="Account" subtitle="Actions for your current session." />

        <div className="mt-4 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-[#1c1c1c] bg-[#0f0f0f] px-4 py-3 text-sm text-white transition hover:border-[#252525] hover:bg-[#141414]"
          >
            <Globe size={15} className="text-[#555]" />
            <span className="flex-1">View website</span>
            <ChevronRight size={14} className="text-[#333]" />
          </a>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 active:scale-[0.98] disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <LogOut size={15} />
            )}
            <span className="flex-1 text-left">
              {loggingOut ? "Logging out…" : "Log out this device"}
            </span>
          </button>
        </div>
      </Card>

    </div>
  );
}

// ── Sub-components ──

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#1c1c1c] bg-[#111] p-5">
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-white">{title}</h2>
      <p className="mt-0.5 text-[13px] leading-relaxed text-[#555]">{subtitle}</p>
    </div>
  );
}