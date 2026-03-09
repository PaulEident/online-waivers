"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/volntir-icon.png"
              alt=""
              width={28}
              height={28}
              priority
              className="rounded-md"
            />
            <span className="font-bold text-brand-dark text-lg tracking-tight">
              Volntir
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-brand font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-7 h-7 rounded-full ring-2 ring-gray-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xs font-bold">
                      {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-700 font-medium">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="text-sm text-gray-400 hover:text-gray-600 ml-1 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm bg-brand hover:bg-brand-hover text-white px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-1" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 pt-20 flex flex-col gap-1">
            {session?.user ? (
              <>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-10 h-10 rounded-full ring-2 ring-gray-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand text-sm font-bold">
                      {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {session.user.name || "User"}
                    </div>
                    <div className="text-xs text-gray-500">{session.user.email}</div>
                  </div>
                </div>
                <Link href="/" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Home
                </Link>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  Dashboard
                </Link>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button onClick={() => { setMenuOpen(false); signOut({ redirectTo: "/" }); }}
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm w-full">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Home
                </Link>
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <Link href="/auth/signin" onClick={() => setMenuOpen(false)}
                    className="block text-center bg-brand hover:bg-brand-hover text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm">
                    Sign in
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)}
                    className="block text-center text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors mt-2">
                    Create account
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
