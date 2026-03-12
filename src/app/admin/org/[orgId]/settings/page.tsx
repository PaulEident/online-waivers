"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateOrganization, getOrganization } from "@/lib/actions";
import { getVolunteerTimeConfig, updateVolunteerTimeConfig } from "@/lib/volunteer-actions";
import Link from "next/link";
import WaiverEditor from "@/components/WaiverEditor";

export default function OrgSettingsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const [name, setName] = useState("");
  const [waiverTemplate, setWaiverTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [vtEnabled, setVtEnabled] = useState(true);
  const [vtAutoExpireHours, setVtAutoExpireHours] = useState(12);
  const [vtRequireApproval, setVtRequireApproval] = useState(true);
  const [vtSaving, setVtSaving] = useState(false);
  const [vtMessage, setVtMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    getOrganization(orgId).then((org) => {
      if (org) {
        setName(org.name);
        setWaiverTemplate(org.waiverTemplate);
      }
      setLoading(false);
    });
  }, [orgId]);

  useEffect(() => {
    getVolunteerTimeConfig(orgId).then((config) => {
      if (config) {
        setVtEnabled(config.enabled);
        setVtAutoExpireHours(config.autoExpireHours);
        setVtRequireApproval(config.requireApproval);
      }
    });
  }, [orgId]);

  const handleVtSave = async () => {
    setVtSaving(true);
    setVtMessage("");
    const result = await updateVolunteerTimeConfig(orgId, {
      enabled: vtEnabled,
      autoExpireHours: vtAutoExpireHours,
      requireApproval: vtRequireApproval,
    });
    if (result.success) {
      setVtMessage("Volunteer tracking settings saved!");
      setTimeout(() => setVtMessage(""), 3000);
    }
    setVtSaving(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const result = await updateOrganization(orgId, { name, waiverTemplate });

    if (result.success) {
      setMessage("Settings saved!");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-300 text-sm mt-1">{name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Organization Details</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Default Waiver Template</h2>
            <p className="text-sm text-gray-500 mb-3">
              This template is used as the starting point when creating new events. Each event gets its own copy that can be customized.
            </p>
            <WaiverEditor
              content={waiverTemplate}
              onChange={setWaiverTemplate}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Volunteer Time Tracking</h2>
            {vtMessage && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700 mb-4">
                {vtMessage}
              </div>
            )}
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={vtEnabled}
                  onChange={(e) => setVtEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm font-medium text-gray-700">Enable volunteer time tracking</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-expire open sessions after (hours)
                </label>
                <input
                  type="number"
                  min={1}
                  value={vtAutoExpireHours}
                  onChange={(e) => setVtAutoExpireHours(parseInt(e.target.value) || 12)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={vtRequireApproval}
                  onChange={(e) => setVtRequireApproval(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm font-medium text-gray-700">Require admin approval for volunteer hours</span>
              </label>
              <button
                type="button"
                onClick={handleVtSave}
                disabled={vtSaving}
                className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors"
              >
                {vtSaving ? "Saving..." : "Save Tracking Settings"}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
            <Link
              href={`/admin/org/${orgId}`}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
