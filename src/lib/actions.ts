"use server";

import { prisma } from "./prisma";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { verifyTurnstile } from "./turnstile";
import { sanitizeHtml } from "./sanitize";
import crypto from "crypto";
import { sendPasswordResetEmail, sendWaiverConfirmationEmail } from "./email";

// ──────────────────────────────────────────
// Auth helpers
// ──────────────────────────────────────────

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");
  return session.user;
}

export async function requireRole(roles: string[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect("/dashboard");
  return user;
}

export async function requireOrgAccess(orgId: string, roles: string[] = ["OWNER", "ADMIN"]) {
  const user = await requireAuth();
  if (user.role === "SUPER_ADMIN") return user;

  const member = await prisma.orgMember.findUnique({
    where: { userId_orgId: { userId: user.id, orgId } },
  });
  if (!member || !roles.includes(member.role)) redirect("/dashboard");
  return user;
}

export async function requireEventAccess(eventId: string) {
  const user = await requireAuth();
  if (user.role === "SUPER_ADMIN") return user;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { orgId: true },
  });
  if (!event) redirect("/dashboard");

  // Check org membership
  const orgMember = await prisma.orgMember.findUnique({
    where: { userId_orgId: { userId: user.id, orgId: event.orgId } },
  });
  if (orgMember && ["OWNER", "ADMIN", "EVENT_MANAGER"].includes(orgMember.role)) return user;

  // Check event manager assignment
  const eventManager = await prisma.eventManager.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  if (eventManager) return user;

  redirect("/dashboard");
}

// ──────────────────────────────────────────
// User signup
// ──────────────────────────────────────────

export async function signUp(data: {
  name: string;
  email: string;
  password: string;
  turnstileToken: string;
  honeypot?: string;
}) {
  // Bot protection: reject if honeypot was filled
  if (data.honeypot) return { error: "Signup failed" };

  // Bot protection: verify Turnstile token
  if (!data.turnstileToken || !(await verifyTurnstile(data.turnstileToken))) {
    return { error: "Verification failed. Please try again." };
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { error: "An account with this email already exists" };

  const hashedPassword = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });
  return { success: true };
}

// ──────────────────────────────────────────
// Organizations (Super Admin)
// ──────────────────────────────────────────

const DEFAULT_WAIVER_TEMPLATE = `<h3>RELEASE AND WAIVER OF LIABILITY, ASSUMPTION OF RISK, AND INDEMNITY AGREEMENT</h3>
<p><strong>EVENT:</strong> {{EVENT_NAME}}, organized by {{ORG_NAME}}</p>
<p>In consideration of being permitted to participate in {{EVENT_NAME}} and any related activities organized by {{ORG_NAME}}, I hereby freely and voluntarily execute this Release and Waiver of Liability.</p>
<h4>1. ASSUMPTION OF RISK</h4>
<p>I acknowledge that participation involves inherent risks, dangers, and hazards. I understand that these risks may result in personal injury, illness, death, or property damage, and I voluntarily assume all such risks.</p>
<h4>2. RELEASE OF LIABILITY</h4>
<p>I, on behalf of myself, my heirs, personal representatives, and assigns, hereby release, discharge, and hold harmless {{ORG_NAME}}, its members, officers, directors, volunteers, agents, sponsors, and any landowners from any and all claims arising out of my participation.</p>
<h4>3. INDEMNIFICATION</h4>
<p>I agree to indemnify, defend, and hold harmless {{ORG_NAME}} from and against any and all claims, damages, losses, and expenses arising out of my participation.</p>
<h4>4. MEDICAL ACKNOWLEDGMENT</h4>
<p>I certify that I am physically fit and have not been advised against participation by a medical professional. I consent to receive medical treatment in the event of injury.</p>
<h4>5. PARENT/GUARDIAN CONSENT FOR MINORS</h4>
<p>If I am registering minor children (under 18 years of age) as family members on this waiver, I certify that I am the parent or legal guardian of each listed minor. I agree to assume all risks on their behalf and accept full responsibility for their participation. I further agree that this Release and Waiver of Liability, Assumption of Risk, and Indemnity Agreement applies to each minor listed, with the same force and effect as if each minor had signed individually.</p>
<h4>6. PHOTO AND MEDIA RELEASE</h4>
<p>I grant {{ORG_NAME}} permission to use photographs and media taken during the event for promotional purposes.</p>
<h4>7. ACKNOWLEDGMENT</h4>
<p>I have read this Agreement, fully understand its terms, and agree to be bound by them. I understand that I am giving up substantial rights, including my right to sue.</p>`;

