import { requireRole, getUsers, updateUserRole } from "@/lib/actions";
import Link from "next/link";
import UserRoleButton from "@/components/UserRoleButton";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireRole(["SUPER_ADMIN"]);
  const params = await searchParams;
  const users = await getUsers(params.search);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-300 text-sm mt-1">{users.length} users</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search */}
        <form method="GET" className="mb-4 flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={params.search || ""}
            placeholder="Search by name or email..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-md hover:bg-brand-hover transition-colors"
          >
            Search
          </button>
        </form>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Orgs</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Waivers</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-brand-light text-brand"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{user._count.orgMembers}</td>
                  <td className="px-4 py-3 text-center">{user._count.waivers}</td>
                  <td className="px-4 py-3 text-center">
                    <UserRoleButton userId={user.id} currentRole={user.role} />
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
