import { requireEventAccess, getEvent, getEventWaivers, getEventCheckIns } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import VolunteerHoursEditor from "@/components/VolunteerHoursEditor";

export const dynamic = "force-dynamic";

export default async function EventWaiversPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { eventId } = await params;
  const { search } = await searchParams;
  await requireEventAccess(eventId);
  const event = await getEvent(eventId);
  if (!event) notFound();

  const waivers = await getEventWaivers(eventId, search);
  const checkIns = await getEventCheckIns(eventId);
  const checkInSet = new Set(checkIns.map((c) => c.user.id));
  const hasVolunteers = waivers.some((w) => w.isVolunteer);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Waivers</h1>
            <p className="text-gray-300 text-sm mt-1">
              {event.name} — {event.org.name}
            </p>
          </div>
          <Link
            href={`/admin/event/${eventId}/checkin`}
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
          >
            Check-In Mode
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search */}
        <form method="GET" className="mb-4 flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search || ""}
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Family</th>
                {hasVolunteers && (
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Volunteer Hours</th>
                )}
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Signed</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {waivers.length === 0 ? (
                <tr>
                  <td colSpan={hasVolunteers ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                    {search ? "No waivers found matching your search." : "No waivers signed yet."}
                  </td>
                </tr>
              ) : (
                waivers.map((waiver) => {
                  const familyMembers = waiver.familyMembers as Array<{ firstName: string; lastName: string; age: number }> | null;
                  return (
                    <tr key={waiver.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {waiver.userId && checkInSet.has(waiver.userId) ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Checked In
                            </span>
                          ) : !waiver.userId ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Guest
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Signed
                            </span>
                          )}
                          {waiver.isVolunteer && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              Volunteer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {waiver.firstName} {waiver.lastName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{waiver.email}</td>
                      <td className="px-4 py-3 text-center">
                        {familyMembers && familyMembers.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-light text-brand">
                            +{familyMembers.length}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      {hasVolunteers && (
                        <td className="px-4 py-3 hidden md:table-cell">
                          {waiver.isVolunteer ? (
                            <VolunteerHoursEditor
                              waiverId={waiver.id}
                              reportedHours={waiver.volunteerHours ? Number(waiver.volunteerHours) : null}
                              verifiedHours={waiver.verifiedHours ? Number(waiver.verifiedHours) : null}
                            />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                        {new Date(waiver.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/waivers/${waiver.id}`}
                          className="text-brand hover:text-brand-hover font-medium text-xs underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex gap-4">
          <Link
            href={`/admin/org/${event.orgId}`}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Back to {event.org.name}
          </Link>
        </div>
      </div>
    </main>
  );
}
