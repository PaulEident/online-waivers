"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions";

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    date: string; // ISO string
    location: string | null;
    active: boolean;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function EventForm({ mode, initialData }: EventFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 16)
      : ""
  );
  const [location, setLocation] = useState(initialData?.location || "");
  const [active, setActive] = useState(initialData?.active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!name.trim()) {
      setError("Event name is required");
      setSubmitting(false);
      return;
    }
    if (!slug.trim()) {
      setError("Event slug is required");
      setSubmitting(false);
      return;
    }
    if (!date) {
      setError("Event date is required");
      setSubmitting(false);
      return;
    }

    try {
      if (mode === "create") {
        await createEvent({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          date,
          location: location.trim() || undefined,
          active,
        });
      } else if (initialData) {
        await updateEvent(initialData.id, {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          date,
          location: location.trim() || undefined,
          active,
        });
      }
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred saving the event"
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Event Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Candlelight Snowshoe 2027"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          URL Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugManuallyEdited(true);
          }}
          placeholder="candlelight-snowshoe-2027"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Used in the shareable URL. Auto-generated from name.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Iron County Trails"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Brief description shown on the event listing..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="active"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label htmlFor="active" className="text-sm text-gray-700">
          Active (visible to public)
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-green-700 text-white text-sm font-medium rounded-md hover:bg-green-800 disabled:bg-gray-400 transition-colors"
        >
          {submitting
            ? "Saving..."
            : mode === "create"
              ? "Create Event"
              : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
