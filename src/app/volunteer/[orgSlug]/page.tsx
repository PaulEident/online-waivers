import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VolunteerTimeClock from "@/components/VolunteerTimeClock";

export const dynamic = "force-dynamic";

export default async function VolunteerPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      volunteerTimeConfig: true,
      events: {
        select: { slug: true, name: true },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!org) notFound();

  // Check if time tracking is enabled (default: enabled if no config exists)
  const config = org.volunteerTimeConfig;
  const isEnabled = !config || config.enabled;

  if (!isEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Volunteer Time Tracking
          </h1>
          <p className="text-gray-600">
            Volunteer time tracking is not currently available for {org.name}.
          </p>
        </div>
      </div>
    );
  }

  const latestEventSlug = org.events[0]?.slug;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">{org.name}</h1>
          <p className="text-white/70 mt-2">Volunteer Time Tracking</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <VolunteerTimeClock
          orgId={org.id}
          orgSlug={org.slug}
          orgName={org.name}
          latestEventSlug={latestEventSlug}
        />
      </div>
    </div>
  );
}
