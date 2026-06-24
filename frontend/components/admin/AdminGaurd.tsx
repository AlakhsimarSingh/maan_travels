"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { getCurrentDevice } from "@/src/services/adminDeviceService";

type GuardState = "checking" | "ok" | "rejected";

/**
 * Wrap admin pages/layouts with this. middleware.ts already redirects
 * requests with NO cookie at all before the page ever renders — this
 * component handles the remaining case: a cookie IS present, but the
 * backend says the device is unknown, pending, or revoked. That can only
 * be discovered by actually asking the backend (the /me endpoint, which
 * runs through the same requireAdminDevice middleware every other admin
 * API call goes through).
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GuardState>("checking");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const res = await getCurrentDevice();

      if (!isMounted) return;

      if (res?.success) {
        setState("ok");
        return;
      }

      setState("rejected");

      const redirectUrl = new URL("/admin/register-device", window.location.origin);
      redirectUrl.searchParams.set("next", pathname);

      if (res?.code === "DEVICE_PENDING") {
        redirectUrl.searchParams.set("status", "pending");
      } else if (res?.code === "DEVICE_REVOKED") {
        redirectUrl.searchParams.set("status", "revoked");
      }

      router.replace(redirectUrl.pathname + redirectUrl.search);
    })();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ecb100] border-t-transparent" />
      </div>
    );
  }

  if (state === "rejected") {
    return null; // redirect is already in flight
  }

  return <>{children}</>;
}