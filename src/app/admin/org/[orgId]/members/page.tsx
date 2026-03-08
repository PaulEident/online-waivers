import { requireOrgAccess, getOrganization } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrgMemberList from "@/components/OrgMemberList";

export const dynamic = "force-dynamic";

export default async function OrgMembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  await requireOrgAccess(orgId);
  const org = await getOrganization(orgId);
  if (!org) notFound();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-gray-300 text-sm mt-1">{org.name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <OrgMemberList
          orgId={orgId}
          members={org.members.map((m) => ({
            id: m.id,
            name: m.user.name || "—",
            email: m.user.email,
            role: m.role,
          }))}
        />

        <Link href={`/admin/org/${orgId}`} className="text-sm text-gray-500 hover:text-gray-700 underline">
          Back to {org.name}
        </Link>
      </div>
    </main>
  );
}
