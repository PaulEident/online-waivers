"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Volntir",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Free digital waiver management platform for events and organizations. Collect electronic signatures, manage check-ins, and organize unlimited events.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Digital liability waivers with electronic signatures",
    "Event check-in management",
    "Multi-tenant organization support",
    "Family/minor waiver support",
    "Unlimited events and waivers",
    "Role-based access control",
  ],
};

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
            Collect digital liability waivers for your events. Manage organizations,
            check in attendees, and keep everything organized.
          </p>

          {/* FREE callout */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm font-semibold border border-green-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Free Account
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm font-semibold border border-green-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Unlimited Events
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm font-semibold border border-green-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Unlimited Waivers
            </span>
          </div>

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
                  Get Started — It&apos;s Free
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
              Customizable waiver templates with electronic signatures. Draw or type your signature on any device.
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

      {/* Why Free section */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-20">
          {/* Mission statement */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 text-brand-500 text-xs font-semibold mb-5 border border-brand-500/20">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Currently in Beta
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              Why Is Volntir Free?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
              Our mission is simple: make it easy for organizations and attendees to manage waivers for events —
              without the hassle of paper forms or expensive software.
            </p>
          </div>

          {/* Core free features */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Create Events</h3>
              <p className="text-xs text-gray-500">Unlimited events, always free</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Collect Waivers</h3>
              <p className="text-xs text-gray-500">Unlimited signed waivers, always free</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Manage Attendees</h3>
              <p className="text-xs text-gray-500">Check-in &amp; search, always free</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 mb-10">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4">
              Volntir is currently in beta, and <strong className="text-white">the core features will always be free</strong> —
              creating events, collecting signed waivers, and managing attendees. No credit card, no trial
              period, no strings attached.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Down the road, we plan to introduce optional premium features for organizations that need
              advanced functionality like custom branding, analytics, and integrations. But the essentials?
              Those stay free.
            </p>
          </div>

          {/* CTA row */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!session?.user && (
                <Link
                  href="/auth/signup"
                  className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg shadow-brand/25 transition-all hover:shadow-xl hover:shadow-brand/35 hover:-translate-y-0.5 text-base"
                >
                  Create Free Account
                </Link>
              )}
              <Link
                href="/suggest"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 text-gray-300 hover:text-white font-semibold rounded-xl hover:bg-white/10 border border-white/15 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Suggest a Feature
              </Link>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              We&apos;re building Volntir based on real feedback. Tell us what you need.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
