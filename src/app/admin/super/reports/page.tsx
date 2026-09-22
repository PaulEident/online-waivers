import { requireRole } from "@/lib/actions";
import { getPlatformReport } from "@/lib/report-actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatCard({ value, label, hint }: { value: number; label: string; hint?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <div className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500">{label}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

export default async function ReportsPage() {
  await requireRole(["SUPER_ADMIN"]);
  const { totals, organizations } = await getPlatformReport();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-300 text-sm mt-1">Platform usage across all organizations</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Headline totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={totals.orgs} label="Organizations" />
          <StatCard value={totals.users} label="Users" />
          <StatCard value={totals.events} label="Events" />
          <StatCard value={totals.waivers} label="Signed Waivers" />
        </div>

        {/* Supporting detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            value={totals.activeOrgs}
            label="Active Organizations"
            hint="at least one signed waiver"
          />
          <StatCard value={totals.waivers30} label="Waivers (last 30 days)" />
          <StatCard
            value={totals.guestWaivers}
            label="Guest Waivers"
            hint="signed without an account"
          />
        </div>

        {/* Per-organization usage */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Organization Usage</h2>
            <p className="text-xs text-gray-500 mt-0.5">Most waivers first</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Organization</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Members</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Events</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Waivers</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Volunteers</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Last Waiver</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Created</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {organizations.map((org) => (
                  <tr key={org.id} className={`hover:bg-gray-50 ${org.waivers === 0 ? "text-gray-400" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{org.name}</div>
                      <div className="text-gray-500 text-xs">/{org.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-center">{org.members}</td>
                    <td className="px-4 py-3 text-center">{org.events}</td>
                    <td className="px-4 py-3 text-center font-medium">{org.waivers}</td>
                    <td className="px-4 py-3 text-center">{org.volunteerWaivers}</td>
                    <td className="px-4 py-3">{formatDate(org.lastWaiverAt)}</td>
                    <td className="px-4 py-3">{formatDate(org.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/org/${org.id}`}
                        className="text-brand hover:text-brand-hover font-medium underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
                {organizations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No organizations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <Link href="/admin/super" className="text-sm text-gray-500 hover:text-gray-700 underline">
            Back to Super Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
