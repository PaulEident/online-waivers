"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-brand-dark text-white">
        {/* Gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-brand-dark to-gray-900" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-700/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-24 md:py-32 text-center min-h-[85vh] flex flex-col items-center justify-center">
          <div className="mb-8 flex items-center justify-center gap-3">
            <Image
              src="/volntir-icon.png"
              alt=""
              width={52}
              height={52}
              priority
              className="drop-shadow-lg"
            />
            <span className="text-3xl md:text-4xl font-bold tracking-tight">Volntir</span>
          </div>

          <p className="text-brand-500 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-6">
            Volunteering, Together
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Digital Waivers,<br />
            <span className="bg-gradient-to-r from-brand-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Simplified
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
            Collect digital liability waivers for your events. Manage organizations,
            check in attendees, and keep everything organized.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg shadow-brand/25 transition-all hover:shadow-xl hover:shadow-brand/35 hover:-translate-y-0.5 text-base"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg shadow-brand/25 transition-all hover:shadow-xl hover:shadow-brand/35 hover:-translate-y-0.5 text-base"
                >
                  Get Started
                </Link>
                <Link
                  href="#features"
                  className="px-10 py-3.5 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 border border-white/15 transition-all backdrop-blur-sm text-base"
                >
                  Learn More
                </Link>
              </>
            )}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Everything you need
        </h2>
        <p className="text-center text-gray-500 mb-12 md:mb-16 max-w-lg mx-auto">
          From waiver signing to event check-in, Volntir handles the paperwork so you can focus on what matters.
        </p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {/* Digital Waivers */}
          <div className="group p-6 rounded-2xl border border-gray-200/80 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Digital Waivers</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Customizable waiver templates with electronic signatures. One waiver per user per event.
            </p>
          </div>

          {/* Event Check-In */}
          <div className="group p-6 rounded-2xl border border-gray-200/80 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Event Check-In</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Search attendees by name, see waiver status, and check them in on arrival.
            </p>
          </div>

          {/* Multi-Tenant */}
          <div className="group p-6 rounded-2xl border border-gray-200/80 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
              <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Multi-Tenant</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Multiple organizations, each with their own events, members, and waiver templates.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-10 text-sm text-gray-400 border-t border-gray-200">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Image src="/volntir-icon.png" alt="" width={18} height={18} className="opacity-40" />
          <span className="font-semibold text-gray-400">Volntir</span>
        </div>
        <p className="text-gray-400/80 text-xs">Volunteering, Together</p>
      </footer>
    </main>
  );
}
