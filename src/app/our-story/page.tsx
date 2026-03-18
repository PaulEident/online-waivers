import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story - Volntir",
  description: "Learn how Volntir started — built by nonprofit officers who were tired of paper waivers and messy attendance sheets, and grew into a platform for every organization.",
};

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-4 py-14 md:py-20 text-center">
          <p className="text-brand-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Our Story
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Built by Organizers,<br />
            <span className="bg-gradient-to-r from-brand-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              for Organizers
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Volntir wasn&apos;t born in a boardroom. It started at an event — with a clipboard, a pen, and a stack of paper waivers.
          </p>
        </div>
      </div>

      {/* Story content */}
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-10 text-gray-700 text-[15px] md:text-base leading-relaxed">

          {/* The Problem */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">The Problem We Lived</h2>
            </div>
            <p>
              We&apos;re officers of several nonprofit organizations, and we know firsthand how frustrating event logistics
              can be. Paper waivers get lost. Attendance sheets are hard to read. And by the time you&apos;re done sorting
              through it all, the event is over and you&apos;re left with a stack of paperwork that nobody wants to deal with.
            </p>
          </section>

          {/* The First Build */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">A Simple Solution</h2>
            </div>
            <p>
              So we built a simple online waiver form and attendance management tool for one of our own events. Nothing
              fancy — just a way for people to sign a waiver on their phone and for us to check them in on arrival. It
              replaced the clipboard and the filing cabinet, and it worked really well.
            </p>
          </section>

          {/* The Spark */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Word Spread</h2>
            </div>
            <p>
              What we didn&apos;t expect was the reaction. Several attendees at that first event were officers of other
              organizations, and they asked if we could build something similar for their events. That&apos;s when we realized
              this wasn&apos;t just our problem — it&apos;s a challenge that organizations everywhere face.
            </p>
          </section>

          {/* The Mission */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p>
              Volntir exists to help organizations protect themselves with proper waivers, stay organized with attendance,
              coordinate volunteers through shift signups, and track volunteer hours — all without the headache. We believe
              every group, club, and nonprofit should have access to tools that make running events easier, regardless of
              their budget.
            </p>
          </section>

          {/* Looking Ahead */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">What&apos;s Next</h2>
            </div>
            <p>
              Volntir is currently in beta, and we&apos;re actively building based on feedback from real organizers like you.
              The core features — creating events, collecting signed waivers, managing attendees, volunteer shift signups,
              and volunteer hours tracking — will always be free. We&apos;re continuing to add tools that make organizing
              easier, and we&apos;d love to hear what would help your organization most.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gray-100 rounded-2xl p-6 md:p-8 text-center border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Help Us Build Something Better</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
            Have an idea that would make Volntir more useful for your organization? We&apos;re all ears.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/suggest"
              className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
            >
              Suggest a Feature
            </Link>
            <Link
              href="/support"
              className="px-6 py-2.5 bg-white text-gray-700 hover:text-gray-900 font-semibold rounded-xl border border-gray-300 hover:border-gray-400 transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
