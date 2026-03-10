import { requireOrgAccess, getOrganization } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatEventDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  await requireOrgAccess(orgId, ["OWNER", "ADMIN", "EVENT_MANAGER"]);
  const org = await getOrganization(orgId);
  if (!org) notFound();

  const totalWaivers = org.events.reduce((acc, e) => acc + e._count.waivers, 0);
  const totalCheckIns = org.events.reduce((acc, e) => acc + e._count.checkIns, 0);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">{org.name}</h1>
          <p className="text-gray-300 text-sm mt-1">Organization Dashboard</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{org.events.length}</div>
            <div className="text-sm text-gray-500">Events</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{org.members.length}</div>
            <div className="text-sm text-gray-500">Members</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{totalWaivers}</div>
            <div className="text-sm text-gray-500">Waivers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-accent">{totalCheckIns}</div>
            <div className="text-sm text-gray-500">Check-ins</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/org/${orgId}/events/new`}
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
          >
            + New Event
          </Link>
          <Link
            href={`/admin/org/${orgId}/events`}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            All Events
          </Link>
          <Link
            href={`/admin/org/${orgId}/members`}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            Members
          </Link>
          <Link
            href={`/admin/org/${orgId}/settings`}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            Settings
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            My Dashboard
          </Link>
        </div>

        {/* Events */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Events</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {org.events.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No events yet.{" "}
                <Link href={`/admin/org/${orgId}/events/new`} className="text-brand underline">
                  Create one
                </Link>
              </div>
            ) : (
              org.events.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/admin/org/${orgId}/events/${event.id}`}
                        className="font-medium text-gray-900 hover:text-brand"
                      >
                        {event.name}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {formatEventDate(event.date, event.endDate, { short: true })}
                        {event.location && ` · ${event.location}`}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Short URL: /e/{event.shortCode}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{event._count.waivers} waivers</span>
                      <span>{event._count.checkIns} check-ins</span>
                      <Link
                        href={`/admin/event/${event.id}/checkin`}
                        className="text-brand font-medium hover:text-brand-hover"
                      >
                        Check-in
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
