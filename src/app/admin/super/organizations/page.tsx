import { requireRole, getOrganizations } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  await requireRole(["SUPER_ADMIN"]);
  const orgs = await getOrganizations();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Organizations</h1>
            <p className="text-gray-300 text-sm mt-1">{orgs.length} organizations</p>
          </div>
          <Link
            href="/admin/super/organizations/new"
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
          >
            + New Organization
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Slug</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Members</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Events</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{org.name}</td>
                  <td className="px-4 py-3 text-gray-500">/{org.slug}</td>
                  <td className="px-4 py-3 text-center">{org._count.members}</td>
                  <td className="px-4 py-3 text-center">{org._count.events}</td>
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
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Link href="/admin/super" className="text-sm text-gray-500 hover:text-gray-700 underline">
            Back to Super Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
