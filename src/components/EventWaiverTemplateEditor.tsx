"use client";

import { useState } from "react";
import { updateEventWaiverTemplate } from "@/lib/actions";

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

  const locked = waiverCount > 0;

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

      {message && (
        <div className={`rounded-md p-3 text-sm mb-3 ${
          message.includes("saved") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <p className="text-sm text-gray-500 mb-3">
        Available variables: <code className="bg-gray-100 px-1 rounded">{"{{ORG_NAME}}"}</code>{" "}
        <code className="bg-gray-100 px-1 rounded">{"{{EVENT_NAME}}"}</code>{" "}
        <code className="bg-gray-100 px-1 rounded">{"{{EVENT_DATE}}"}</code>{" "}
        <code className="bg-gray-100 px-1 rounded">{"{{EVENT_LOCATION}}"}</code>{" "}
        <code className="bg-gray-100 px-1 rounded">{"{{YEAR}}"}</code>
      </p>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={16}
        disabled={locked}
        className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-brand focus:border-brand disabled:bg-gray-50 disabled:text-gray-500"
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
