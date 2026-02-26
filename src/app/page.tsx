import { redirect } from "next/navigation";
import { getUpcomingEvents, getEventBySlug } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const params = await searchParams;

  // QR code / social media flow: ?event=slug → redirect to waiver form
  if (params.event) {
    const event = await getEventBySlug(params.event);
    if (event && event.active) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(event.date) >= today) {
        redirect(`/waiver/${params.event}`);
      }
    }
  }

  const events = await getUpcomingEvents();

  // Single-event shortcut: skip listing if only one upcoming event
  if (events.length === 1) {
    redirect(`/waiver/${events[0].slug}`);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Iron County Trail Club
          </h1>
          <div className="text-green-200 text-lg md:text-xl font-medium">
            Event Waivers
          </div>
          <div className="text-green-300 text-sm mt-2">
            Select an event to sign a liability waiver
          </div>
        </div>
      </div>

      {/* Event Cards */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">No upcoming events at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/waiver/${event.slug}`}
                className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {event.name}
                </h2>
                <p className="text-sm text-green-700 font-medium mt-1">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {event.location && ` \u2022 ${event.location}`}
                </p>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {event.description}
                  </p>
                )}
                <span className="inline-block mt-3 text-sm text-green-700 font-semibold">
                  Sign Waiver &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400">
        Iron County Trail Club &middot; Building single track trails for quiet
        sports
        <br />
        <a
          href="/admin"
          className="text-gray-300 hover:text-gray-500 transition-colors"
        >
          Admin
        </a>
      </footer>
    </main>
  );
}
