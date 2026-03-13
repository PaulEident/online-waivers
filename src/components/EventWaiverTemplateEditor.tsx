"use client";

import { useState, useEffect } from "react";
import { updateEventWaiverTemplate } from "@/lib/actions";
import WaiverEditor from "@/components/WaiverEditor";

export default function EventWaiverTemplateEditor({
  eventId,
  template,
  orgTemplate,
  waiverCount,
}: {
  eventId: string;
  template: string;
  orgTemplate: string;
  waiverCount: number;
}) {
  const [value, setValue] = useState(template);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  const locked = waiverCount > 0;

  useEffect(() => {
    const dismissed = localStorage.getItem("attorney-recommendation-dismissed");
    if (!dismissed) {
      setShowBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    localStorage.setItem("attorney-recommendation-dismissed", "true");
    setShowBanner(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const result = await updateEventWaiverTemplate(eventId, value);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Template saved!");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  const handleReset = () => {
    setValue(orgTemplate);
  };

  return (
    <div>
      {locked && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 mb-3">
          This waiver has been signed by {waiverCount} participant{waiverCount !== 1 ? "s" : ""} and cannot be edited.
        </div>
      )}

      {showBanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3 relative">
          <button
            onClick={dismissBanner}
            className="absolute top-2 right-2 text-amber-400 hover:text-amber-600 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h4 className="text-sm font-bold text-amber-900 mb-1">A note on waiver language</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            The effectiveness of a liability waiver depends entirely on how it&apos;s written — and what&apos;s enforceable varies by state, event type, and activity. Volntir gives you a flexible editor to build and collect waivers, but we&apos;re not able to guarantee that any particular waiver language will hold up in court.
          </p>
          <p className="text-sm text-amber-800 leading-relaxed mt-2">
            We strongly recommend consulting a licensed attorney to draft or review your waiver before using it for your events. An attorney familiar with your state and activity type can ensure your waiver covers the risks specific to your organization.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <p className="text-sm text-blue-800 leading-relaxed">
          Volntir provides the tools to collect waivers, but the language in your waiver determines your legal protection. We recommend working with an attorney familiar with your event type and jurisdiction to draft waiver language specific to your organization&apos;s needs.
        </p>
      </div>

      {message && (
        <div className={`rounded-md p-3 text-sm mb-3 ${
          message.includes("saved") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <WaiverEditor
        content={value}
        onChange={setValue}
        editable={!locked}
      />

      {!locked && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Template"}
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset to Org Default
          </button>
        </div>
      )}
    </div>
  );
}