export async function createOrganization(data: { name: string; slug: string; ownerId?: string }) {
  await requireRole(["SUPER_ADMIN"]);

  const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

  const existing = await prisma.organization.findUnique({ where: { slug } });
  if (existing) return { error: "An organization with this slug already exists" };

  const org = await prisma.organization.create({
    data: {
      name: data.name,
      slug,
      waiverTemplate: DEFAULT_WAIVER_TEMPLATE,
    },
  });

  // If owner specified, create OrgMember
  if (data.ownerId) {
    await prisma.orgMember.create({
      data: { userId: data.ownerId, orgId: org.id, role: "OWNER" },
    });
  }

  revalidatePath("/admin/super");
  return { success: true, orgId: org.id };
}

export async function createUserOrganization(data: { name: string; slug: string }) {
  const user = await requireAuth();

  const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

  const existing = await prisma.organization.findUnique({ where: { slug } });
  if (existing) return { error: "An organization with this URL already exists" };

  const org = await prisma.organization.create({
    data: {
      name: data.name,
      slug,
      waiverTemplate: DEFAULT_WAIVER_TEMPLATE,
    },
  });

  await prisma.orgMember.create({
    data: { userId: user.id, orgId: org.id, role: "OWNER" },
  });

  revalidatePath("/dashboard");
  return { success: true, orgId: org.id };
}

export async function getOrganizations() {
  await requireRole(["SUPER_ADMIN"]);

  return prisma.organization.findMany({
    include: {
      _count: { select: { members: true, events: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrganization(orgId: string) {
  await requireOrgAccess(orgId, ["OWNER", "ADMIN", "EVENT_MANAGER"]);

  return prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      events: {
        include: { _count: { select: { waivers: true, checkIns: true } } },
        orderBy: { date: "desc" },
      },
    },
  });
}

export async function toggleMailchimp(orgId: string, enabled: boolean) {
  await requireRole(["SUPER_ADMIN"]);

  await prisma.organization.update({
    where: { id: orgId },
    data: { mailchimpEnabled: enabled },
  });
  revalidatePath("/admin/super");
  return { success: true };
}

export async function updateOrganization(orgId: string, data: { name?: string; waiverTemplate?: string }) {
  await requireOrgAccess(orgId);

  // Sanitize waiver template HTML to prevent stored XSS
  const sanitizedData = { ...data };
  if (sanitizedData.waiverTemplate) {
    sanitizedData.waiverTemplate = sanitizeHtml(sanitizedData.waiverTemplate);
  }

  await prisma.organization.update({
    where: { id: orgId },
    data: sanitizedData,
  });
  revalidatePath(`/admin/org/${orgId}`);
  return { success: true };
}

// ──────────────────────────────────────────
// Org Members
// ──────────────────────────────────────────

export async function addOrgMember(orgId: string, email: string, role: "OWNER" | "ADMIN" | "EVENT_MANAGER") {
  await requireOrgAccess(orgId);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "No user found with that email" };

  const existing = await prisma.orgMember.findUnique({
    where: { userId_orgId: { userId: user.id, orgId } },
  });
  if (existing) return { error: "User is already a member of this organization" };

  await prisma.orgMember.create({
    data: { userId: user.id, orgId, role },
  });
  revalidatePath(`/admin/org/${orgId}/members`);
  return { success: true };
}

export async function removeOrgMember(orgId: string, memberId: string) {
  await requireOrgAccess(orgId);

  await prisma.orgMember.delete({ where: { id: memberId } });
  revalidatePath(`/admin/org/${orgId}/members`);
  return { success: true };
}

// ──────────────────────────────────────────
// Events
// ──────────────────────────────────────────

function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createEvent(orgId: string, data: {
  name: string;
  slug: string;
  date?: string;
  endDate?: string;
  location?: string;
  description?: string;
}) {
  await requireOrgAccess(orgId);

  const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

  const existing = await prisma.event.findUnique({
    where: { orgId_slug: { orgId, slug } },
  });
  if (existing) return { error: "An event with this slug already exists in this organization" };

  // Generate unique short code
  let shortCode = generateShortCode();
  while (await prisma.event.findUnique({ where: { shortCode } })) {
    shortCode = generateShortCode();
  }

  // Copy org's waiver template as the event's starting template
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { waiverTemplate: true },
  });

  const event = await prisma.event.create({
    data: {
      orgId,
      name: data.name,
      slug,
      shortCode,
      date: data.date ? new Date(data.date) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      location: data.location || null,
      description: data.description || null,
      waiverTemplate: org?.waiverTemplate || DEFAULT_WAIVER_TEMPLATE,
    },
  });

  revalidatePath(`/admin/org/${orgId}/events`);
  return { success: true, eventId: event.id };
}

