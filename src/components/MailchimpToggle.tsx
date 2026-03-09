"use client";

import { useState } from "react";
import { toggleMailchimp } from "@/lib/actions";

export default function MailchimpToggle({ orgId, enabled }: { orgId: string; enabled: boolean }) {
  const [on, setOn] = useState(enabled);
  const [saving, setSaving] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    const result = await toggleMailchimp(orgId, !on);
    if (result.success) setOn(!on);
    setSaving(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
        on
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } disabled:opacity-50`}
      title={on ? "Mailchimp enabled — click to disable" : "Mailchimp disabled — click to enable"}
    >
      {saving ? "..." : on ? "Mailchimp ON" : "Mailchimp OFF"}
    </button>
  );
}
