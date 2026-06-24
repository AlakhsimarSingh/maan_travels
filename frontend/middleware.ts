import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/admin/register-device"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const adminHint = request.cookies.get("admin_hint")?.value;

  if (!adminHint) {
    const redirectUrl = new URL("/admin/register-device", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};