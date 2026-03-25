import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free SignUpGenius Alternative for Nonprofits",
  description:
    "Tired of SignUpGenius ads and limitations? Volntir is a free alternative with volunteer shift signups, digital waivers, check-ins, and hour tracking — built for nonprofits.",
  keywords: [
    "SignUpGenius alternative",
    "free SignUpGenius alternative",
    "nonprofit volunteer signup",
    "volunteer management free",
  ],
  openGraph: {
    title: "A Better Free Alternative to SignUpGenius for Nonprofits | Volntir",
    description:
      "Volntir replaces SignUpGenius with volunteer shift signups, digital waivers, check-ins, and hour tracking — all free, no ads.",
  },
};

const comparison = [
  { feature: "Volunteer shift signups", volntir: "✓ Free", signupgenius: "Limited (free tier)" },
  { feature: "Digital liability waivers", volntir: "✓ Free", signupgenius: "✗" },
  { feature: "Volunteer hour tracking", volntir: "✓ Free", signupgenius: "✗" },
  { feature: "QR code check-in", volntir: "✓ Free", signupgenius: "✗" },
  { feature: "Ad-free experience", volntir: "✓ Always", signupgenius: "✗ (free plan)" },
  { feature: "Built for nonprofits", volntir: "✓ Yes", signupgenius: "Partial" },
];

export default function FreeSignUpGeniusAlternativePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            A Better (Free) Alternative to SignUpGenius for Nonprofits
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            No ads. No upgrade walls. Just the tools you actually need.
          </p>
          <Link
            href="/auth/signup"
            className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-base inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-lg text-gray-700 mb-10">
          SignUpGenius works — until it doesn&apos;t. Ads cluttering your volunteer signup pages. Limited management
          tools. No waiver collection. No hour tracking. Volntir gives you everything SignUpGenius doesn&apos;t, and
          it&apos;s completely free.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Volntir vs. SignUpGenius</h2>
        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-semibold text-gray-700">Feature</th>
                <th className="text-center p-4 font-semibold text-brand">Volntir</th>
                <th className="text-center p-4 font-semibold text-gray-500">SignUpGenius</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-4 text-gray-700">{row.feature}</td>
                  <td className="p-4 text-center text-green-600 font-semibold">{row.volntir}</td>
                  <td className="p-4 text-center text-gray-500">{row.signupgenius}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center">
          <Link
            href="/auth/signup"
            className="px-10 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-base inline-block"
          >
            Switch to Volntir — It&apos;s Free
          </Link>
        </div>
      </div>
    </main>
  );
}
