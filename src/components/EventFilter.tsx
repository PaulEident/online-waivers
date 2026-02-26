"use client";

import { useRouter } from "next/navigation";

interface EventOption {
  id: string;
  name: string;
}

interface EventFilterProps {
  events: EventOption[];
  selectedEventId: string;
}

export default function EventFilter({
  events,
  selectedEventId,
}: EventFilterProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = e.target.value;
    if (eventId) {
      router.push(`/admin/dashboard?eventId=${eventId}`);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <select
      value={selectedEventId}
      onChange={handleChange}
      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
    >
      <option value="">All Events</option>
      {events.map((event) => (
        <option key={event.id} value={event.id}>
          {event.name}
        </option>
      ))}
    </select>
  );
}
