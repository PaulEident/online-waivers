import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated, getEvent } from "@/lib/actions";
import Link from "next/link";
import EventForm from "@/components/EventForm";
import CopyLinkButton from "@/components/CopyLinkButton";

export const dynamic = "force-dynamic";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://waiver.ironcountytrailclub.org";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin");

  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const shareableUrl = `${baseUrl}/?event=${event.slug}`;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-green-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Edit Event</h1>
            <p className="text-green-200 text-sm">{event.name}</p>
          </div>
          <Link
            href="/admin/events"
            className="text-sm text-green-200 hover:text-white underline"
          >
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Shareable URL */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Shareable URL
          </h2>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <code className="text-sm text-gray-700 flex-1 break-all">
              {shareableUrl}
            </code>
            <CopyLinkButton url={shareableUrl} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Share this URL on social media or use it for QR codes.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Waivers Signed</span>
            <div className="text-2xl font-bold text-gray-900">
              {event._count.waivers}
            </div>
          </div>
          <Link
            href={`/admin/events/${event.id}/waivers`}
            className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-md hover:bg-green-800 transition-colors"
          >
            View Waivers
          </Link>
        </div>

        {/* Event Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <EventForm
            mode="edit"
            initialData={{
              id: event.id,
              name: event.name,
              slug: event.slug,
              description: event.description,
              date: event.date.toISOString(),
              location: event.location,
              active: event.active,
            }}
          />
        </div>
      </div>
    </main>
  );
}
