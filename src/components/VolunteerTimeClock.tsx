"use client";

import { useState } from "react";
import {
  lookupVolunteerByEmail,
  clockIn,
  clockOut,
  resolveExpiredSession,
  submitManualEntry,
} from "@/lib/volunteer-actions";

interface VolunteerInfo {
  name: string;
  email: string;
  familyMembers: { firstName: string; lastName: string }[];
}

interface OpenSession {
  id: string;
  volunteerName: string;
  familyMemberName: string | null;
  clockIn: Date;
}

export default function VolunteerTimeClock({
  orgId,
  orgSlug,
  orgName,
  latestEventSlug,
}: {
  orgId: string;
  orgSlug: string;
  orgName: string;
  latestEventSlug?: string;
}) {
  const [email, setEmail] = useState("");
  const [volunteer, setVolunteer] = useState<VolunteerInfo | null>(null);
  const [openSessions, setOpenSessions] = useState<OpenSession[]>([]);
  const [expiredSessions, setExpiredSessions] = useState<OpenSession[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualStartTime, setManualStartTime] = useState("");
  const [manualEndTime, setManualEndTime] = useState("");
  const [expireEndTimes, setExpireEndTimes] = useState<Record<string, string>>({});

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await lookupVolunteerByEmail(orgId, email);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setVolunteer(null);
      return;
    }

    setVolunteer(result.volunteer || null);
    setOpenSessions(
      (result.openSessions || []).map((s) => ({
        ...s,
        clockIn: new Date(s.clockIn),
      }))
    );
    setExpiredSessions(
      (result.expiredSessions || []).map((s) => ({
        ...s,
        clockIn: new Date(s.clockIn),
      }))
    );
  }

  async function handleClockIn() {
    if (selectedPeople.size === 0) {
      setError("Select at least one person to clock in");
      return;
    }
    setError("");
    setLoading(true);

    const entries = Array.from(selectedPeople).map((key) => {
      if (key === "__self__") {
        return { volunteerName: volunteer!.name };
      }
      const [firstName, lastName] = key.split("|");
      return {
        volunteerName: volunteer!.name,
        familyMemberName: `${firstName} ${lastName}`,
      };
    });

    const result = await clockIn(orgId, email, entries);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("Clocked in successfully!");
    setSelectedPeople(new Set());
    // Re-lookup to refresh state
    const refreshed = await lookupVolunteerByEmail(orgId, email);
    if (refreshed.volunteer) {
      setVolunteer(refreshed.volunteer);
      setOpenSessions(
        (refreshed.openSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
      setExpiredSessions(
        (refreshed.expiredSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
    }
  }

  async function handleClockOut(sessionId: string) {
    setError("");
    setLoading(true);
    const result = await clockOut(sessionId);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    const mins = result.totalMinutes || 0;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    setSuccess(`Clocked out! Total: ${h > 0 ? `${h}h ` : ""}${m}m`);

    // Re-lookup
    const refreshed = await lookupVolunteerByEmail(orgId, email);
    if (refreshed.volunteer) {
      setOpenSessions(
        (refreshed.openSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
      setExpiredSessions(
        (refreshed.expiredSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
    }
  }

  async function handleResolveExpired(sessionId: string) {
    const endTime = expireEndTimes[sessionId];
    if (!endTime) {
      setError("Please enter the actual end time");
      return;
    }
    setError("");
    setLoading(true);
    const result = await resolveExpiredSession(sessionId, endTime);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("Session updated and submitted for review");
    // Re-lookup
    const refreshed = await lookupVolunteerByEmail(orgId, email);
    if (refreshed.volunteer) {
      setOpenSessions(
        (refreshed.openSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
      setExpiredSessions(
        (refreshed.expiredSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedPeople.size === 0) {
      setError("Select at least one person");
      return;
    }
    setError("");
    setLoading(true);

    const entries = Array.from(selectedPeople).map((key) => {
      if (key === "__self__") {
        return {
          volunteerName: volunteer!.name,
          date: manualDate,
          startTime: manualStartTime,
          endTime: manualEndTime,
        };
      }
      const [firstName, lastName] = key.split("|");
      return {
        volunteerName: volunteer!.name,
        familyMemberName: `${firstName} ${lastName}`,
        date: manualDate,
        startTime: manualStartTime,
        endTime: manualEndTime,
      };
    });

    const result = await submitManualEntry(orgId, email, entries);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("Hours submitted for review!");
    setShowManualEntry(false);
    setManualDate("");
    setManualStartTime("");
    setManualEndTime("");
    setSelectedPeople(new Set());
  }

  function togglePerson(key: string) {
    setSelectedPeople((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Email Lookup */}
      {!volunteer && (
        <form onSubmit={handleLookup} className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your email to get started
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover disabled:opacity-50"
            >
              {loading ? "Looking up..." : "Continue"}
            </button>
          </div>
          {error && (
            <div className="mt-4">
              <p className="text-red-600 text-sm">{error}</p>
              {error.includes("No waiver") && latestEventSlug && (
                <a
                  href={`/events/${orgSlug}/${latestEventSlug}`}
                  className="text-brand text-sm underline mt-1 inline-block"
                >
                  Sign a waiver here
                </a>
              )}
            </div>
          )}
        </form>
      )}

      {/* Volunteer Found */}
      {volunteer && (
        <>
          {/* Header with change email */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {volunteer.name}
                </h2>
                <p className="text-sm text-gray-500">{volunteer.email}</p>
              </div>
              <button
                onClick={() => {
                  setVolunteer(null);
                  setEmail("");
                  setError("");
                  setSuccess("");
                  setOpenSessions([]);
                  setExpiredSessions([]);
                  setSelectedPeople(new Set());
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Change email
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Expired Sessions */}
          {expiredSessions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-amber-800 mb-3">
                Expired Sessions — Please enter actual end time
              </h3>
              {expiredSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-700">
                    {session.familyMemberName || session.volunteerName} —{" "}
                    {new Date(session.clockIn).toLocaleDateString()}{" "}
                    {new Date(session.clockIn).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <input
                    type="datetime-local"
                    value={expireEndTimes[session.id] || ""}
                    onChange={(e) =>
                      setExpireEndTimes((prev) => ({
                        ...prev,
                        [session.id]: e.target.value,
                      }))
                    }
                    className="rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => handleResolveExpired(session.id)}
                    disabled={loading}
                    className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Open Sessions */}
          {openSessions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Currently Clocked In
              </h3>
              {openSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.familyMemberName || session.volunteerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Since{" "}
                      {new Date(session.clockIn).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleClockOut(session.id)}
                    disabled={loading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    Clock Out
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Person Selection + Clock In / Manual Entry */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {showManualEntry ? "Add Past Hours" : "Clock In"}
            </h3>

            {/* Person checkboxes */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPeople.has("__self__")}
                  onChange={() => togglePerson("__self__")}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm font-medium text-gray-900">
                  {volunteer.name} (me)
                </span>
              </label>
              {volunteer.familyMembers.map((fm) => {
                const key = `${fm.firstName}|${fm.lastName}`;
                return (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPeople.has(key)}
                      onChange={() => togglePerson(key)}
                      className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-gray-900">
                      {fm.firstName} {fm.lastName}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Manual Entry Fields */}
            {showManualEntry ? (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={manualStartTime}
                      onChange={(e) => setManualStartTime(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      required
                      value={manualEndTime}
                      onChange={(e) => setManualEndTime(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Hours"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowManualEntry(false)}
                    className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleClockIn}
                  disabled={loading || selectedPeople.size === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Clocking in..." : "Clock In"}
                </button>
                <button
                  onClick={() => setShowManualEntry(true)}
                  className="text-gray-600 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Add Past Hours
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