export async function updateEvent(eventId: string, data: {
  name?: string;
  date?: string | null;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
}) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return { error: "Event not found" };

  await requireOrgAccess(event.orgId);

  await prisma.event.update({
    where: { id: eventId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.date !== undefined && { date: data.date ? new Date(data.date) : null }),
      ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });
  revalidatePath(`/admin/org/${event.orgId}/events/${eventId}`);
  return { success: true };
}

export async function deleteEvent(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { waivers: true } } },
  });
  if (!event) return { error: "Event not found" };

  await requireOrgAccess(event.orgId);

  if (event._count.waivers > 0) {
    return { error: "Cannot delete an event that has signed waivers. Remove all waivers first." };
  }

  await prisma.$transaction([
    prisma.eventManager.deleteMany({ where: { eventId } }),
    prisma.checkIn.deleteMany({ where: { eventId } }),
    prisma.event.delete({ where: { id: eventId } }),
  ]);

  revalidatePath(`/admin/org/${event.orgId}/events`);
  redirect(`/admin/org/${event.orgId}/events`);
}

export async function getEvent(eventId: string) {
  await requireEventAccess(eventId);

  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      org: true,
      managers: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count: { select: { waivers: true, checkIns: true } },
    },
  });
}

export async function getEventBySlug(orgSlug: string, eventSlug: string) {
  const org = await prisma.organization.findUnique({ where: { slug: orgSlug } });
  if (!org) return null;

  return prisma.event.findUnique({
    where: { orgId_slug: { orgId: org.id, slug: eventSlug } },
    include: { org: true },
  });
}

export async function getEventByShortCode(shortCode: string) {
  return prisma.event.findUnique({
    where: { shortCode },
    include: { org: true },
  });
}

// ──────────────────────────────────────────
// Event Managers
// ──────────────────────────────────────────

export async function addEventManager(eventId: string, email: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return { error: "Event not found" };

  await requireOrgAccess(event.orgId);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "No user found with that email" };

  const existing = await prisma.eventManager.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  if (existing) return { error: "User is already a manager of this event" };

  await prisma.eventManager.create({
    data: { eventId, userId: user.id },
  });
  revalidatePath(`/admin/org/${event.orgId}/events/${eventId}`);
  return { success: true };
}

export async function removeEventManager(eventId: string, managerId: string) {
  const manager = await prisma.eventManager.findUnique({
    where: { id: managerId },
    include: { event: true },
  });
  if (!manager) return { error: "Manager not found" };

  await requireOrgAccess(manager.event.orgId);

  await prisma.eventManager.delete({ where: { id: managerId } });
  revalidatePath(`/admin/org/${manager.event.orgId}/events/${eventId}`);
  return { success: true };
}

