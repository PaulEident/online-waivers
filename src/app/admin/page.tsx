import { redirect } from "next/navigation";
import { requireAuth, getUserOrgs } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAuth();

  // Super admin goes to super admin panel
  if (user.role === "SUPER_ADMIN") {
    redirect("/admin/super");
  }

  // If user has org memberships, redirect to first org
  const orgs = await getUserOrgs();
  if (orgs.length > 0) {
    redirect(`/admin/org/${orgs[0].id}`);
  }

  // Otherwise redirect to dashboard
  redirect("/dashboard");
}
