import { requireAuth, getUserWaivers, getUserOrgs } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAuth();
  const waivers = await getUserWaivers();
  const orgs = await getUserOrgs();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome, <span className="text-gray-200">{user.name || user.email}</span>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Admin Links */}
        {(user.role === "SUPER_ADMIN" || orgs.length > 0) && (
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 border-l-4 border-l-brand">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-base font-bold text-gray-900">Admin</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.role === "SUPER_ADMIN" && (
                <Link
                  href="/admin/super"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-dark text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Super Admin Panel
                </Link>
              )}
              {orgs.map((org) => (
                <Link
                  key={org.id}
                  href={`/admin/org/${org.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                  </svg>
                  {org.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* My Waivers */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 border-l-4 border-l-accent">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-base font-bold text-gray-900">My Waivers</h2>
          </div>
          {waivers.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">No waivers signed yet</p>
              <p className="text-gray-400 text-xs mt-1">Your signed waivers will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {waivers.map((waiver) => (
                <div
                  key={waiver.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{waiver.event.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{waiver.event.org.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Signed {new Date(waiver.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200/60">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
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
