"use client";

import { checkInUser, undoCheckIn } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CheckInButtonProps {
  eventId: string;
  userId: string;
  checkedIn: boolean;
}

export default function CheckInButton({ eventId, userId, checkedIn }: CheckInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    if (checkedIn) {
      await undoCheckIn(eventId, userId);
    } else {
      await checkInUser(eventId, userId);
    }
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
        checkedIn
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {loading ? "..." : checkedIn ? "Checked In" : "Check In"}
    </button>
  );
}
