import { getProfile } from "@/lib/actions";
import ProfileForm from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const profile = await getProfile();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Account</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your profile and settings</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProfileForm profile={profile} />
      </div>
    </main>
  );
}
