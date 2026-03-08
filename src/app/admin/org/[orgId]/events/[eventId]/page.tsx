import { requireOrgAccess, getEvent, getOrganization } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventEditForm from "@/components/EventEditForm";
import EventManagerList from "@/components/EventManagerList";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ orgId: string; eventId: string }>;
}) {
  const { orgId, eventId } = await params;
  await requireOrgAccess(orgId);
  const event = await getEvent(eventId);
  const org = await getOrganization(orgId);
  if (!event || !org) notFound();

  const waiverUrl = `/events/${org.slug}/${event.slug}`;
  const shortUrl = `/e/${event.shortCode}`;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-gray-300 text-sm mt-1">{org.name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* URLs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Shareable Links</h2>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500">Full URL:</span>
              <div className="font-mono text-sm text-brand bg-brand-light px-3 py-2 rounded">
                {waiverUrl}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Short URL:</span>
              <div className="font-mono text-sm text-brand bg-brand-light px-3 py-2 rounded">
                {shortUrl}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-3">
            <Link
              href={waiverUrl}
              className="text-sm text-brand hover:text-brand-hover underline"
              target="_blank"
            >
              Open waiver form
            </Link>
            <Link
              href={`/admin/event/${eventId}/checkin`}
              className="text-sm text-accent hover:text-accent-hover underline"
            >
              Check-in interface
            </Link>
            <Link
              href={`/admin/event/${eventId}/waivers`}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              View waivers ({event._count.waivers})
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{event._count.waivers}</div>
            <div className="text-sm text-gray-500">Waivers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-accent">{event._count.checkIns}</div>
            <div className="text-sm text-gray-500">Check-ins</div>
          </div>
        </div>

        {/* Edit Event */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Event</h2>
          <EventEditForm
            eventId={eventId}
            defaultValues={{
              name: event.name,
              date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
              location: event.location || "",
              description: event.description || "",
            }}
          />
        </div>

        {/* Event Managers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Event Managers</h2>
          <EventManagerList
            eventId={eventId}
            managers={event.managers.map((m) => ({
              id: m.id,
              name: m.user.name || m.user.email || "",
              email: m.user.email || "",
            }))}
          />
        </div>

        <Link href={`/admin/org/${orgId}/events`} className="text-sm text-gray-500 hover:text-gray-700 underline">
          Back to Events
        </Link>
      </div>
    </main>
  );
}
