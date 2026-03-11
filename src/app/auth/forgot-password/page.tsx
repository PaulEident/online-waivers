"use client";

import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions";
import Turnstile from "@/components/Turnstile";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!turnstileToken) {
      setError("Please complete the verification");
      setLoading(false);
      return;
    }

    const result = await requestPasswordReset({ email, turnstileToken });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-brand-dark to-gray-900" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center text-white px-12 max-w-md">
          <h2 className="text-3xl font-bold mb-3">Reset your password</h2>
          <p className="text-gray-400 leading-relaxed">
            We&apos;ll send you a link to reset your password and get back to managing your events.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-start lg:items-center justify-center px-6 py-8 bg-gray-50">
          <div className="w-full max-w-sm">
            {submitted ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                <p className="text-gray-500 text-sm mb-6">
                  If an account exists with that email, we&apos;ve sent a password reset link. Check your inbox.
                </p>
                <Link
                  href="/auth/signin"
                  className="text-brand hover:text-brand-hover font-medium text-sm"
                >
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1 mt-4 lg:mt-0">Forgot password?</h1>
                <p className="text-gray-500 text-sm mb-6">Enter your email and we&apos;ll send you a reset link</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-xl">{error}</div>
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white"
                  />

                  <Turnstile onVerify={setTurnstileToken} />

                  <button
                    type="submit"
                    disabled={loading || !turnstileToken}
                    className="w-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold h-11 px-4 rounded-xl transition-all disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Sending...
                      </span>
                    ) : "Send reset link"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  <Link href="/auth/signin" className="text-brand hover:text-brand-hover font-medium">
                    Back to sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