// ──────────────────────────────────────────
// Event Waiver Templates
// ──────────────────────────────────────────

export async function updateEventWaiverTemplate(eventId: string, template: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { waivers: true } } },
  });
  if (!event) return { error: "Event not found" };

  await requireOrgAccess(event.orgId);

  if (event._count.waivers > 0) {
    return { error: "This waiver has been signed and cannot be edited" };
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { waiverTemplate: sanitizeHtml(template) },
  });
  revalidatePath(`/admin/org/${event.orgId}/events/${eventId}`);
  return { success: true };
}

// ──────────────────────────────────────────
// Waivers
// ──────────────────────────────────────────

interface WaiverInput {
  eventId: string;
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
  isVolunteer: boolean;
  volunteerHours?: number;
  familyMembers: { firstName: string; lastName: string; age: number }[];
}

export async function submitWaiver(data: WaiverInput) {
  const session = await auth();
  const userId = session?.user?.id || null;

  // Check for existing waiver by authenticated user
  if (userId) {
    const existingByUser = await prisma.waiver.findUnique({
      where: { userId_eventId: { userId, eventId: data.eventId } },
    });
    if (existingByUser) return { error: "You have already signed a waiver for this event" };
  }

  // Check for existing waiver by email (prevents duplicates for guests and authenticated users)
  const existingByEmail = await prisma.waiver.findUnique({
    where: { email_eventId: { email: data.email, eventId: data.eventId } },
  });
  if (existingByEmail) return { error: "A waiver has already been signed with this email for this event" };

  const event = await prisma.event.findUnique({
    where: { id: data.eventId },
    include: { org: true },
  });
  if (!event) return { error: "Event not found" };

  const isGuest = !userId;

  await prisma.waiver.create({
    data: {
      userId,
      eventId: data.eventId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      dateOfBirth: new Date(data.dateOfBirth),
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      signatureType: data.signatureType,
      signatureData: data.signatureData,
      mailchimpOptIn: data.mailchimpOptIn,
      isVolunteer: data.isVolunteer,
      volunteerHours: data.isVolunteer && data.volunteerHours ? data.volunteerHours : null,
      familyMembers: data.familyMembers.length > 0 ? data.familyMembers : undefined,
    },
  });

  // Send confirmation email (non-blocking, don't fail submission)
  try {
    await sendWaiverConfirmationEmail(
      data.email,
      data.firstName,
      event.name,
      event.org.name,
      new Date(),
      data.familyMembers.length,
      isGuest
    );
  } catch (error) {
    console.error("Waiver confirmation email error:", error);
  }

  // Subscribe to Mailchimp if opted in
  if (data.mailchimpOptIn) {
    try {
      await subscribeToMailchimp(data.email, data.firstName, data.lastName);
    } catch (error) {
      console.error("Mailchimp subscribe error:", error);
    }
  }

  redirect(
    `/thank-you?name=${encodeURIComponent(data.firstName)}&count=${data.familyMembers.length}&event=${encodeURIComponent(event.name)}&org=${encodeURIComponent(event.org.name)}${isGuest ? "&guest=true" : ""}`
  );
}

async function subscribeToMailchimp(email: string, firstName: string, lastName: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) return;

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
        merge_fields: { FNAME: firstName, LNAME: lastName },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.title === "Member Exists") return;
    throw new Error(`Mailchimp API error: ${errorData.title}`);
  }
}

