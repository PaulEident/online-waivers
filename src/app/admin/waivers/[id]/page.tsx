import { notFound } from "next/navigation";
import { requireEventAccess, getWaiver } from "@/lib/actions";
import Link from "next/link";
import DeleteWaiverButton from "@/components/DeleteWaiverButton";

export const dynamic = "force-dynamic";

export default async function WaiverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const waiver = await getWaiver(id);
  if (!waiver) notFound();

  // Verify the user has access to this waiver's event/organization
  await requireEventAccess(waiver.eventId);

  const familyMembers = waiver.familyMembers as Array<{ firstName: string; lastName: string; age: number; relationship?: string; relationshipOther?: string }> | null;

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
          <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-lg font-bold text-gray-900">
              Participant Information
            </h2>
            {!waiver.userId && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Guest
              </span>
            )}
          </div>
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
                  <div>
                    <span className="font-medium text-gray-900">
                      {fm.firstName} {fm.lastName}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">Age: {fm.age}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Signed by {waiver.firstName} {waiver.lastName} as {fm.relationship === "Other" ? fm.relationshipOther : fm.relationship || "Parent/Guardian"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Trail */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Audit Trail
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-gray-500">IP Address</dt>
              <dd className="text-sm font-medium text-gray-900">{waiver.ipAddress || "Not recorded"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">User Agent</dt>
              <dd className="text-sm font-medium text-gray-900 break-all text-xs">{waiver.userAgent || "Not recorded"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Electronic Consent</dt>
              <dd className="text-sm font-medium text-gray-900">
                {(waiver as Record<string, unknown>).electronicConsent ? (
                  <span className="text-teal-700">Yes</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Signed At</dt>
              <dd className="text-sm font-medium text-gray-900">
                {new Date(waiver.signedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Volunteer Information */}
        {waiver.isVolunteer && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
              <h2 className="text-lg font-bold text-gray-900">Volunteer Information</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Volunteer
              </span>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500">Reported Hours</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {waiver.volunteerHours ? `${Number(waiver.volunteerHours)} hours` : "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Verified Hours</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {waiver.verifiedHours ? (
                    <span className="text-teal-700">{Number(waiver.verifiedHours)} hours</span>
                  ) : (
                    <span className="text-amber-600">Not yet verified</span>
                  )}
                </dd>
              </div>
              {waiver.hoursVerifiedAt && (
                <>
                  <div>
                    <dt className="text-xs text-gray-500">Verified At</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Date(waiver.hoursVerifiedAt).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Verified By</dt>
                    <dd className="text-sm font-medium text-gray-900">{waiver.hoursVerifiedBy || "—"}</dd>
                  </div>
                </>
              )}
            </dl>
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

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Data Management
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete this waiver record and all associated volunteer time logs. This action cannot be undone.
          </p>
          <DeleteWaiverButton waiverId={waiver.id} eventId={waiver.eventId} />
        </div>
      </div>
    </main>
  );
}
