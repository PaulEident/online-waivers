"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEvent } from "@/lib/actions";

interface EventEditFormProps {
  eventId: string;
  defaultValues: {
    name: string;
    date: string;
    location: string;
    description: string;
  };
}

export default function EventEditForm({ eventId, defaultValues }: EventEditFormProps) {
  const [name, setName] = useState(defaultValues.name);
  const [date, setDate] = useState(defaultValues.date);
  const [location, setLocation] = useState(defaultValues.location);
  const [description, setDescription] = useState(defaultValues.description);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const result = await updateEvent(eventId, {
      name,
      date: date || null,
      location: location || null,
      description: description || null,
    });

    if (result.success) {
      setMessage("Event updated!");
      setTimeout(() => setMessage(""), 3000);
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
          {message}
        </div>
      )}
      <div>
        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
          Event Name
        </label>
        <input
          type="text"
          id="eventName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="datetime-local"
            id="eventDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="eventLocation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>
      </div>
      <div>
        <label htmlFor="eventDesc" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="eventDesc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
