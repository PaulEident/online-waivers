"use client";

import { useState } from "react";
import { deleteEvent } from "@/lib/actions";

export default function EventDeleteButton({
  eventId,
  eventName,
  hasWaivers,
}: {
  eventId: string;
  eventName: string;
  hasWaivers: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const result = await deleteEvent(eventId);
      if (result && "error" in result) {
        setError(result.error);
        setDeleting(false);
        setConfirming(false);
      }
    } catch {
      // redirect throws
    }
  };

  if (hasWaivers) {
    return (
      <p className="text-xs text-gray-400">
        Events with signed waivers cannot be deleted.
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
      >
        Delete Event
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-red-600">
        Are you sure you want to delete <strong>{eventName}</strong>? This cannot be undone.
      </p>
      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={() => { setConfirming(false); setError(""); }}
          disabled={deleting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
