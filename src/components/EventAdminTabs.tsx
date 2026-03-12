"use client";

import { useState, type ReactNode } from "react";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "edit", label: "Edit Event" },
  { key: "shifts", label: "Volunteer Shifts" },
  { key: "waiver", label: "Waiver Template" },
  { key: "managers", label: "Managers" },
  { key: "settings", label: "Settings" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function EventAdminTabs({
  children,
}: {
  children: Record<TabKey, ReactNode>;
}) {
  const [active, setActive] = useState<TabKey>("overview");

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === tab.key
                ? "border-brand text-brand"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{children[active]}</div>
    </div>
  );
}
