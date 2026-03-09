import { notFound } from "next/navigation";
import { getEventBySlug, requireAuth } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import EventWaiverForm from "@/components/EventWaiverForm";
import { sanitizeHtml, escapeHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export default async function EventWaiverPage({
  params,
}: {
  params: Promise<{ orgSlug: string; eventSlug: string }>;
}) {
  const { orgSlug, eventSlug } = await params;
  const user = await requireAuth();
  const event = await getEventBySlug(orgSlug, eventSlug);

  if (!event) notFound();

  // Check if user already signed waiver for this event
  const existingWaiver = await prisma.waiver.findUnique({
    where: { userId_eventId: { userId: user.id, eventId: event.id } },
  });

  // Render waiver template with variables — escape interpolated values to prevent XSS
  const renderedTemplate = sanitizeHtml(
    event.org.waiverTemplate
      .replace(/\{\{ORG_NAME\}\}/g, escapeHtml(event.org.name))
      .replace(/\{\{EVENT_NAME\}\}/g, escapeHtml(event.name))
      .replace(/\{\{EVENT_DATE\}\}/g, escapeHtml(event.date ? new Date(event.date).toLocaleDateString() : "TBD"))
      .replace(/\{\{EVENT_LOCATION\}\}/g, escapeHtml(event.location || "TBD"))
      .replace(/\{\{YEAR\}\}/g, new Date().getFullYear().toString())
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.org.name}</h1>
          <div className="text-gray-300 text-lg md:text-xl font-medium">{event.name}</div>
          {event.date && (
            <div className="text-gray-400 text-sm mt-1">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
          {event.location && (
            <div className="text-gray-400 text-sm">{event.location}</div>
          )}
          <div className="text-gray-400 text-sm mt-2">Liability Waiver &amp; Release Form</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {existingWaiver ? (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Waiver Already Signed</h2>
            <p className="text-gray-600 mb-4">
              You signed the waiver for this event on{" "}
              {new Date(existingWaiver.createdAt).toLocaleDateString()}.
            </p>
            <a
              href="/dashboard"
              className="text-brand hover:text-brand-hover text-sm font-medium underline"
            >
              View your dashboard
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <p className="text-sm text-gray-600 mb-6">
              Please complete all required fields (<span className="text-red-500">*</span>) and sign
              below. One waiver per adult — you may add children under 18 as family members.
            </p>
            <EventWaiverForm
              eventId={event.id}
              renderedTemplate={renderedTemplate}
              orgName={event.org.name}
            />
          </div>
        )}
      </div>
    </main>
  );
}
