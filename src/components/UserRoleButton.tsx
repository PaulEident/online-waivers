"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/lib/actions";

export default function UserRoleButton({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleRole = async () => {
    setLoading(true);
    const newRole = currentRole === "SUPER_ADMIN" ? "USER" : "SUPER_ADMIN";
    await updateUserRole(userId, newRole as "SUPER_ADMIN" | "USER");
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={toggleRole}
      disabled={loading}
      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
        currentRole === "SUPER_ADMIN"
          ? "bg-brand-light text-brand hover:bg-orange-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {loading
        ? "..."
        : currentRole === "SUPER_ADMIN"
        ? "Remove Admin"
        : "Make Admin"}
    </button>
  );
}
