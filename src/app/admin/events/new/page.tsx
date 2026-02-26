import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/actions";
import Link from "next/link";
import EventForm from "@/components/EventForm";

export default async function NewEventPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin");

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-green-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Create New Event</h1>
          </div>
          <Link
            href="/admin/events"
            className="text-sm text-green-200 hover:text-white underline"
          >
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <EventForm mode="create" />
        </div>
      </div>
    </main>
  );
}
