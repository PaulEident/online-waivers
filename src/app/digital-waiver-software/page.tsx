import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Digital Waiver Software for Events & Nonprofits",
  description:
    "Collect digital liability waivers at your events for free. Create custom waivers, share via link or QR code, and manage signed waivers — no paper required.",
  keywords: [
    "digital waiver software",
    "free digital waiver",
    "electronic liability waiver",
    "online waiver for events",
    "digital waiver nonprofit",
  ],
  openGraph: {
    title: "Free Digital Waiver Software for Events | Volntir",
    description:
      "Create custom liability waivers, share via link or QR code, and manage all signed waivers in one dashboard — completely free.",
  },
};

const steps = [
  {
    step: "1",
    title: "Create your waiver",
    desc: "Use the rich text editor to build a custom liability waiver for your organization or event.",
  },
  {
    step: "2",
    title: "Share via link or QR code",
    desc: "Every event gets a unique shareable link and QR code — perfect for emails, flyers, or door signage.",
  },
  {
    step: "3",
    title: "Participants sign on any device",
    desc: "Volunteers and attendees sign electronically on phone, tablet, or desktop. No app needed.",
  },
  {
    step: "4",
    title: "Manage from your dashboard",
    desc: "View, search, and verify all signed waivers in one place.",
  },
];

const useCases = [
  "Charity events and fun runs",
  "Community festivals and fairs",
  "Youth sports and camps",
  "Volunteer programs",
  "Any event requiring documented consent",
];

export default function DigitalWaiverSoftwarePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Free Digital Waiver Software for Events
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Paper waivers get lost. Email attachments don&apos;t get opened. Volntir makes it effortless — and
            completely free.
          </p>
          <Link
            href="/auth/signup"
            className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-base inline-block"
          >
            Create Your First Waiver Free
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="space-y-4 mb-12">
          {steps.map((item) => (
            <div key={item.step} className="flex gap-4 p-6 bg-white rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Built For</h2>
        <ul className="space-y-2 mb-10">
          {useCases.map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-700">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0"
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

        <p className="text-center text-gray-500 mb-8">
          Unlimited events. Unlimited signed waivers. Always free.
        </p>
        <div className="text-center">
          <Link
            href="/auth/signup"
            className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-base inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </main>
  );
}
