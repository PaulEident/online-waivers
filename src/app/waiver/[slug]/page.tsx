import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/actions";
import WaiverForm from "@/components/WaiverForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    title: event
      ? `${event.name} - Waiver | Iron County Trail Club`
      : "Event Waiver | Iron County Trail Club",
  };
}

export default async function WaiverPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  // 404 if event doesn't exist, is inactive, or is in the past
  if (!event || !event.active) {
    notFound();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(event.date) < today) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-green-800 text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Iron County Trail Club
          </h1>
          <div className="text-green-200 text-lg md:text-xl font-medium">
            {event.name}
          </div>
          <div className="text-green-300 text-sm mt-2">
            Liability Waiver &amp; Release Form
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <p className="text-sm text-gray-600 mb-6">
            Please complete all required fields (
            <span className="text-red-500">*</span>) and sign below. One waiver
            per adult — you may add children under 18 as family members.
          </p>
          <WaiverForm
            eventId={event.id}
            eventSlug={event.slug}
            eventName={event.name}
          />
        </div>
      </div>

      <footer className="text-center py-6 text-sm text-gray-400">
        Iron County Trail Club &middot; Building single track trails for quiet
        sports
        <br />
        <a
          href="/admin"
          className="text-gray-300 hover:text-gray-500 transition-colors"
        >
          Admin
        </a>
      </footer>
    </main>
  );
}
