"use client";

import { useState } from "react";
import { deleteWaiver } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function DeleteWaiverButton({ waiverId, eventId }: { waiverId: string; eventId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteWaiver(waiverId);
    if (result && "error" in result) {
      alert(result.error);
      setDeleting(false);
      setConfirming(false);
    } else {
      router.push(`/admin/event/${eventId}/waivers`);
    }
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
      >
        Delete Waiver
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-red-600 font-medium">Are you sure?</span>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
      >
        {deleting ? "Deleting..." : "Confirm Delete"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
