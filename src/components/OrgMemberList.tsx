"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addOrgMember, removeOrgMember } from "@/lib/actions";

interface OrgMemberListProps {
  orgId: string;
  members: { id: string; name: string; email: string; role: string }[];
}

export default function OrgMemberList({ orgId, members }: OrgMemberListProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"OWNER" | "ADMIN" | "EVENT_MANAGER">("ADMIN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await addOrgMember(orgId, email, role);

    if (result.error) {
      setError(result.error);
    } else {
      setEmail("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleRemove = async (memberId: string) => {
    await removeOrgMember(orgId, memberId);
    router.refresh();
  };

  const roleColors: Record<string, string> = {
    OWNER: "bg-brand-light text-brand",
    ADMIN: "bg-gray-100 text-brand-dark",
    EVENT_MANAGER: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Add Member</h3>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@email.com"
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
            <option value="EVENT_MANAGER">Event Manager</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-md hover:bg-brand-hover disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : "Add"}
          </button>
        </form>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Role</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                <td className="px-4 py-3 text-gray-600">{m.email}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      roleColors[m.role] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {m.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
