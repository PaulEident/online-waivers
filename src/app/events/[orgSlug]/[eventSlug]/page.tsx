import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EventWaiverForm from "@/components/EventWaiverForm";
import { sanitizeHtml, escapeHtml } from "@/lib/sanitize";
import { formatEventDate, formatEventDateForTemplate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function EventWaiverPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string; eventSlug: string }>;
  searchParams: Promise<{ guest?: string }>;
}) {
  const { orgSlug, eventSlug } = await params;
  const { guest } = await searchParams;
  const session = await auth();
  const user = session?.user;
  const isGuest = guest === "true" && !user;

  const event = await getEventBySlug(orgSlug, eventSlug);
  if (!event) notFound();

  // Check if authenticated user already signed waiver for this event
  let existingWaiver = null;
  let userMarketingOptIn: boolean | null = null;
  if (user) {
    const [waiver, dbUser] = await Promise.all([
      prisma.waiver.findUnique({
        where: { userId_eventId: { userId: user.id, eventId: event.id } },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { marketingOptIn: true },
      }),
    ]);
    existingWaiver = waiver;
    userMarketingOptIn = dbUser?.marketingOptIn ?? null;
  }

  // Use event-level template, fall back to org template for legacy events
  const templateSource = event.waiverTemplate || event.org.waiverTemplate;

  // Render waiver template with variables — escape interpolated values to prevent XSS
  const renderedTemplate = sanitizeHtml(
    templateSource
      .replace(/\{\{ORG_NAME\}\}/g, escapeHtml(event.org.name))
      .replace(/\{\{EVENT_NAME\}\}/g, escapeHtml(event.name))
      .replace(/\{\{EVENT_DATE\}\}/g, escapeHtml(formatEventDateForTemplate(event.date, event.endDate)))
      .replace(/\{\{EVENT_LOCATION\}\}/g, escapeHtml(event.location || "TBD"))
      .replace(/\{\{YEAR\}\}/g, new Date().getFullYear().toString())
  );

  // Build participant auth URL with event context
  const currentPath = `/events/${orgSlug}/${eventSlug}`;
  const participantSigninUrl = `/auth/participant/signin?callbackUrl=${encodeURIComponent(currentPath)}&eventName=${encodeURIComponent(event.name)}&orgName=${encodeURIComponent(event.org.name)}&eventDate=${encodeURIComponent(event.date ? formatEventDate(event.date, event.endDate) : "")}`;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.org.name}</h1>
          <div className="text-gray-300 text-lg md:text-xl font-medium">{event.name}</div>
          {event.date && (
            <div className="text-gray-400 text-sm mt-1">
              {formatEventDate(event.date, event.endDate)}
            </div>
          )}
          {event.location && (
            <div className="text-gray-400 text-sm">{event.location}</div>
          )}
          <div className="text-gray-400 text-sm mt-2">Liability Waiver &amp; Release Form</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* State A: Authenticated user who already signed */}
        {user && existingWaiver ? (
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
        ) : /* State B: Unauthenticated, no guest param — show interstitial */
        !user && !isGuest ? (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Create a free account to sign your waiver
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                A Volntir account makes it easy to manage your waivers across events.
              </p>
            </div>

            <div className="space-y-3 mb-6 max-w-sm mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">View your signed waiver anytime</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">Speed up future event sign-ups</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">Get updates from {event.org.name}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Link
                href={participantSigninUrl}
                className="w-full max-w-sm px-6 py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg shadow-brand/25 transition-all hover:shadow-xl hover:shadow-brand/35 hover:-translate-y-0.5 text-center"
              >
                Sign In or Create Account
              </Link>
              <Link
                href={`${currentPath}?guest=true`}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Continue without an account
              </Link>
            </div>
          </div>
        ) : (
          /* State C: Authenticated user (no existing waiver) or Guest mode */
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <p className="text-sm text-gray-600 mb-6">
              Please complete all required fields (<span className="text-red-500">*</span>) and sign
              below. One waiver per adult — you may add children under 18 as family members.
            </p>
            <EventWaiverForm
              eventId={event.id}
              renderedTemplate={renderedTemplate}
              orgName={event.org.name}
              showMailchimpOptIn={event.org.mailchimpEnabled}
              isGuest={isGuest}
              showVolntirOptIn={!!user && userMarketingOptIn !== true}
            />
          </div>
        )}
      </div>
    </main>
  );
}
