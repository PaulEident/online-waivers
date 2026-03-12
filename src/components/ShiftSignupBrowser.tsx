"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrgUpcomingShifts, signupForSlot } from "@/lib/slot-actions";

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

type ShiftData = Awaited<ReturnType<typeof getOrgUpcomingShifts>>[number];

export default function ShiftSignupBrowser({
  orgId,
  volunteerEmail,
  volunteerName,
  familyMembers,
  onRefreshNeeded,
}: {
  orgId: string;
  volunteerEmail: string;
  volunteerName: string;
  familyMembers: { firstName: string; lastName: string }[];
  onRefreshNeeded?: () => void;
}) {
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingUp, setSigningUp] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<Record<string, Set<string>>>({});

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    const result = await getOrgUpcomingShifts(orgId);
    setShifts(result);
    setLoading(false);
  }, [orgId]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  function isSignedUp(slotId: string, familyMemberName: string = ""): boolean {
    const shift = shifts.find((s) => s.slots.some((slot) => slot.id === slotId));
    if (!shift) return false;
    const slot = shift.slots.find((s) => s.id === slotId);
    if (!slot) return false;
    return slot.signups.some(
      (s) => s.volunteerEmail === volunteerEmail.toLowerCase() && (s.familyMemberName || "") === familyMemberName
    );
  }

  function getSlotStatus(slot: ShiftData["slots"][number]) {
    const confirmed = slot.signups.filter((s) => s.status === "CONFIRMED").length;
    const waitlisted = slot.signups.filter((s) => s.status === "WAITLISTED").length;
    const spotsLeft = slot.maxVolunteers - confirmed;
    return { confirmed, waitlisted, spotsLeft };
  }

  async function handleSignup(slotId: string, familyMemberName: string = "") {
    setError("");
    setSuccess("");
    setSigningUp(`${slotId}-${familyMemberName}`);

    const displayName = familyMemberName || volunteerName;
    const result = await signupForSlot(slotId, volunteerEmail, volunteerName, familyMemberName);

    setSigningUp(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(
      result.status === "CONFIRMED"
        ? `${displayName} is confirmed!`
        : `${displayName} has been added to the waitlist.`
    );
    await fetchShifts();
    onRefreshNeeded?.();
  }

  async function handleSlotSignup(slotId: string) {
    // Sign up self
    const selfSignedUp = isSignedUp(slotId, "");
    if (!selfSignedUp) {
      await handleSignup(slotId, "");
    }

    // Sign up selected family members
    const selected = selectedFamily[slotId] || new Set();
    for (const key of selected) {
      const [firstName, lastName] = key.split("|");
      const fmName = `${firstName} ${lastName}`;
      if (!isSignedUp(slotId, fmName)) {
        await handleSignup(slotId, fmName);
      }
    }
  }

  function toggleFamilyMember(slotId: string, key: string) {
    setSelectedFamily((prev) => {
      const current = prev[slotId] || new Set();
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...prev, [slotId]: next };
    });
  }

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 text-sm">Loading available shifts...</div>;
  }

  if (shifts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 text-sm">No upcoming shifts available.</p>
      </div>
    );
  }

  // Group by event
  const byEvent = shifts.reduce<Record<string, { eventName: string; shifts: ShiftData[] }>>((acc, shift) => {
    const key = shift.event.id;
    if (!acc[key]) acc[key] = { eventName: shift.event.name, shifts: [] };
    acc[key].shifts.push(shift);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      {Object.entries(byEvent).map(([eventId, { eventName, shifts: eventShifts }]) => (
        <div key={eventId}>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{eventName}</h3>

          {eventShifts.map((shift) => (
            <div key={shift.id} className="bg-white rounded-lg shadow mb-3">
              <div className="p-4 border-b border-gray-100">
                <p className="font-medium text-gray-900">{shift.title}</p>
                {shift.description && (
                  <p className="text-sm text-gray-500 mt-1">{shift.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(shift.startTime)},{" "}
                  {formatTime(shift.startTime)} —{" "}
                  {formatTime(shift.endTime)}
                </p>
              </div>

              <div className="divide-y divide-gray-50">
                {shift.slots.map((slot) => {
                  const { spotsLeft, waitlisted } = getSlotStatus(slot);
                  const selfSignedUp = isSignedUp(slot.id, "");
                  const allSignedUp = selfSignedUp && familyMembers.every((fm) =>
                    isSignedUp(slot.id, `${fm.firstName} ${fm.lastName}`)
                  );

                  return (
                    <div key={slot.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-900">
                            {formatTime(slot.startTime)} —{" "}
                            {formatTime(slot.endTime)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {spotsLeft > 0
                              ? `${spotsLeft} of ${slot.maxVolunteers} spots left`
                              : `Full${waitlisted > 0 ? ` (${waitlisted} waitlisted)` : ""}`}
                          </p>
                        </div>

                        {allSignedUp ? (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            Signed Up
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {familyMembers.length > 0 && !selfSignedUp && (
                              <div className="flex flex-wrap gap-1">
                                {familyMembers.map((fm) => {
                                  const key = `${fm.firstName}|${fm.lastName}`;
                                  const fmName = `${fm.firstName} ${fm.lastName}`;
                                  if (isSignedUp(slot.id, fmName)) return null;
                                  const selected = selectedFamily[slot.id]?.has(key);
                                  return (
                                    <label key={key} className="flex items-center gap-1 text-xs cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={!!selected}
                                        onChange={() => toggleFamilyMember(slot.id, key)}
                                        className="h-3 w-3 rounded border-gray-300 text-brand focus:ring-brand"
                                      />
                                      {fm.firstName}
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                            <button
                              onClick={() => handleSlotSignup(slot.id)}
                              disabled={signingUp !== null}
                              className={`text-xs font-medium px-3 py-1 rounded-full disabled:opacity-50 ${
                                spotsLeft > 0
                                  ? "bg-brand text-white hover:bg-brand-hover"
                                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              }`}
                            >
                              {signingUp?.startsWith(slot.id) ? "..." : spotsLeft > 0 ? "Sign Up" : "Join Waitlist"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
