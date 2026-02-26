import { redirect } from "next/navigation";
import {
  isAdminAuthenticated,
  getAdminUpcomingEvents,
  getAdminPastEvents,
} from "@/lib/actions";
import Link from "next/link";
import CopyLinkButton from "@/components/CopyLinkButton";
import PastEventsToggle from "@/components/PastEventsToggle";

export const dynamic = "force-dynamic";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://waiver.ironcountytrailclub.org";

export default async function AdminEventsPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin");

  const [upcoming, past] = await Promise.all([
    getAdminUpcomingEvents(),
    getAdminPastEvents(),
  ]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-green-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Manage Events</h1>
            <p className="text-green-200 text-sm">
              Create and manage waiver events
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/admin/dashboard"
              className="text-sm text-green-200 hover:text-white underline"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
          <Link
            href="/admin/events/new"
            className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-md hover:bg-green-800 transition-colors"
          >
            + Create New Event
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    Waivers
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600 hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">
                    Shareable Link
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcoming.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No upcoming events. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  upcoming.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {event.name}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/events/${event.id}/waivers`}
                          className="text-green-700 hover:text-green-800 font-medium underline"
                        >
                          {event._count.waivers}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        {event.active ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-gray-500 truncate max-w-[200px]">
                            {baseUrl}/?event={event.slug}
                          </code>
                          <CopyLinkButton
                            url={`${baseUrl}/?event=${event.slug}`}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="text-green-700 hover:text-green-800 font-medium text-xs underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Past Events */}
        {past.length > 0 && (
          <PastEventsToggle>
            <div className="bg-white rounded-lg shadow overflow-hidden opacity-75">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Event
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">
                        Date
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        Waivers
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {past.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-700">
                            {event.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/admin/events/${event.id}/waivers`}
                            className="text-green-700 hover:text-green-800 font-medium underline"
                          >
                            {event._count.waivers}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/admin/events/${event.id}`}
                            className="text-green-700 hover:text-green-800 font-medium text-xs underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PastEventsToggle>
        )}
      </div>
    </main>
  );
}
