import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated, getWaiver } from "@/lib/actions";
import Link from "next/link";
import CheckInButton from "@/components/CheckInButton";

export const dynamic = "force-dynamic";

export default async function WaiverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin");

  const { id } = await params;
  const waiver = await getWaiver(id);
  if (!waiver) notFound();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Waiver Details</h1>
            <p className="text-green-200 text-sm">
              {waiver.firstName} {waiver.lastName}
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-sm text-green-200 hover:text-white underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Check-in Status */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Check-in Status</span>
            <div className="text-lg font-bold">
              {waiver.checkedIn ? (
                <span className="text-green-600">Checked In</span>
              ) : (
                <span className="text-gray-400">Not Checked In</span>
              )}
            </div>
          </div>
          <CheckInButton waiverId={waiver.id} checkedIn={waiver.checkedIn} />
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
              <dd className="text-sm font-medium text-gray-900">{waiver.dateOfBirth}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Emergency Contact</dt>
              <dd className="text-sm font-medium text-gray-900">
                {waiver.emergencyContactName}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Emergency Phone</dt>
              <dd className="text-sm font-medium text-gray-900">
                {waiver.emergencyContactPhone}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Event</dt>
              <dd className="text-sm font-medium text-gray-900">
                {waiver.event?.name || "No event"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Mailchimp Opt-in</dt>
              <dd className="text-sm font-medium text-gray-900">
                {waiver.mailchimpOptIn ? (
                  <span className="text-green-600">Yes</span>
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
        {waiver.familyMembers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Family Members ({waiver.familyMembers.length})
            </h2>
            <div className="space-y-3">
              {waiver.familyMembers.map((fm) => (
                <div
                  key={fm.id}
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
              <img
                src={waiver.signatureData}
                alt="Drawn signature"
                className="max-h-32"
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Typed signature:</p>
              <p
                className="text-3xl text-gray-800"
                style={{
                  fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
                }}
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