export async function getEventWaivers(eventId: string, search?: string) {
  await requireEventAccess(eventId);

  if (search) {
    // Search signer fields AND family member names (JSON array)
    const searchLower = `%${search.toLowerCase()}%`;
    const waiverIds = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "Waiver"
      WHERE "eventId" = ${eventId}
      AND (
        LOWER("firstName") LIKE ${searchLower}
        OR LOWER("lastName") LIKE ${searchLower}
        OR LOWER("email") LIKE ${searchLower}
        OR EXISTS (
          SELECT 1 FROM jsonb_array_elements("familyMembers"::jsonb) AS fm
          WHERE LOWER(fm->>'firstName') LIKE ${searchLower}
          OR LOWER(fm->>'lastName') LIKE ${searchLower}
        )
      )
    `;
    const ids = waiverIds.map((w) => w.id);
    if (ids.length === 0) return [];

    return prisma.waiver.findMany({
      where: { id: { in: ids } },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.waiver.findMany({
    where: { eventId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWaiver(id: string) {
  const waiver = await prisma.waiver.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      event: { include: { org: true } },
    },
  });

  if (waiver) {
    await requireEventAccess(waiver.eventId);
  }

  return waiver;
}

export async function verifyVolunteerHours(waiverId: string, hours: number) {
  const user = await requireAuth();

  const waiver = await prisma.waiver.findUnique({
    where: { id: waiverId },
    select: { eventId: true, isVolunteer: true },
  });
  if (!waiver) return { error: "Waiver not found" };
  if (!waiver.isVolunteer) return { error: "This waiver is not marked as volunteer" };

  await requireEventAccess(waiver.eventId);

  await prisma.waiver.update({
    where: { id: waiverId },
    data: {
      verifiedHours: hours,
      hoursVerifiedAt: new Date(),
      hoursVerifiedBy: user.id,
    },
  });

  revalidatePath(`/admin/event/${waiver.eventId}/waivers`);
  return { success: true };
}

export async function getUserWaivers() {
  const user = await requireAuth();
  return prisma.waiver.findMany({
    where: { userId: user.id },
    include: {
      event: { include: { org: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserWaiver(id: string) {
  const user = await requireAuth();
  return prisma.waiver.findFirst({
    where: { id, userId: user.id },
    include: {
      event: { include: { org: true } },
    },
  });
}

// ──────────────────────────────────────────
// Check-ins
// ──────────────────────────────────────────

export async function checkInUser(eventId: string, userId: string) {
  const checker = await requireEventAccess(eventId);

  const existing = await prisma.checkIn.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });
  if (existing) return { error: "User is already checked in" };

  await prisma.checkIn.create({
    data: { userId, eventId, checkedInBy: checker.id },
  });
  revalidatePath(`/admin/event/${eventId}/checkin`);
  return { success: true };
}

export async function undoCheckIn(eventId: string, userId: string) {
  await requireEventAccess(eventId);

  await prisma.checkIn.delete({
    where: { userId_eventId: { userId, eventId } },
  });
  revalidatePath(`/admin/event/${eventId}/checkin`);
  return { success: true };
}

export async function getEventCheckIns(eventId: string) {
  await requireEventAccess(eventId);

  return prisma.checkIn.findMany({
    where: { eventId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      checker: { select: { name: true } },
    },
    orderBy: { checkedInAt: "desc" },
  });
}

// ──────────────────────────────────────────
// Password Reset
// ──────────────────────────────────────────

export async function requestPasswordReset(data: { email: string; turnstileToken: string }) {
  if (!data.turnstileToken || !(await verifyTurnstile(data.turnstileToken))) {
    return { error: "Verification failed. Please try again." };
  }

  // Always return success to prevent email enumeration
  const successMsg = "If an account exists with that email, we've sent a password reset link.";

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.password) return { success: true, message: successMsg };

  // Delete any existing reset tokens for this email
  await prisma.verificationToken.deleteMany({ where: { identifier: data.email } });

  // Generate and hash token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(rawToken, 10);

  await prisma.verificationToken.create({
    data: {
      identifier: data.email,
      token: hashedToken,
      expires: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  try {
    await sendPasswordResetEmail(data.email, rawToken);
  } catch (error) {
    console.error("Failed to send reset email:", error);
  }

  return { success: true, message: successMsg };
}

export async function resetPassword(data: { email: string; token: string; password: string }) {
  if (data.password.length < 8) return { error: "Password must be at least 8 characters" };

  const tokens = await prisma.verificationToken.findMany({
    where: { identifier: data.email },
  });

  let matchedToken = null;
  for (const t of tokens) {
    if (await bcrypt.compare(data.token, t.token)) {
      matchedToken = t;
      break;
    }
  }

  if (!matchedToken) return { error: "Invalid or expired reset link" };

  if (matchedToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: matchedToken.identifier, token: matchedToken.token } },
    });
    return { error: "This reset link has expired" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { email: data.email },
      data: { password: hashedPassword },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier: matchedToken.identifier, token: matchedToken.token } },
    }),
  ]);

  return { success: true };
}

// ──────────────────────────────────────────
// User Profile
// ──────────────────────────────────────────

export async function getProfile() {
  const sessionUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      password: true,
      accounts: { select: { provider: true } },
    },
  });

  if (!user) redirect("/auth/signin");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    bio: user.bio,
    hasPassword: !!user.password,
    hasGoogle: user.accounts.some((a) => a.provider === "google"),
  };
}

export async function updateProfile(data: { name?: string; bio?: string }) {
  const user = await requireAuth();

  if (data.name !== undefined && data.name.trim() === "") {
    return { error: "Name cannot be empty" };
  }

  if (data.bio !== undefined && data.bio.length > 500) {
    return { error: "Bio must be 500 characters or less" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.bio !== undefined && { bio: data.bio.trim() || null }),
    },
  });

  revalidatePath("/account");
  return { success: true };
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const sessionUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { password: true },
  });

  if (!user?.password) {
    return { error: "Password change is not available for Google-only accounts" };
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) return { error: "Current password is incorrect" };

  if (data.newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: sessionUser.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

// ──────────────────────────────────────────
// Users (Super Admin)
// ──────────────────────────────────────────

export async function getUsers(search?: string) {
  await requireRole(["SUPER_ADMIN"]);

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orgMembers: true, waivers: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(userId: string, role: "SUPER_ADMIN" | "USER") {
  await requireRole(["SUPER_ADMIN"]);

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin/super/users");
  return { success: true };
}

// ──────────────────────────────────────────
// User's orgs (for nav/dashboard)
// ──────────────────────────────────────────

export async function getUserOrgs() {
  const user = await requireAuth();

  if (user.role === "SUPER_ADMIN") {
    return prisma.organization.findMany({
      orderBy: { name: "asc" },
    });
  }

  const memberships = await prisma.orgMember.findMany({
    where: { userId: user.id },
    include: { org: true },
  });
  return memberships.map((m) => m.org);
}

// ──────────────────────────────────────────
// Submissions (Support & Feature Requests)
// ──────────────────────────────────────────

export async function getSubmissionCounts() {
  await requireRole(["SUPER_ADMIN"]);
  const [supportCount, featureCount] = await Promise.all([
    prisma.supportTicket.count({ where: { status: "NEW" } }),
    prisma.featureRequest.count({ where: { status: "NEW" } }),
  ]);
  return { supportCount, featureCount, total: supportCount + featureCount };
}

export async function getSupportTickets(status?: string) {
  await requireRole(["SUPER_ADMIN"]);
  return prisma.supportTicket.findMany({
    where: status && status !== "ALL" ? { status: status as "NEW" | "IN_PROGRESS" | "RESOLVED" } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeatureRequests(status?: string) {
  await requireRole(["SUPER_ADMIN"]);
  return prisma.featureRequest.findMany({
    where: status && status !== "ALL" ? { status: status as "NEW" | "IN_PROGRESS" | "RESOLVED" } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getSupportTicket(id: string) {
  await requireRole(["SUPER_ADMIN"]);
  return prisma.supportTicket.findUnique({ where: { id } });
}

export async function getFeatureRequest(id: string) {
  await requireRole(["SUPER_ADMIN"]);
  return prisma.featureRequest.findUnique({ where: { id } });
}

export async function updateSubmissionStatus(type: "support" | "feature", id: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED") {
  await requireRole(["SUPER_ADMIN"]);
  if (type === "support") {
    await prisma.supportTicket.update({ where: { id }, data: { status } });
  } else {
    await prisma.featureRequest.update({ where: { id }, data: { status } });
  }
  return { success: true };
}
