import { NextRequest, NextResponse } from "next/server";

const DEVICE_COOKIE_NAME = "admin_device_token";

// Pages under /admin that must stay reachable WITHOUT a valid device
// cookie, since they're part of the registration/approval flow itself —
// redirecting them back into a loop would make it impossible to ever
// register a new device in the first place.
const PUBLIC_ADMIN_PATHS = ["/admin/register-device"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const deviceToken = request.cookies.get(DEVICE_COOKIE_NAME)?.value;

  if (!deviceToken) {
    const redirectUrl = new URL("/admin/register-device", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // We deliberately don't verify the token's validity here (that would mean
  // a backend network call on every single admin navigation). Middleware
  // only checks "is there a plausible session at all" — the backend's
  // requireAdminDevice middleware is the actual source of truth and will
  // reject every API call from a revoked/unknown device regardless of what
  // happens here. The AdminGuard client component handles that case by
  // redirecting if the first /me check fails after the page has loaded.
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};