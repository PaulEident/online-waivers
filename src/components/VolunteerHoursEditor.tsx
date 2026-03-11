"use client";

import { useState } from "react";
import { verifyVolunteerHours } from "@/lib/actions";

interface VolunteerHoursEditorProps {
  waiverId: string;
  reportedHours: number | null;
  verifiedHours: number | null;
}

export default function VolunteerHoursEditor({ waiverId, reportedHours, verifiedHours }: VolunteerHoursEditorProps) {
  const [hours, setHours] = useState(verifiedHours?.toString() ?? reportedHours?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(verifiedHours !== null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    const parsed = parseFloat(hours);
    if (isNaN(parsed) || parsed < 0) {
      setError("Enter a valid number");
      return;
    }

    setSaving(true);
    setError("");
    const result = await verifyVolunteerHours(waiverId, parsed);
    setSaving(false);

    if (result && "error" in result) {
      setError(result.error || "Unknown error");
    } else {
      setSaved(true);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {reportedHours !== null && (
        <span className="text-xs text-gray-500" title="Reported by participant">
          {reportedHours}h reported
        </span>
      )}
      <input
        type="number"
        min="0"
        step="0.5"
        value={hours}
        onChange={(e) => { setHours(e.target.value); setSaved(false); }}
        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-brand focus:border-brand"
      />
      <button
        onClick={handleVerify}
        disabled={saving || saved}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          saved
            ? "bg-green-100 text-green-700"
            : "bg-brand text-white hover:bg-brand-hover disabled:opacity-50"
        }`}
      >
        {saving ? "..." : saved ? "Verified" : "Verify"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
