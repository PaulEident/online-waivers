import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand-dark text-white relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-gray-800 to-brand-dark opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="mb-6">
            <Image
              src="/volntir_logo_dark.svg"
              alt="Volntir"
              width={200}
              height={53}
              priority
              className="mx-auto"
            />
          </div>
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-4">
            Volunteering, Together
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Digital Waivers,<br />Simplified
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Collect digital liability waivers for your events. Manage organizations,
            check in attendees, and keep everything organized.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="px-8 py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-lg shadow-lg shadow-brand/20 transition-all hover:shadow-xl hover:shadow-brand/30"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 border border-white/20 transition-all backdrop-blur-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">Everything you need</h2>
        <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">
          From waiver signing to event check-in, Volntir handles the paperwork so you can focus on what matters.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl hover:bg-white hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-brand-light rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Digital Waivers</h3>
            <p className="text-sm text-gray-600">
              Customizable waiver templates with electronic signatures. One waiver per user per event.
            </p>
          </div>
          <div className="text-center p-6 rounded-xl hover:bg-white hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Event Check-In</h3>
            <p className="text-sm text-gray-600">
              Search attendees by name, see waiver status, and check them in on arrival.
            </p>
          </div>
          <div className="text-center p-6 rounded-xl hover:bg-white hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Multi-Tenant</h3>
            <p className="text-sm text-gray-600">
              Multiple organizations, each with their own events, members, and waiver templates.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-200">
        <Image
          src="/volntir_logo_light.svg"
          alt="Volntir"
          width={90}
          height={24}
          className="mx-auto mb-2 opacity-40"
        />
        Volunteering, Together
      </footer>
    </main>
  );
}
