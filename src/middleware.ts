import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Detect HTTPS from the actual request to determine the correct cookie name
  const isSecure = request.nextUrl.protocol === "https:";
  const cookieName = isSecure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName,
    salt: cookieName,
  });
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!token;

  // Protect admin routes
  if (pathname.startsWith("/admin") && !isLoggedIn) {
    const signInUrl = new URL(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Protect event waiver pages
  if (pathname.startsWith("/events/") && !isLoggedIn) {
    const signInUrl = new URL(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Protect dashboard
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const signInUrl = new URL(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/events/:path*", "/dashboard/:path*"],
};
