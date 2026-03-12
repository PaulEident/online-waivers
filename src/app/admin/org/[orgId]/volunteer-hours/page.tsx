import { getVolunteerTimeLogs } from "@/lib/volunteer-actions";
import { requireOrgAccess, getOrganization } from "@/lib/actions";
import VolunteerHoursReview from "@/components/VolunteerHoursReview";

export const dynamic = "force-dynamic";

export default async function VolunteerHoursPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{ status?: string; search?: string; dateFrom?: string; dateTo?: string }>;
}) {
  const { orgId } = await params;
  const filters = await searchParams;
  await requireOrgAccess(orgId);

  const [logs, org] = await Promise.all([
    getVolunteerTimeLogs(orgId, filters),
    getOrganization(orgId),
  ]);

  const pendingCount = logs.filter((l) => l.status === "PENDING").length;
  const approvedMinutes = logs
    .filter((l) => l.status === "APPROVED")
    .reduce((sum, l) => sum + (l.totalMinutes || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Volunteer Hours</h1>
          <p className="text-white/70 mt-1">{org?.name}</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Pending Review</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Approved Hours</p>
            <p className="text-2xl font-bold text-green-600">
              {Math.floor(approvedMinutes / 60)}h {approvedMinutes % 60}m
            </p>
          </div>
        </div>

        <VolunteerHoursReview
          orgId={orgId}
          initialLogs={JSON.parse(JSON.stringify(logs))}
          initialFilters={filters}
        />
      </div>
    </div>
  );
}
