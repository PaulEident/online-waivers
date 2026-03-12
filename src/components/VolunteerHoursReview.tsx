"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { approveTimeLogs, disputeTimeLog, reopenTimeLog } from "@/lib/volunteer-actions";

interface TimeLog {
  id: string;
  volunteerName: string;
  volunteerEmail: string;
  familyMemberName: string | null;
  clockIn: string;
  clockOut: string | null;
  totalMinutes: number | null;
  isManualEntry: boolean;
  status: string;
  adminNote: string | null;
  reviewer: { name: string | null } | null;
  reviewedAt: string | null;
}

export default function VolunteerHoursReview({
  orgId,
  initialLogs,
  initialFilters,
}: {
  orgId: string;
  initialLogs: TimeLog[];
  initialFilters: { status?: string; search?: string; dateFrom?: string; dateTo?: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logs = initialLogs;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [disputeId, setDisputeId] = useState<string | null>(null);
  const [disputeNote, setDisputeNote] = useState("");

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/org/${orgId}/volunteer-hours?${params.toString()}`);
  }

  async function handleBulkApprove() {
    if (selectedIds.size === 0) return;
    setLoading(true);
    await approveTimeLogs(orgId, Array.from(selectedIds));
    setSelectedIds(new Set());
    setLoading(false);
    router.refresh();
  }

  async function handleApprove(id: string) {
    setLoading(true);
    await approveTimeLogs(orgId, [id]);
    setLoading(false);
    router.refresh();
  }

  async function handleDispute() {
    if (!disputeId || !disputeNote.trim()) return;
    setLoading(true);
    await disputeTimeLog(orgId, disputeId, disputeNote);
    setDisputeId(null);
    setDisputeNote("");
    setLoading(false);
    router.refresh();
  }

  async function handleReopen(id: string) {
    setLoading(true);
    await reopenTimeLog(orgId, id);
    setLoading(false);
    router.refresh();
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    const pending = logs.filter((l) => l.status === "PENDING" || l.status === "EXPIRED");
    if (selectedIds.size === pending.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pending.map((l) => l.id)));
    }
  }

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const formatDuration = (mins: number | null) => {
    if (!mins) return "—";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-amber-100 text-amber-800",
      APPROVED: "bg-green-100 text-green-800",
      DISPUTED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || ""}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            value={initialFilters.status || "ALL"}
            onChange={(e) => updateFilter("status", e.target.value === "ALL" ? "" : e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="DISPUTED">Disputed</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Name or email"
            defaultValue={initialFilters.search || ""}
            onBlur={(e) => updateFilter("search", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilter("search", e.currentTarget.value);
            }}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={initialFilters.dateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={initialFilters.dateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkApprove}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 ml-auto"
          >
            Approve Selected ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    selectedIds.size > 0 &&
                    selectedIds.size ===
                      logs.filter((l) => l.status === "PENDING" || l.status === "EXPIRED").length
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Volunteer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Time</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Duration</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No volunteer hours found
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {(log.status === "PENDING" || log.status === "EXPIRED") && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(log.id)}
                      onChange={() => toggleSelect(log.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">
                    {log.familyMemberName || log.volunteerName}
                  </p>
                  {log.familyMemberName && (
                    <p className="text-xs text-gray-500">via {log.volunteerName}</p>
                  )}
                  <p className="text-xs text-gray-400">{log.volunteerEmail}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{formatDate(log.clockIn)}</td>
                <td className="px-4 py-3 text-gray-700">
                  {formatTime(log.clockIn)}
                  {log.clockOut ? ` — ${formatTime(log.clockOut)}` : " — ..."}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatDuration(log.totalMinutes)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-500">
                    {log.isManualEntry ? "Manual" : "Clocked"}
                  </span>
                </td>
                <td className="px-4 py-3">{statusBadge(log.status)}</td>
                <td className="px-4 py-3">
                  {(log.status === "PENDING" || log.status === "EXPIRED") && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(log.id)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-800 text-xs font-medium disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setDisputeId(log.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Dispute
                      </button>
                    </div>
                  )}
                  {log.status === "DISPUTED" && (
                    <div>
                      {log.adminNote && (
                        <p className="text-xs text-red-600 mb-1">{log.adminNote}</p>
                      )}
                      <button
                        onClick={() => handleReopen(log.id)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium disabled:opacity-50"
                      >
                        Reopen
                      </button>
                    </div>
                  )}
                  {(log.status === "APPROVED" || log.status === "DISPUTED") && log.reviewer && (
                    <p className="text-xs text-gray-400">
                      by {log.reviewer.name}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispute Modal */}
      {disputeId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute Hours</h3>
            <textarea
              value={disputeNote}
              onChange={(e) => setDisputeNote(e.target.value)}
              placeholder="Reason for dispute..."
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:outline-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDisputeId(null);
                  setDisputeNote("");
                }}
                className="text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDispute}
                disabled={loading || !disputeNote.trim()}
                className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="text-center">
        <a href={`/admin/org/${orgId}`} className="text-sm text-gray-500 hover:text-gray-700">
          Back to Organization
        </a>
      </div>
    </div>
  );
}
