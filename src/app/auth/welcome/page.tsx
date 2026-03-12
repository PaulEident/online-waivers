"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { setMarketingOptIn } from "@/lib/actions";

function WelcomeForm() {
  const { data: session } = useSession();
  const [marketingOptIn, setOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await setMarketingOptIn(marketingOptIn);
    window.location.href = callbackUrl;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome to Volntir{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!
            </h1>
            <p className="text-gray-500 text-sm">
              Your account has been created. One quick thing before you get started.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-brand/30 transition-colors">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setOptIn(e.target.checked)}
              className="mt-0.5 h-5 w-5 text-brand border-gray-300 rounded focus:ring-brand"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Send me occasional updates
              </span>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Get notified about new features and volunteer opportunities. We email infrequently and never share your information with third parties.
              </p>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold h-11 px-4 rounded-xl transition-all disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : (
              "Continue to Dashboard"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <WelcomeForm />
    </Suspense>
  );
}
