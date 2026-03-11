import { requireEventAccess, getEvent, getEventWaivers, getEventCheckIns } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import CheckInInterface from "@/components/CheckInInterface";

export const dynamic = "force-dynamic";

export default async function CheckInPage({
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
  const checkInMap = new Map(checkIns.map((c) => [c.user.id, c]));

  const attendees = waivers.map((w) => ({
    waiverId: w.id,
    userId: w.userId,
    firstName: w.firstName,
    lastName: w.lastName,
    email: w.email,
    familyMembers: w.familyMembers as Array<{ firstName: string; lastName: string; age: number }> | null,
    signedAt: w.createdAt.toISOString(),
    checkedIn: w.userId ? checkInMap.has(w.userId) : false,
    checkedInAt: w.userId ? checkInMap.get(w.userId)?.checkedInAt?.toISOString() || null : null,
    checkedInBy: w.userId ? checkInMap.get(w.userId)?.checker?.name || null : null,
  }));

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">{event.name} — Check-In</h1>
          <p className="text-gray-300 text-sm mt-1">{event.org.name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{waivers.length}</div>
            <div className="text-xs text-gray-500">Waivers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-accent">{checkIns.length}</div>
            <div className="text-xs text-gray-500">Checked In</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-brand">
              {waivers.length - checkIns.length}
            </div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>

        <CheckInInterface
          eventId={eventId}
          attendees={attendees}
          defaultSearch={search || ""}
        />

        <div className="flex gap-4">
          <Link
            href={`/admin/event/${eventId}/waivers`}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            View all waivers
          </Link>
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
