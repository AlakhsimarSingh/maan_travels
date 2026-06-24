"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldX,
  Clock,
  Smartphone,
  Plus,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getAdminDevices,
  approveAdminDevice,
  revokeAdminDevice,
  deleteAdminDevice,
  createDeviceInvite,
  getCurrentDevice,
} from "@/src/services/adminDeviceService";

type Device = {
  id: string;
  name: string;
  userAgent?: string | null;
  status: "pending" | "approved" | "revoked";
  lastUsed?: string | null;
  createdAt: string;
};

export default function AdminSettingsPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteExpiresAt, setInviteExpiresAt] = useState<string | null>(null);
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const [actingOn, setActingOn] = useState<string | null>(null);

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

  useEffect(() => {
    fetchDevices();
  }, []);

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
    try {
      await approveAdminDevice(id);
      fetchDevices();
    } finally {
      setActingOn(null);
    }
  };

  const handleRevoke = async (id: string) => {
    const ok = window.confirm("Revoke this device's access? It will need a new invite to return.");
    if (!ok) return;

    setActingOn(id);
    try {
      await revokeAdminDevice(id);
      fetchDevices();
    } finally {
      setActingOn(null);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Permanently remove this device from the list?");
    if (!ok) return;

    setActingOn(id);
    try {
      await deleteAdminDevice(id);
      fetchDevices();
    } finally {
      setActingOn(null);
    }
  };

  const pendingDevices = devices.filter((d) => d.status === "pending");
  const otherDevices = devices.filter((d) => d.status !== "pending");

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Devices</h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Only devices approved here can access the admin panel.
        </p>
      </div>

      {/* INVITE GENERATOR */}
      <div className="rounded-2xl border border-[#252525] bg-[#141414] p-6">
        <h2 className="font-semibold text-white">Add a new device</h2>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Generate a one-time invite code, then enter it on the new device's
          registration screen. Codes expire after 15 minutes.
        </p>

        {inviteCode ? (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#ecb100]/30 bg-[#ecb100]/10 px-4 py-3">
            <code className="flex-1 truncate font-mono text-sm text-[#ecb100]">
              {inviteCode}
            </code>
            <button
              onClick={handleCopyInvite}
              className="flex items-center gap-1 rounded-md bg-white/5 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        ) : null}

        <Button
          onClick={handleGenerateInvite}
          disabled={generatingInvite}
          className="mt-4 bg-[#ecb100] font-semibold text-black hover:bg-[#f6c94c]"
        >
          {generatingInvite ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Generating
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plus size={16} />
              Generate invite code
            </span>
          )}
        </Button>
      </div>

      {/* PENDING APPROVALS */}
      {pendingDevices.length > 0 && (
        <div className="rounded-2xl border border-[#ecb100]/30 bg-[#ecb100]/5 p-6">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <Clock size={16} className="text-[#ecb100]" />
            Pending approval
          </h2>

          <div className="mt-4 space-y-3">
            {pendingDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between rounded-lg border border-[#252525] bg-black/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-[#8a8a8a]" />
                  <div>
                    <p className="text-sm font-medium text-white">{device.name}</p>
                    <p className="text-xs text-[#666]">
                      Requested {new Date(device.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  disabled={actingOn === device.id}
                  onClick={() => handleApprove(device.id)}
                  className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                >
                  Approve
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEVICE LIST */}
      <div className="rounded-2xl border border-[#252525] bg-[#141414] overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-black/60 text-sm text-[#8a8a8a]">
            <tr>
              <th className="p-4">Device</th>
              <th>Status</th>
              <th>Last used</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6">
                  <div className="h-6 w-full animate-pulse rounded bg-white/5" />
                </td>
              </tr>
            ) : otherDevices.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-[#8a8a8a]">
                  No devices yet.
                </td>
              </tr>
            ) : (
              otherDevices.map((device) => {
                const isCurrent = device.id === currentDeviceId;

                return (
                  <tr key={device.id} className="border-t border-[#252525]">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Smartphone size={16} className="text-[#8a8a8a]" />
                        <span className="font-medium">{device.name}</span>
                        {isCurrent && (
                          <span className="rounded-full bg-[#ecb100]/15 px-2 py-0.5 text-xs text-[#ecb100]">
                            This device
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      {device.status === "approved" ? (
                        <span className="flex items-center gap-1 text-sm text-green-400">
                          <ShieldCheck size={14} /> Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-red-400">
                          <ShieldX size={14} /> Revoked
                        </span>
                      )}
                    </td>

                    <td className="text-sm text-[#8a8a8a]">
                      {device.lastUsed
                        ? new Date(device.lastUsed).toLocaleString()
                        : "Never"}
                    </td>

                    <td className="space-x-3 p-4 text-right">
                      {device.status === "approved" && !isCurrent && (
                        <button
                          disabled={actingOn === device.id}
                          onClick={() => handleRevoke(device.id)}
                          className="text-red-400 hover:underline"
                        >
                          Revoke
                        </button>
                      )}

                      {!isCurrent && (
                        <button
                          disabled={actingOn === device.id}
                          onClick={() => handleDelete(device.id)}
                          className="text-[#8a8a8a] hover:text-white hover:underline"
                        >
                          Remove
                        </button>
                      )}

                      {isCurrent && (
                        <span className="text-xs text-[#555]">
                          Can't modify your own device
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}