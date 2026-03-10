import { requireRole, getSupportTickets, getFeatureRequests } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string }>;
}) {
  await requireRole(["SUPER_ADMIN"]);
  const params = await searchParams;
  const tab = params.tab || "support";
  const statusFilter = params.status || "ALL";

  const [tickets, features] = await Promise.all([
    getSupportTickets(tab === "support" ? statusFilter : undefined),
    getFeatureRequests(tab === "feature" ? statusFilter : undefined),
  ]);

  const items = tab === "support" ? tickets : features;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Submissions</h1>
          <p className="text-gray-300 text-sm mt-1">Support tickets & feature requests</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <Link
            href={`/admin/super/submissions?tab=support&status=${statusFilter}`}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === "support"
                ? "bg-brand text-white"
                : "bg-white text-gray-700 shadow hover:bg-gray-50"
            }`}
          >
            Support Tickets ({tickets.length})
          </Link>
          <Link
            href={`/admin/super/submissions?tab=feature&status=${statusFilter}`}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === "feature"
                ? "bg-brand text-white"
                : "bg-white text-gray-700 shadow hover:bg-gray-50"
            }`}
          >
            Feature Requests ({features.length})
          </Link>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {["ALL", "NEW", "IN_PROGRESS", "RESOLVED"].map((s) => (
            <Link
              key={s}
              href={`/admin/super/submissions?tab=${tab}&status=${s}`}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                statusFilter === s
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-600 shadow hover:bg-gray-50"
              }`}
            >
              {s.replace("_", " ")}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No {tab === "support" ? "support tickets" : "feature requests"} found.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium hidden sm:table-cell">Email</th>
                  <th className="px-6 py-3 font-medium">
                    {tab === "support" ? "Subject" : "Category"}
                  </th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Date</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{item.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {"subject" in item ? item.subject : item.category}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/super/submissions/${tab}/${item.id}`}
                        className="text-brand text-sm font-medium hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Link
          href="/admin/super"
          className="inline-block text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Super Admin
        </Link>
      </div>
    </main>
  );
}
