import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Use Volntir - Volntir",
  description: "A step-by-step guide to using Volntir for your events — from sharing waiver links to checking in attendees and keeping track of who's cleared.",
};

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-4 py-14 md:py-20 text-center">
          <p className="text-brand-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Getting Started
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            How to Use Volntir
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            From sharing your waiver link to checking in attendees on event day — here&apos;s how to get the most out of Volntir.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-14">

          {/* Step 1: Share Your Waiver Link */}
          <section>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Share Your Waiver Link</h2>
                <p className="text-gray-500 text-sm mt-1">Get your waiver in front of attendees before they arrive</p>
              </div>
            </div>

            <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
              <p>
                Every event in Volntir gets a short, shareable link (like <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono text-brand">volntir.com/e/ABC123</code>).
                Share it everywhere your attendees are — the more waivers signed ahead of time, the smoother your event day.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Social Media</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Post the link on Facebook, Instagram, or your group&apos;s page</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Your Website</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Add the link to your event page or registration info</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Email</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Include in event reminders or newsletters</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Text / SMS</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Text the short link directly — it&apos;s short enough to type</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm">
                <p className="text-brand-800">
                  <strong>💡 Tip:</strong> Encourage attendees to sign before the event. Pre-signed waivers speed up check-in dramatically.
                </p>
              </div>
            </div>
          </section>

          {/* Step 2: Print a QR Code */}
          <section>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Print a QR Code</h2>
                <p className="text-gray-500 text-sm mt-1">Let attendees scan and sign on the spot</p>
              </div>
            </div>

            <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
              <p>
                Every event has a downloadable QR code in your event dashboard. Download the PNG, print it out,
                and post it where attendees can see it. When they scan it with their phone camera, it takes them
                straight to the waiver.
              </p>

              <h3 className="font-bold text-gray-900 text-sm">Great places to post your QR code:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Registration table or sign-in desk</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Venue entrance or doorway</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Trailhead, parking area, or meeting point</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Posted on a clipboard or easel at the event</span>
                </li>
              </ul>

              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm">
                <p className="text-brand-800">
                  <strong>💡 Tip:</strong> Print a few copies on standard letter paper. The QR code includes
                  the event name and &quot;Scan to Sign Waiver&quot; instructions so attendees know exactly what to do.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3: Check In Attendees */}
          <section>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Check In Attendees</h2>
                <p className="text-gray-500 text-sm mt-1">Verify waivers and mark arrivals in real time</p>
              </div>
            </div>

            <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
              <p>
                Once an attendee signs their waiver, they show up in your event&apos;s check-in list on Volntir.
                On event day, open the check-in page on a phone, tablet, or laptop:
              </p>

              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 mt-0.5">1</div>
                  <p className="text-sm"><strong>Search by name</strong> — start typing to find the attendee instantly</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 mt-0.5">2</div>
                  <p className="text-sm"><strong>Verify waiver status</strong> — see at a glance if their waiver is signed</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-xs font-bold text-accent shrink-0 mt-0.5">3</div>
                  <p className="text-sm"><strong>Tap to check in</strong> — one tap marks them as arrived</p>
                </div>
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm">
                <p className="text-brand-800">
                  <strong>💡 Tip:</strong> Assign an event manager in your dashboard so a volunteer can run check-in from their own phone without needing full admin access.
                </p>
              </div>
            </div>
          </section>

          {/* Step 4: Mark Who's Checked In */}
          <section>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Mark Who&apos;s Checked In</h2>
                <p className="text-gray-500 text-sm mt-1">Simple visual methods so anyone can tell at a glance</p>
              </div>
            </div>

            <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
              <p>
                After checking someone in on Volntir, use a quick visual marker so staff and volunteers can
                instantly tell who&apos;s been cleared — no need to check a screen every time.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Colored Marker on the Hand</h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      A small mark on the back of the hand with a washable marker. Fast, cheap, and easy to spot. Use a
                      different color or symbol for each event to prevent reuse.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Tyvek Wristband</h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Inexpensive, single-use wristbands that can&apos;t be transferred. Great for longer events or
                      venues where you need to verify attendees at multiple points.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Zip Tie on a Zipper Pull</h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      A small colored zip tie attached to a jacket zipper or bag. Discreet, durable, and works well
                      for outdoor events where hands get dirty or wet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm">
                <p className="text-brand-800">
                  <strong>💡 Tip:</strong> Whichever method you choose, keep it consistent across your event staff so everyone knows
                  what to look for. A quick briefing before the event goes a long way.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-14 bg-brand-dark rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Ready to Try It?</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">
            Create your free account, set up your first event, and share your waiver link in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/our-story"
              className="px-6 py-2.5 bg-white/5 text-gray-300 hover:text-white font-semibold rounded-xl border border-white/15 hover:bg-white/10 transition-colors text-sm"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
