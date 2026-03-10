"use client";

import { useState } from "react";

export default function CopyableUrl({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <span className="text-xs text-gray-500">{label}:</span>
      <div className="flex items-center gap-2 mt-0.5">
        <div className="flex-1 font-mono text-sm text-brand bg-brand-light px-3 py-2 rounded truncate">
          {url}
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
