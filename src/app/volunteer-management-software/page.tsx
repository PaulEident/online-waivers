import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Volunteer Management Software for Nonprofits",
  description:
    "Looking for volunteer management software? Volntir is 100% free — shift signups, digital waivers, check-ins, and hour tracking for nonprofits and events of any size.",
  keywords: [
    "volunteer management software",
    "nonprofit volunteer management",
    "free volunteer software",
    "volunteer scheduling",
    "volunteer tracking",
  ],
  openGraph: {
    title: "Free Volunteer Management Software for Nonprofits | Volntir",
    description:
      "Volntir is 100% free volunteer management software — shift signups, digital waivers, check-ins, and hour tracking for nonprofits and events.",
  },
};

const features = [
  "Volunteer shift signups with time slots, waitlists, and family member support",
  "Digital waivers — custom liability waivers signed electronically on any device",
  "Check-in management with QR codes and shareable event links",
  "Volunteer hour tracking — clock in/out or log past hours, with admin review and approval",
  "Team management — designate org managers to oversee events",
  "Works on desktop, tablet, or phone — no app install needed",
];

export default function VolunteerManagementSoftwarePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Free Volunteer Management Software for Nonprofits
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Managing volunteers should not require a spreadsheet, a separate email thread, and a prayer that everyone shows up.
          </p>
          <Link
            href="/auth/signup"
            className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-base inline-block"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-lg text-gray-700 mb-10">
          Volntir is free volunteer management software built for nonprofits and event organizers who need a simple,
          reliable way to recruit, schedule, and track volunteers — without paying enterprise prices or learning a
          complex platform.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">What Volntir Does</h2>
        <ul className="space-y-3 mb-12">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-700">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Who It&apos;s For</h2>
        <p className="text-gray-700 mb-10">
          Nonprofits, charities, community organizations, civic clubs, schools, and anyone running events that rely on
          volunteers.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Always Free</h2>
        <p className="text-gray-700 mb-10">
          No credit card. No trial period. No strings. The core features — events, waivers, check-ins, shift signups,
          and hour tracking — are always free.
        </p>

        <div className="text-center">
          <Link
            href="/auth/signup"
            className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-base inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </main>
  );
}
