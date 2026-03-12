"use client";

import { useState, useEffect, useCallback } from "react";
import { getVolunteerSlotSignups, cancelSlotSignup } from "@/lib/slot-actions";

function formatTime(d: string | Date) {
  const date = new Date(d);
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(d: string | Date) {
  const date = new Date(d);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getUTCDay()]}, ${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

type Signup = Awaited<ReturnType<typeof getVolunteerSlotSignups>>[number];

export default function MyShiftsList({
  orgId,
  volunteerEmail,
  onRefreshNeeded,
}: {
  orgId: string;
  volunteerEmail: string;
  onRefreshNeeded?: () => void;
}) {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchSignups = useCallback(async () => {
    setLoading(true);
    const result = await getVolunteerSlotSignups(orgId, volunteerEmail);
    setSignups(result);
    setLoading(false);
  }, [orgId, volunteerEmail]);

  useEffect(() => {
    fetchSignups();
  }, [fetchSignups]);

  async function handleCancel(signupId: string) {
    if (!confirm("Cancel this shift signup?")) return;
    setCancelling(signupId);
    setError("");
    const result = await cancelSlotSignup(signupId, volunteerEmail);
    setCancelling(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    await fetchSignups();
    onRefreshNeeded?.();
  }

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 text-sm">Loading your shifts...</div>;
  }

  if (signups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 text-sm">You haven&apos;t signed up for any shifts yet.</p>
        <p className="text-gray-400 text-xs mt-1">Check the Browse Shifts tab to find available shifts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      {signups.map((signup) => (
        <div key={signup.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{signup.slot.shift.title}</p>
              {signup.familyMemberName && (
                <p className="text-xs text-gray-500">For: {signup.familyMemberName}</p>
              )}
              <p className="text-xs text-gray-500">{signup.slot.shift.event.name}</p>
              <p className="text-sm text-gray-700 mt-1">
                {formatDate(signup.slot.startTime)},{" "}
                {formatTime(signup.slot.startTime)} —{" "}
                {formatTime(signup.slot.endTime)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  signup.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {signup.status === "CONFIRMED" ? "Confirmed" : `Waitlist #${signup.waitlistPosition}`}
              </span>
              <button
                onClick={() => handleCancel(signup.id)}
                disabled={cancelling === signup.id}
                className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                {cancelling === signup.id ? "..." : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
