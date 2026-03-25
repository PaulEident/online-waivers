import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Volunteer Hour Tracking Software",
  description:
    "Track volunteer hours for free with Volntir. Volunteers clock in/out or log past hours. Admins review and approve. Perfect for nonprofits, schools, and community service programs.",
  keywords: [
    "volunteer hour tracking",
    "free volunteer hours",
    "community service hours tracking",
    "nonprofit volunteer hours",
    "volunteer time tracking",
  ],
  openGraph: {
    title: "Free Volunteer Hour Tracking for Nonprofits & Events | Volntir",
    description:
      "Track volunteer hours for free — volunteers clock in/out or log hours, admins review and approve. No spreadsheets.",
  },
};

const steps = [
  {
    step: "1",
    title: "Volunteers clock in and out",
    desc: "At your event, volunteers clock in and out directly — or log their hours after the fact.",
  },
  {
    step: "2",
    title: "Admins review and approve",
    desc: "Review all submitted hours in one dashboard and approve with a click.",
  },
  {
    step: "3",
    title: "Records stay organized",
    desc: "All approved hours are stored and accessible for reporting, grant applications, or volunteer recognition.",
  },
];

const useCases = [
  "Nonprofits tracking volunteer contributions",
  "Schools managing community service requirements",
  "Civic organizations and service clubs",
  "Courts and programs requiring volunteer hours documentation",
  "Any event that needs organized hour records",
];

export default function VolunteerHourTrackingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Free Volunteer Hour Tracking for Nonprofits &amp; Events
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            No spreadsheets. No paper sign-in sheets. No chasing people down after the event.
          </p>
          <Link
            href="/auth/signup"
            className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-base inline-block"
          >
            Start Tracking Hours Free
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-lg text-gray-700 mb-10">
          Whether you&apos;re running a one-day charity event or a year-round volunteer program, tracking hours
          shouldn&apos;t be a manual headache.
        </p>

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

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfect For</h2>
        <ul className="space-y-2 mb-12">
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
