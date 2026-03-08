import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const event = await prisma.event.findUnique({
    where: { shortCode: shortCode.toUpperCase() },
    include: { org: true },
  });

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  redirect(`/events/${event.org.slug}/${event.slug}`);
}
