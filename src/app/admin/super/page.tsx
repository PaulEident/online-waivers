import { requireRole, getOrganizations, getUsers, getSubmissionCounts } from "@/lib/actions";
import Link from "next/link";
import MailchimpToggle from "@/components/MailchimpToggle";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  await requireRole(["SUPER_ADMIN"]);
  const orgs = await getOrganizations();
  const users = await getUsers();
  const submissions = await getSubmissionCounts();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Super Admin</h1>
          <p className="text-gray-300 text-sm mt-1">Platform management</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{orgs.length}</div>
            <div className="text-sm text-gray-500">Organizations</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-500">Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">
              {orgs.reduce((acc, o) => acc + o._count.events, 0)}
            </div>
            <div className="text-sm text-gray-500">Events</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">
              {users.reduce((acc, u) => acc + u._count.waivers, 0)}
            </div>
            <div className="text-sm text-gray-500">Waivers</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/super/organizations/new"
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
          >
            + New Organization
          </Link>
          <Link
            href="/admin/super/organizations"
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            All Organizations
          </Link>
          <Link
            href="/admin/super/users"
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/super/submissions"
            className="relative px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            Submissions
            {submissions.total > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {submissions.total}
              </span>
            )}
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            My Dashboard
          </Link>
        </div>

        {/* Organizations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Organizations</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {orgs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No organizations yet.{" "}
                <Link href="/admin/super/organizations/new" className="text-brand underline">
                  Create one
                </Link>
              </div>
            ) : (
              orgs.map((org) => (
                <Link
                  key={org.id}
                  href={`/admin/org/${org.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900">{org.name}</div>
                    <div className="text-sm text-gray-500">/{org.slug}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{org._count.members} members</span>
                    <span>{org._count.events} events</span>
                    <MailchimpToggle orgId={org.id} enabled={org.mailchimpEnabled} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
