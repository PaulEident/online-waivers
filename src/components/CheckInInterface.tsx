"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkInUser, undoCheckIn } from "@/lib/actions";

interface Attendee {
  waiverId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  familyMembers: Array<{ firstName: string; lastName: string; age: number }> | null;
  signedAt: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  checkedInBy: string | null;
}

interface CheckInInterfaceProps {
  eventId: string;
  attendees: Attendee[];
  defaultSearch: string;
}

export default function CheckInInterface({
  eventId,
  attendees,
  defaultSearch,
}: CheckInInterfaceProps) {
  const [search, setSearch] = useState(defaultSearch);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/admin/event/${eventId}/checkin?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push(`/admin/event/${eventId}/checkin`);
    }
  };

  const handleCheckIn = async (userId: string) => {
    setLoadingId(userId);
    await checkInUser(eventId, userId);
    router.refresh();
    setLoadingId(null);
  };

  const handleUndo = async (userId: string) => {
    setLoadingId(userId);
    await undoCheckIn(eventId, userId);
    router.refresh();
    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          autoFocus
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-brand focus:border-brand"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors"
        >
          Search
        </button>
        {defaultSearch && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              router.push(`/admin/event/${eventId}/checkin`);
            }}
            className="px-4 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Results */}
      <div className="space-y-2">
        {attendees.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            {defaultSearch
              ? "No attendees found matching your search."
              : "No waivers signed for this event yet."}
          </div>
        ) : (
          attendees.map((a) => (
            <div
              key={a.waiverId}
              className={`bg-white rounded-lg shadow p-4 flex items-center justify-between ${
                a.checkedIn ? "border-l-4 border-accent" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    a.checkedIn
                      ? "bg-green-100 text-accent"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {a.checkedIn ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {a.firstName} {a.lastName}
                    {a.familyMembers && a.familyMembers.length > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-light text-brand">
                        +{a.familyMembers.length} family
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{a.email}</div>
                  {a.checkedIn && a.checkedInAt && (
                    <div className="text-xs text-accent">
                      Checked in {new Date(a.checkedInAt).toLocaleTimeString()}
                      {a.checkedInBy && ` by ${a.checkedInBy}`}
                    </div>
                  )}
                </div>
              </div>
              <div>
                {a.checkedIn ? (
                  <button
                    onClick={() => handleUndo(a.userId)}
                    disabled={loadingId === a.userId}
                    className="px-4 py-2 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors text-sm"
                  >
                    {loadingId === a.userId ? "..." : "Undo"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleCheckIn(a.userId)}
                    disabled={loadingId === a.userId}
                    className="px-6 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors"
                  >
                    {loadingId === a.userId ? "..." : "Check In"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
