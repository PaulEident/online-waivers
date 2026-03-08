"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createEvent } from "@/lib/actions";
import Link from "next/link";

export default function NewEventPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
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

    const result = await createEvent(orgId, { name, slug, date: date || undefined, location, description });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/admin/org/${orgId}/events/${result.eventId}`);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">New Event</h1>
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
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Candlelight Snowshoe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ge-Che Trail, Iron River, MI"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
              <Link
                href={`/admin/org/${orgId}/events`}
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
