import { redirect } from "next/navigation";
import { isAdminAuthenticated, getWaivers, adminLogout } from "@/lib/actions";
import Link from "next/link";
import CheckInButton from "@/components/CheckInButton";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin");

  const params = await searchParams;
  const search = params.search || "";
  const waivers = await getWaivers(search);

  const totalWaivers = waivers.length;
  const checkedInCount = waivers.filter((w) => w.checkedIn).length;
  const totalPeople = waivers.reduce(
    (acc, w) => acc + 1 + w.familyMembers.length,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-green-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Waiver Admin</h1>
            <p className="text-green-200 text-sm">Candlelight Snowshoe</p>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="text-sm text-green-200 hover:text-white underline"
            >
              Log out
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{totalWaivers}</div>
            <div className="text-sm text-gray-500">Waivers Signed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{totalPeople}</div>
            <div className="text-sm text-gray-500">Total People</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{checkedInCount}</div>
            <div className="text-sm text-gray-500">Checked In</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar defaultValue={search} />
        </div>

        {/* Waiver Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    Family
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">
                    Signed
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    Check In
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {waivers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      {search ? "No waivers found matching your search." : "No waivers submitted yet."}
                    </td>
                  </tr>
                ) : (
                  waivers.map((waiver) => (
                    <tr key={waiver.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {waiver.firstName} {waiver.lastName}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {waiver.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                        {waiver.email}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {waiver.familyMembers.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            +{waiver.familyMembers.length}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                        {new Date(waiver.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckInButton
                          waiverId={waiver.id}
                          checkedIn={waiver.checkedIn}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/waivers/${waiver.id}`}
                          className="text-green-700 hover:text-green-800 font-medium text-xs underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
