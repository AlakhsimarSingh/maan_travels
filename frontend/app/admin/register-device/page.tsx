"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, Clock, ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getDeviceFingerprint,
  getDeviceLabel,
} from "@/src/lib/deviceFingerprint";
import {
  registerAdminDevice,
  checkDeviceStatus,
} from "@/src/services/adminDeviceService";

type ViewState =
  | "loading"
  | "need-invite"
  | "pending"
  | "rejected"
  | "approved";

const POLL_INTERVAL_MS = 4000;

function RegisterDeviceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("next") || "/admin";
  const initialStatus = searchParams.get("status"); // "pending" | "revoked" from AdminGuard redirects

  const [view, setView] = useState<ViewState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fingerprintRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const attemptRegister = async (codeOverride?: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const fingerprint = fingerprintRef.current || (await getDeviceFingerprint());
      fingerprintRef.current = fingerprint;

      const res = await registerAdminDevice({
        name: getDeviceLabel(),
        fingerprint,
        userAgent: navigator.userAgent,
        inviteCode: codeOverride || undefined,
      });

      if (res.success && res.status === "approved") {
        setView("approved");
        document.cookie = "admin_hint=1; path=/; max-age=31536000; SameSite=Lax";
        setTimeout(() => router.replace(nextPath), 600);
        return;
      }

      if (res.success && res.status === "pending") {
        setView("pending");
        startPolling(fingerprint);
        return;
      }

      if (res.code === "INVITE_REQUIRED") {
        setView("need-invite");
        return;
      }

      if (res.code === "DEVICE_REVOKED" || res.httpStatus === 403) {
        setView("rejected");
        setError(res.message || "This device's access has been revoked.");
        return;
      }

      setError(res.message || "Something went wrong. Please try again.");
      setView("need-invite");
    } catch (err) {
      console.error("Device registration error:", err);
      setError("Couldn't reach the server. Check your connection and try again.");
      setView("need-invite");
    } finally {
      setSubmitting(false);
    }
  };

  const startPolling = (fingerprint: string) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      const res = await checkDeviceStatus(fingerprint);

      if (res.success && res.status === "approved") {
        clearInterval(pollRef.current!);
        // Re-register to receive the actual cookie now that we're approved —
        // the first registration call didn't issue one since we were pending.
        await attemptRegister();
      }

      if (res.success && res.status === "revoked") {
        clearInterval(pollRef.current!);
        setView("rejected");
        setError("This device's access was revoked.");
      }
    }, POLL_INTERVAL_MS);
  };

  useEffect(() => {
    if (initialStatus === "revoked") {
      setView("rejected");
      setError("This device's access has been revoked.");
      return;
    }

    attemptRegister();

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[#252525] bg-[#141414] p-8 text-center">
        {view === "loading" && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#ecb100]" />
            <p className="mt-4 text-[#8a8a8a]">Checking this device...</p>
          </>
        )}

        {view === "approved" && (
          <>
            <ShieldCheck className="mx-auto h-10 w-10 text-green-400" />
            <h1 className="mt-4 text-xl font-bold text-white">Device verified</h1>
            <p className="mt-2 text-sm text-[#8a8a8a]">Taking you to the admin panel...</p>
          </>
        )}

        {view === "pending" && (
          <>
            <Clock className="mx-auto h-10 w-10 text-[#ecb100]" />
            <h1 className="mt-4 text-xl font-bold text-white">Awaiting approval</h1>
            <p className="mt-2 text-sm text-[#8a8a8a]">
              This device has been registered as{" "}
              <span className="text-white">{getDeviceLabel()}</span>, but needs to be
              approved from an already-trusted admin device before it can access the
              panel.
            </p>
            <p className="mt-4 text-xs text-[#555]">
              This page will continue automatically once approved — no need to refresh.
            </p>
          </>
        )}

        {view === "rejected" && (
          <>
            <ShieldX className="mx-auto h-10 w-10 text-red-400" />
            <h1 className="mt-4 text-xl font-bold text-white">Access revoked</h1>
            <p className="mt-2 text-sm text-[#8a8a8a]">
              {error || "This device no longer has access to the admin panel."}
            </p>
            <p className="mt-4 text-xs text-[#555]">
              Ask a trusted admin to generate a new invite if you need access again.
            </p>
          </>
        )}

        {view === "need-invite" && (
          <>
            <ShieldCheck className="mx-auto h-10 w-10 text-[#ecb100]" />
            <h1 className="mt-4 text-xl font-bold text-white">Register this device</h1>
            <p className="mt-2 text-sm text-[#8a8a8a]">
              This device ({getDeviceLabel()}) isn't recognized yet. Enter an invite
              code generated from an already-trusted admin device to register it.
            </p>

            <input
              placeholder="Paste invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.trim())}
              className="mt-5 w-full rounded-lg border border-[#252525] bg-black px-3 py-2.5 text-center font-mono text-sm text-white outline-none focus:border-[#ecb100]/60"
            />

            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

            <Button
              disabled={submitting || !inviteCode}
              onClick={() => attemptRegister(inviteCode)}
              className="mt-4 w-full bg-[#ecb100] font-semibold text-black hover:bg-[#f6c94c]"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Verifying
                </span>
              ) : (
                "Submit invite code"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function RegisterDeviceFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[#252525] bg-[#141414] p-8 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#ecb100]" />
        <p className="mt-4 text-[#8a8a8a]">Checking this device...</p>
      </div>
    </div>
  );
}

export default function RegisterDevicePage() {
  return (
    <Suspense fallback={<RegisterDeviceFallback />}>
      <RegisterDeviceContent />
    </Suspense>
  );
}