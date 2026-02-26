"use server";

import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FamilyMemberInput {
  firstName: string;
  lastName: string;
  age: number;
}

interface WaiverInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  signatureType: "draw" | "type";
  signatureData: string;
  mailchimpOptIn: boolean;
  familyMembers: FamilyMemberInput[];
  eventId: string;
  eventSlug: string;
}

interface EventInput {
  name: string;
  slug: string;
  description?: string;
  date: string;
  location?: string;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Helper: start of today (midnight) for date comparisons
// ---------------------------------------------------------------------------

function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

// ---------------------------------------------------------------------------
// Event actions
// ---------------------------------------------------------------------------

export async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: { active: true, date: { gte: startOfToday() } },
    orderBy: { date: "asc" },
  });
}

export async function getAdminUpcomingEvents() {
  return prisma.event.findMany({
    where: { date: { gte: startOfToday() } },
    orderBy: { date: "asc" },
    include: { _count: { select: { waivers: true } } },
  });
}

export async function getAdminPastEvents() {
  return prisma.event.findMany({
    where: { date: { lt: startOfToday() } },
    orderBy: { date: "desc" },
    include: { _count: { select: { waivers: true } } },
  });
}

export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { waivers: true } } },
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({ where: { slug } });
}

export async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: { _count: { select: { waivers: true } } },
  });
}

export async function createEvent(data: EventInput) {
  return prisma.event.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      date: new Date(data.date),
      location: data.location || null,
      active: data.active,
    },
  });
}

export async function updateEvent(id: string, data: Partial<EventInput>) {
  return prisma.event.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && {
        description: data.description || null,
      }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.location !== undefined && { location: data.location || null }),
      ...(data.active !== undefined && { active: data.active }),
    },
  });
}

export async function deleteEvent(id: string) {
  const count = await prisma.waiver.count({ where: { eventId: id } });
  if (count > 0) {
    throw new Error(
      "Cannot delete event with existing waivers. Deactivate it instead."
    );
  }
  return prisma.event.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Waiver actions
// ---------------------------------------------------------------------------

export async function submitWaiver(data: WaiverInput) {
  await prisma.waiver.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      signatureType: data.signatureType,
      signatureData: data.signatureData,
      agreedToWaiver: true,
      mailchimpOptIn: data.mailchimpOptIn,
      eventId: data.eventId,
      familyMembers: {
        create: data.familyMembers.map((fm) => ({
          firstName: fm.firstName,
          lastName: fm.lastName,
          age: fm.age,
        })),
      },
    },
  });

  // Subscribe to Mailchimp if opted in
  if (data.mailchimpOptIn) {
    try {
      await subscribeToMailchimp(data.email, data.firstName, data.lastName);
    } catch (error) {
      // Log but don't block the waiver submission
      console.error("Mailchimp subscribe error:", error);
    }
  }

  redirect(
    `/thank-you?name=${encodeURIComponent(data.firstName)}&count=${data.familyMembers.length}&event=${encodeURIComponent(data.eventSlug)}`
  );
}

async function subscribeToMailchimp(
  email: string,
  firstName: string,
  lastName: string
) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn("Mailchimp API key or Audience ID not configured");
    return;
  }

  // Extract data center from API key (e.g., "us22" from "...key-us22")
  const dataCenter = apiKey.split("-").pop();

  const response = await fetch(
    `https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `apikey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    // Don't throw for "already subscribed" (Member Exists)
    if (errorData.title === "Member Exists") {
      console.log(`${email} is already subscribed to Mailchimp`);
      return;
    }
    throw new Error(
      `Mailchimp API error: ${errorData.title} - ${errorData.detail}`
    );
  }
}

// ---------------------------------------------------------------------------
// Auth actions
// ---------------------------------------------------------------------------

export async function adminLogin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}

// ---------------------------------------------------------------------------
// Admin waiver actions
// ---------------------------------------------------------------------------

export async function toggleCheckIn(waiverId: string) {
  const waiver = await prisma.waiver.findUnique({ where: { id: waiverId } });
  if (!waiver) return;

  await prisma.waiver.update({
    where: { id: waiverId },
    data: { checkedIn: !waiver.checkedIn },
  });
}

export async function getWaivers(search?: string, eventId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (eventId) {
    where.eventId = eventId;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.waiver.findMany({
    where,
    include: { familyMembers: true, event: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWaiver(id: string) {
  return prisma.waiver.findUnique({
    where: { id },
    include: { familyMembers: true, event: true },
  });
}
