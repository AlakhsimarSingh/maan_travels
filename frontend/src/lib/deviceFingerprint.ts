import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cachedFingerprint: string | null = null;

/**
 * Generates a stable device fingerprint using the open-source FingerprintJS
 * build. This runs entirely client-side — no network call to FingerprintJS's
 * paid service, just the local visitorId algorithm.
 *
 * Cached in-memory for the life of the page load since computing it isn't
 * free and it won't change between calls in the same session.
 */
export async function getDeviceFingerprint(): Promise<string> {
  if (cachedFingerprint) return cachedFingerprint;

  const fp = await FingerprintJS.load();
  const result = await fp.get();

  cachedFingerprint = result.visitorId;
  return cachedFingerprint;
}

export function getDeviceLabel(): string {
  if (typeof navigator === "undefined") return "Unknown device";

  const ua = navigator.userAgent;

  // Best-effort, readable label — not meant to be precise, just enough
  // for an admin to recognize "oh that's my phone" in a device list.
  const isMobile = /Mobile|Android|iPhone/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);

  let device = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

  let browser = "Browser";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";

  return `${browser} on ${device}`;
}