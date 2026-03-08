"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addEventManager, removeEventManager } from "@/lib/actions";

interface EventManagerListProps {
  eventId: string;
  managers: { id: string; name: string; email: string }[];
}

export default function EventManagerList({ eventId, managers }: EventManagerListProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await addEventManager(eventId, email);

    if (result.error) {
      setError(result.error);
    } else {
      setEmail("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleRemove = async (managerId: string) => {
    await removeEventManager(eventId, managerId);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="manager@email.com"
          required
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-md hover:bg-brand-hover disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Add Manager"}
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {managers.length === 0 ? (
        <p className="text-sm text-gray-500">No event managers assigned yet.</p>
      ) : (
        <div className="space-y-2">
          {managers.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900 text-sm">{m.name}</div>
                <div className="text-xs text-gray-500">{m.email}</div>
              </div>
              <button
                onClick={() => handleRemove(m.id)}
                className="text-red-500 hover:text-red-700 text-xs font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
