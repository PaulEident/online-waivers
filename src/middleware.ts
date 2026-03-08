import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// NextAuth v5 (Auth.js) uses "authjs" cookie prefix, not "next-auth"
const COOKIE_NAME = process.env.NEXTAUTH_URL?.startsWith("https")
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName: COOKIE_NAME,
    salt: COOKIE_NAME,
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
