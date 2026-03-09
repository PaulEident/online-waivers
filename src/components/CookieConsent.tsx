"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up">
      <div className="max-w-3xl mx-auto bg-brand-dark text-white rounded-xl shadow-2xl border border-gray-700 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm leading-relaxed">
          <p>
            We use essential cookies to keep you signed in and make the site work.
            No tracking or advertising cookies are used.{" "}
            <Link href="/privacy" className="underline text-brand-500 hover:text-brand-100 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 bg-brand hover:bg-brand-hover text-white font-semibold text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
