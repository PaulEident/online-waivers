"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createShift,
  createShiftsForDays,
  updateShift,
  deleteShift,
  updateSlot,
  deleteSlot,
} from "@/lib/slot-actions";

interface SlotSignup {
  id: string;
  volunteerEmail: string;
  volunteerName: string;
  familyMemberName: string;
  status: "CONFIRMED" | "WAITLISTED" | "CANCELLED";
  waitlistPosition: number | null;
}

interface Slot {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  maxVolunteers: number;
  signups: SlotSignup[];
}

interface Shift {
  id: string;
  title: string;
  description: string | null;
  startTime: string | Date;
  endTime: string | Date;
  slotDurationMinutes: number;
  defaultMaxVolunteers: number;
  slots: Slot[];
}

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

function formatDateKey(d: string | Date) {
  const date = new Date(d);
  return date.toISOString().slice(0, 10);
}

export default function ShiftManager({
  eventId,
  initialShifts,
  eventDate,
  eventEndDate,
}: {
  eventId: string;
  initialShifts: Shift[];
  eventDate?: string | null;
  eventEndDate?: string | null;
}) {
  const router = useRouter();
  const shifts = initialShifts;
  const [showForm, setShowForm] = useState(false);
  const [expandedShift, setExpandedShift] = useState<string | null>(null);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [editingShift, setEditingShift] = useState<string | null>(null);
  const [editCapacity, setEditCapacity] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [customDuration, setCustomDuration] = useState("");
  const [maxVol, setMaxVol] = useState("2");

  // Multi-day state
  const isMultiDay = eventDate && eventEndDate && eventDate !== eventEndDate;
  const [dayMode, setDayMode] = useState<"single" | "multiple" | "recurring">("single");
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [selectedWeekdays, setSelectedWeekdays] = useState<Set<number>>(new Set());
  const [singleDate, setSingleDate] = useState("");

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  function getEventDateRange(): string[] {
    if (!eventDate) return [];
    const start = new Date(eventDate);
    const end = eventEndDate ? new Date(eventEndDate) : start;
    const dates: string[] = [];
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);
    while (current <= endDay) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  function getDatesFromWeekdays(): string[] {
    const range = getEventDateRange();
    return range.filter((d) => selectedWeekdays.has(new Date(d + "T12:00:00").getDay()));
  }

  function getSelectedDatesList(): string[] {
    if (!isMultiDay) {
      return eventDate ? [new Date(eventDate).toISOString().slice(0, 10)] : [];
    }
    switch (dayMode) {
      case "single":
        return singleDate ? [singleDate] : [];
      case "multiple":
        return Array.from(selectedDates).sort();
      case "recurring":
        return getDatesFromWeekdays();
      default:
        return [];
    }
  }

  const slotDuration = duration === "custom" ? parseInt(customDuration) || 0 : parseInt(duration);
  const previewSlotCount = (() => {
    if (!startTime || !endTime || !slotDuration) return 0;
    // Use dummy date for time-of-day calculation
    const s = new Date(`2000-01-01T${startTime}`);
    const e = new Date(`2000-01-01T${endTime}`);
    const total = (e.getTime() - s.getTime()) / 60000;
    return total > 0 ? Math.floor(total / slotDuration) : 0;
  })();
  const previewDays = getSelectedDatesList().length;

  async function handleCreateShift(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const dates = getSelectedDatesList();

    if (dates.length === 0) {
      setError("Select at least one date");
      setLoading(false);
      return;
    }

    let result;
    if (dates.length === 1) {
      result = await createShift(eventId, {
        title,
        description: description || undefined,
        startTime: `${dates[0]}T${startTime}`,
        endTime: `${dates[0]}T${endTime}`,
        slotDurationMinutes: slotDuration,
        defaultMaxVolunteers: parseInt(maxVol),
      });
    } else {
      result = await createShiftsForDays(
        eventId,
        {
          title,
          description: description || undefined,
          startTimeOfDay: startTime,
          endTimeOfDay: endTime,
          slotDurationMinutes: slotDuration,
          defaultMaxVolunteers: parseInt(maxVol),
        },
        dates
      );
    }

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Reset form
    setShowForm(false);
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setDuration("60");
    setCustomDuration("");
    setMaxVol("2");
    setSelectedDates(new Set());
    setSelectedWeekdays(new Set());
    setSingleDate("");
    router.refresh();
  }

  async function handleUpdateShift(shiftId: string) {
    setLoading(true);
    const result = await updateShift(shiftId, {
      title: editTitle,
      description: editDescription,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditingShift(null);
    router.refresh();
  }

  async function handleDeleteShift(shiftId: string, shiftTitle: string) {
    if (!confirm(`Delete shift "${shiftTitle}"? All slots and signups will be removed and volunteers notified.`)) return;
    setLoading(true);
    const result = await deleteShift(shiftId);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleUpdateSlotCapacity(slotId: string) {
    const newMax = editCapacity[slotId];
    if (newMax === undefined) return;
    setLoading(true);
    const result = await updateSlot(slotId, { maxVolunteers: newMax });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditCapacity((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    router.refresh();
  }

  async function handleDeleteSlot(slotId: string) {
    if (!confirm("Delete this slot? Signed-up volunteers will be notified.")) return;
    setLoading(true);
    const result = await deleteSlot(slotId);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  // Group shifts by date
  const shiftsByDate = shifts.reduce<Record<string, Shift[]>>((acc, shift) => {
    const key = formatDateKey(shift.startTime);
    if (!acc[key]) acc[key] = [];
    acc[key].push(shift);
    return acc;
  }, {});

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Volunteer Shifts</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-hover"
        >
          {showForm ? "Cancel" : "Add Shift"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Create Shift Form */}
      {showForm && (
        <form onSubmit={handleCreateShift} className="border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Registration Table"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Multi-day date selection */}
          {isMultiDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
              <div className="flex gap-2 mb-3">
                {(["single", "multiple", "recurring"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDayMode(mode)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      dayMode === mode
                        ? "bg-brand text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {mode === "single" ? "Single Day" : mode === "multiple" ? "Select Days" : "Recurring"}
                  </button>
                ))}
              </div>

              {dayMode === "single" && (
                <input
                  type="date"
                  required
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  min={eventDate ? new Date(eventDate).toISOString().slice(0, 10) : undefined}
                  max={eventEndDate ? new Date(eventEndDate).toISOString().slice(0, 10) : undefined}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              )}

              {dayMode === "multiple" && (
                <div className="flex flex-wrap gap-2">
                  {getEventDateRange().map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDates((prev) => {
                          const next = new Set(prev);
                          if (next.has(d)) next.delete(d);
                          else next.add(d);
                          return next;
                        });
                      }}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedDates.has(d)
                          ? "bg-brand text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {new Date(d + "T12:00:00").toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                    </button>
                  ))}
                </div>
              )}

              {dayMode === "recurring" && (
                <div className="flex flex-wrap gap-2">
                  {weekdayNames.map((name, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedWeekdays((prev) => {
                          const next = new Set(prev);
                          if (next.has(i)) next.delete(i);
                          else next.add(i);
                          return next;
                        });
                      }}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedWeekdays.has(i)
                          ? "bg-brand text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                  {selectedWeekdays.size > 0 && (
                    <span className="text-xs text-gray-500 self-center ml-2">
                      {getDatesFromWeekdays().length} days selected
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slot Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
                <option value="custom">Custom</option>
              </select>
              {duration === "custom" && (
                <input
                  type="number"
                  min="1"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  placeholder="Minutes"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volunteers per Slot</label>
              <input
                type="number"
                min="1"
                required
                value={maxVol}
                onChange={(e) => setMaxVol(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          {/* Preview */}
          {previewSlotCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                This will create <strong>{previewSlotCount} slots</strong> of {slotDuration} minutes,
                each needing <strong>{maxVol} volunteers</strong>
                {previewDays > 1 && (
                  <> across <strong>{previewDays} days</strong></>
                )}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || previewSlotCount === 0}
            className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Shift"}
          </button>
        </form>
      )}

      {/* Shift List */}
      {shifts.length === 0 && !showForm && (
        <p className="text-gray-500 text-sm">No shifts yet. Add one to get started.</p>
      )}

      {Object.entries(shiftsByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dateKey, dateShifts]) => (
          <div key={dateKey} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              {formatDate(dateShifts[0].startTime)}
            </h3>
            <div className="space-y-3">
              {dateShifts.map((shift) => {
                const isExpanded = expandedShift === shift.id;
                const totalSlots = shift.slots.length;
                const totalConfirmed = shift.slots.reduce(
                  (sum, slot) => sum + slot.signups.filter((s) => s.status === "CONFIRMED").length,
                  0
                );

                return (
                  <div key={shift.id} className="border border-gray-200 rounded-lg">
                    {/* Shift Header */}
                    <button
                      onClick={() => setExpandedShift(isExpanded ? null : shift.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{shift.title}</p>
                        <p className="text-sm text-gray-500">
                          {formatTime(shift.startTime)} — {formatTime(shift.endTime)} | {totalSlots} slots | {totalConfirmed} signed up
                        </p>
                      </div>
                      <span className="text-gray-400">{isExpanded ? "\u25B2" : "\u25BC"}</span>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-4">
                        {/* Shift Actions */}
                        <div className="flex gap-2 mb-4">
                          {editingShift === shift.id ? (
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full rounded border border-gray-300 px-3 py-1 text-sm"
                              />
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={2}
                                placeholder="Description (optional)"
                                className="w-full rounded border border-gray-300 px-3 py-1 text-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateShift(shift.id)}
                                  disabled={loading}
                                  className="bg-brand text-white px-3 py-1 rounded text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingShift(null)}
                                  className="text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingShift(shift.id);
                                  setEditTitle(shift.title);
                                  setEditDescription(shift.description || "");
                                }}
                                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-200 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteShift(shift.id, shift.title)}
                                className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded"
                              >
                                Delete Shift
                              </button>
                            </>
                          )}
                        </div>

                        {shift.description && (
                          <p className="text-sm text-gray-600 mb-4">{shift.description}</p>
                        )}

                        <p className="text-xs text-gray-400 mb-3">
                          To change times, delete this shift and create a new one.
                        </p>

                        {/* Slot Table */}
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b">
                              <th className="pb-2 font-medium">Time</th>
                              <th className="pb-2 font-medium">Signed Up</th>
                              <th className="pb-2 font-medium">Waitlist</th>
                              <th className="pb-2 font-medium">Capacity</th>
                              <th className="pb-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {shift.slots.map((slot) => {
                              const confirmed = slot.signups.filter((s) => s.status === "CONFIRMED").length;
                              const waitlisted = slot.signups.filter((s) => s.status === "WAITLISTED").length;
                              const isSlotExpanded = expandedSlot === slot.id;

                              return (
                                <tr key={slot.id} className="border-b last:border-0">
                                  <td className="py-2">
                                    <button
                                      onClick={() => setExpandedSlot(isSlotExpanded ? null : slot.id)}
                                      className="text-left hover:text-brand"
                                    >
                                      {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
                                    </button>
                                    {/* Signup list */}
                                    {isSlotExpanded && slot.signups.filter((s) => s.status !== "CANCELLED").length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {slot.signups
                                          .filter((s) => s.status !== "CANCELLED")
                                          .map((signup) => (
                                            <div key={signup.id} className="flex items-center gap-2 text-xs pl-2">
                                              <span
                                                className={`px-1.5 py-0.5 rounded-full font-medium ${
                                                  signup.status === "CONFIRMED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                                }`}
                                              >
                                                {signup.status === "CONFIRMED" ? "Confirmed" : `Waitlist #${signup.waitlistPosition}`}
                                              </span>
                                              <span className="text-gray-700">
                                                {signup.volunteerName}
                                                {signup.familyMemberName && ` (${signup.familyMemberName})`}
                                              </span>
                                              <span className="text-gray-400">{signup.volunteerEmail}</span>
                                            </div>
                                          ))}
                                      </div>
                                    )}
                                    {isSlotExpanded && slot.signups.filter((s) => s.status !== "CANCELLED").length === 0 && (
                                      <p className="mt-1 text-xs text-gray-400 pl-2">No signups</p>
                                    )}
                                  </td>
                                  <td className="py-2">
                                    <span className={confirmed >= slot.maxVolunteers ? "text-green-600 font-medium" : ""}>
                                      {confirmed}/{slot.maxVolunteers}
                                    </span>
                                  </td>
                                  <td className="py-2">
                                    {waitlisted > 0 && (
                                      <span className="text-amber-600">{waitlisted}</span>
                                    )}
                                  </td>
                                  <td className="py-2">
                                    {editCapacity[slot.id] !== undefined ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          min="1"
                                          value={editCapacity[slot.id]}
                                          onChange={(e) =>
                                            setEditCapacity((prev) => ({
                                              ...prev,
                                              [slot.id]: parseInt(e.target.value) || 1,
                                            }))
                                          }
                                          className="w-16 rounded border border-gray-300 px-2 py-0.5 text-xs"
                                        />
                                        <button
                                          onClick={() => handleUpdateSlotCapacity(slot.id)}
                                          disabled={loading}
                                          className="text-brand text-xs hover:underline"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() =>
                                            setEditCapacity((prev) => {
                                              const next = { ...prev };
                                              delete next[slot.id];
                                              return next;
                                            })
                                          }
                                          className="text-gray-400 text-xs hover:underline"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          setEditCapacity((prev) => ({
                                            ...prev,
                                            [slot.id]: slot.maxVolunteers,
                                          }))
                                        }
                                        className="text-xs text-gray-500 hover:text-brand"
                                      >
                                        {slot.maxVolunteers}
                                      </button>
                                    )}
                                  </td>
                                  <td className="py-2 text-right">
                                    <button
                                      onClick={() => handleDeleteSlot(slot.id)}
                                      className="text-xs text-red-500 hover:text-red-700"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
