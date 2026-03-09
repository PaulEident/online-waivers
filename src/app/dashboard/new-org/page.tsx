"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserOrganization } from "@/lib/actions";
import Link from "next/link";

export default function NewOrganizationPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await createUserOrganization({ name, slug });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/admin/org/${result.orgId}`);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Create Organization</h1>
          <p className="text-gray-300 text-sm mt-1">Set up your organization to manage events and waivers</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Iron County Trail Club"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-1">/events/</span>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  required
                  placeholder="iron-county-trail-club"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Events will be accessible at /events/{slug || "your-slug"}/event-name
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Organization"}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
