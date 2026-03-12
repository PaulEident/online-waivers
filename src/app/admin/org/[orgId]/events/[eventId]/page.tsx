import { requireOrgAccess, getEvent, getOrganization } from "@/lib/actions";
import { getEventShifts } from "@/lib/slot-actions";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import EventEditForm from "@/components/EventEditForm";
import EventManagerList from "@/components/EventManagerList";
import EventQRCode from "@/components/EventQRCode";
import EventWaiverTemplateEditor from "@/components/EventWaiverTemplateEditor";
import EventDeleteButton from "@/components/EventDeleteButton";
import CopyableUrl from "@/components/CopyableUrl";
import ShiftManager from "@/components/ShiftManager";
import EventAdminTabs from "@/components/EventAdminTabs";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ orgId: string; eventId: string }>;
}) {
  const { orgId, eventId } = await params;
  await requireOrgAccess(orgId);
  const [event, org, shifts] = await Promise.all([
    getEvent(eventId),
    getOrganization(orgId),
    getEventShifts(eventId),
  ]);
  if (!event || !org) notFound();

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const waiverPath = `/events/${org.slug}/${event.slug}`;
  const shortPath = `/e/${event.shortCode}`;
  const waiverUrl = `${baseUrl}${waiverPath}`;
  const shortUrl = `${baseUrl}${shortPath}`;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-gray-300 text-sm mt-1">{org.name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <EventAdminTabs>
          {{
            overview: (
              <div className="space-y-6">
                {/* Shareable Links */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Shareable Links</h2>
                  <div className="space-y-3">
                    <CopyableUrl label="Full URL" url={waiverUrl} />
                    <CopyableUrl label="Short URL" url={shortUrl} />
                  </div>
                  <div className="mt-3 flex gap-3">
                    <Link
                      href={waiverPath}
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

                {/* QR Code */}
                <EventQRCode shortCode={event.shortCode} eventName={event.name} />

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
              </div>
            ),

            edit: (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Event</h2>
                <EventEditForm
                  eventId={eventId}
                  defaultValues={{
                    name: event.name,
                    date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
                    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
                    location: event.location || "",
                    description: event.description || "",
                  }}
                />
              </div>
            ),

            shifts: (
              <ShiftManager
                eventId={eventId}
                initialShifts={JSON.parse(JSON.stringify(shifts))}
                eventDate={event.date ? new Date(event.date).toISOString() : null}
                eventEndDate={event.endDate ? new Date(event.endDate).toISOString() : null}
              />
            ),

            waiver: (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Waiver Template</h2>
                <EventWaiverTemplateEditor
                  eventId={eventId}
                  template={event.waiverTemplate || org.waiverTemplate}
                  orgTemplate={org.waiverTemplate}
                  waiverCount={event._count.waivers}
                />
              </div>
            ),

            managers: (
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
            ),

            settings: (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6 border border-red-200">
                  <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Permanently delete this event and all associated data.
                  </p>
                  <EventDeleteButton
                    eventId={eventId}
                    eventName={event.name}
                    hasWaivers={event._count.waivers > 0}
                  />
                </div>

                <Link href={`/admin/org/${orgId}/events`} className="text-sm text-gray-500 hover:text-gray-700 underline">
                  Back to Events
                </Link>
              </div>
            ),
          }}
        </EventAdminTabs>
      </div>
    </main>
  );
}
