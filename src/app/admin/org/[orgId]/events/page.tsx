import { requireOrgAccess, getOrganization } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrgEventsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  await requireOrgAccess(orgId, ["OWNER", "ADMIN", "EVENT_MANAGER"]);
  const org = await getOrganization(orgId);
  if (!org) notFound();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-gray-300 text-sm mt-1">{org.name}</p>
          </div>
          <Link
            href={`/admin/org/${orgId}/events/new`}
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
          >
            + New Event
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Event</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Waivers</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Check-ins</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Short URL</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {org.events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{event.name}</div>
                    <div className="text-xs text-gray-500">{event.location || "—"}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {event.date ? new Date(event.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">{event._count.waivers}</td>
                  <td className="px-4 py-3 text-center">{event._count.checkIns}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">/e/{event.shortCode}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <Link
                      href={`/admin/org/${orgId}/events/${event.id}`}
                      className="text-brand hover:text-brand-hover font-medium underline text-xs"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/event/${event.id}/checkin`}
                      className="text-accent hover:text-accent-hover font-medium underline text-xs"
                    >
                      Check-in
                    </Link>
                    <Link
                      href={`/admin/event/${event.id}/waivers`}
                      className="text-gray-600 hover:text-gray-800 font-medium underline text-xs"
                    >
                      Waivers
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Link href={`/admin/org/${orgId}`} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Back to {org.name}
          </Link>
        </div>
      </div>
    </main>
  );
}
