import { notFound } from "next/navigation";
import { requireAuth, getWaiver } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WaiverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const waiver = await getWaiver(id);
  if (!waiver) notFound();

  const familyMembers = waiver.familyMembers as Array<{ firstName: string; lastName: string; age: number }> | null;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Waiver Details</h1>
            <p className="text-gray-300 text-sm">
              {waiver.firstName} {waiver.lastName} — {waiver.event.name}
            </p>
          </div>
          <Link
            href={`/admin/event/${waiver.eventId}/waivers`}
            className="text-sm text-gray-300 hover:text-white underline"
          >
            Back to Waivers
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Event Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Event</h2>
          <div className="text-gray-700">{waiver.event.name}</div>
          <div className="text-sm text-gray-500">{waiver.event.org.name}</div>
        </div>

        {/* Participant Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Participant Information
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-gray-500">Full Name</dt>
              <dd className="text-sm font-medium text-gray-900">
                {waiver.firstName} {waiver.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Email</dt>
              <dd className="text-sm font-medium text-gray-900">{waiver.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Phone</dt>
              <dd className="text-sm font-medium text-gray-900">
                {waiver.phone || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Date of Birth</dt>
              <dd className="text-sm font-medium text-gray-900">
                {new Date(waiver.dateOfBirth).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Emergency Contact</dt>
              <dd className="text-sm font-medium text-gray-900">{waiver.emergencyContactName}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Emergency Phone</dt>
              <dd className="text-sm font-medium text-gray-900">{waiver.emergencyContactPhone}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Mailchimp Opt-in</dt>
              <dd className="text-sm font-medium text-gray-900">
                {waiver.mailchimpOptIn ? (
                  <span className="text-accent">Yes</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Signed At</dt>
              <dd className="text-sm font-medium text-gray-900">
                {new Date(waiver.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Family Members */}
        {familyMembers && familyMembers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Family Members ({familyMembers.length})
            </h2>
            <div className="space-y-3">
              {familyMembers.map((fm, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">
                    {fm.firstName} {fm.lastName}
                  </span>
                  <span className="text-sm text-gray-500">Age: {fm.age}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Signature
          </h2>
          {waiver.signatureType === "draw" ? (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={waiver.signatureData} alt="Drawn signature" className="max-h-32" />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Typed signature:</p>
              <p
                className="text-3xl text-gray-800"
                style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
              >
                {waiver.signatureData}
              </p>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Signature type: {waiver.signatureType === "draw" ? "Hand-drawn" : "Typed"}
          </p>
        </div>
      </div>
    </main>
  );
}
