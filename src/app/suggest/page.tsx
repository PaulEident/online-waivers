"use client";

import { useState, FormEvent } from "react";

export default function SuggestFeaturePage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      category: (form.elements.namedItem("category") as HTMLSelectElement).value,
      feature: (form.elements.namedItem("feature") as HTMLTextAreaElement).value.trim(),
      problem: (form.elements.namedItem("problem") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send suggestion");
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand text-xs font-semibold mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Beta
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Suggest a Feature</h1>
          <p className="text-gray-500 leading-relaxed">
            Volntir is actively being built, and your input shapes what comes next.
            Tell us what would make the platform more useful for your organization or events.
          </p>
        </div>

        {status === "sent" ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Thanks for your suggestion!</h2>
            <p className="text-sm text-gray-600">
              We review every submission and prioritize features based on community feedback.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-brand font-medium hover:underline cursor-pointer"
            >
              Submit another idea
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                name="category"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-white"
              >
                <option value="">Select a category</option>
                <option value="waivers">Waivers &amp; Signatures</option>
                <option value="events">Event Management</option>
                <option value="checkin">Check-In &amp; Attendance</option>
                <option value="organization">Organization &amp; Team</option>
                <option value="reporting">Reporting &amp; Analytics</option>
                <option value="integrations">Integrations</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="feature" className="block text-sm font-medium text-gray-700 mb-1">
                What feature would you like to see?
              </label>
              <textarea
                id="feature"
                name="feature"
                required
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors resize-y"
                placeholder="Describe the feature you'd like..."
              />
            </div>

            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
                What problem would this solve? <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="problem"
                name="problem"
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors resize-y"
                placeholder="Help us understand the use case..."
              />
            </div>

            {status === "error" && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 border border-red-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {status === "sending" ? "Submitting..." : "Submit Suggestion"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
