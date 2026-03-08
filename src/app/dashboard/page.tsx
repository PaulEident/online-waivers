import { requireAuth, getUserWaivers, getUserOrgs } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAuth();
  const waivers = await getUserWaivers();
  const orgs = await getUserOrgs();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-300 text-sm mt-1">Welcome, {user.name || user.email}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Admin Links */}
        {(user.role === "SUPER_ADMIN" || orgs.length > 0) && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Admin</h2>
            <div className="flex flex-wrap gap-3">
              {user.role === "SUPER_ADMIN" && (
                <Link
                  href="/admin/super"
                  className="px-4 py-2 bg-brand-dark text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Super Admin Panel
                </Link>
              )}
              {orgs.map((org) => (
                <Link
                  key={org.id}
                  href={`/admin/org/${org.id}`}
                  className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
                >
                  {org.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* My Waivers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Waivers</h2>
          {waivers.length === 0 ? (
            <p className="text-gray-500 text-sm">No waivers signed yet.</p>
          ) : (
            <div className="space-y-3">
              {waivers.map((waiver) => (
                <div
                  key={waiver.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">{waiver.event.name}</div>
                    <div className="text-sm text-gray-500">{waiver.event.org.name}</div>
                    <div className="text-xs text-gray-400">
                      Signed {new Date(waiver.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Signed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
