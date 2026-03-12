"use server";

import { prisma } from "./prisma";
import { auth } from "./auth";
import { revalidatePath } from "next/cache";
import { requireAuth, requireOrgAccess } from "./actions";

import { sendVolunteerHoursEmail, sendAdminVolunteerNotificationEmail } from "./email";

// ──────────────────────────────────────────
// Volunteer lookup
// ──────────────────────────────────────────

interface VolunteerInfo {
  name: string;
  email: string;
  familyMembers: { firstName: string; lastName: string }[];
}

export async function lookupVolunteerByEmail(
  orgId: string,
  email: string
): Promise<{ error?: string; volunteer?: VolunteerInfo; openSessions?: Array<{ id: string; volunteerName: string; familyMemberName: string | null; clockIn: Date }>; expiredSessions?: Array<{ id: string; volunteerName: string; familyMemberName: string | null; clockIn: Date }> }> {
  // Find org and check time tracking is enabled
  const config = await prisma.volunteerTimeConfig.findUnique({
    where: { organizationId: orgId },
  });
  if (config && !config.enabled) {
    return { error: "Volunteer time tracking is not available for this organization" };
  }

  // Find all waivers for this email in this org
  const waivers = await prisma.waiver.findMany({
    where: {
      email: email.toLowerCase(),
      event: { orgId },
    },
    select: {
      firstName: true,
      lastName: true,
      familyMembers: true,
    },
  });

  if (waivers.length === 0) {
    return { error: "No waiver on file for this email. You need a signed waiver to log volunteer hours." };
  }

  // Use first waiver's name as primary
  const primaryWaiver = waivers[0];
  const name = `${primaryWaiver.firstName} ${primaryWaiver.lastName}`;

  // Deduplicate family members across all waivers (case-insensitive firstName + lastName)
  const seen = new Set<string>();
  const familyMembers: { firstName: string; lastName: string }[] = [];
  for (const waiver of waivers) {
    if (!waiver.familyMembers) continue;
    const members = waiver.familyMembers as Array<{ firstName: string; lastName: string; age?: number }>;
    for (const member of members) {
      const key = `${member.firstName.toLowerCase()}|${member.lastName.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        familyMembers.push({ firstName: member.firstName, lastName: member.lastName });
      }
    }
  }

  // Check for auto-expire: flag open sessions past the threshold
  const autoExpireHours = config?.autoExpireHours ?? 12;
  const expireThreshold = new Date(Date.now() - autoExpireHours * 60 * 60 * 1000);

  await prisma.volunteerTimeLog.updateMany({
    where: {
      organizationId: orgId,
      volunteerEmail: email.toLowerCase(),
      clockOut: null,
      status: "PENDING",
      clockIn: { lt: expireThreshold },
    },
    data: { status: "EXPIRED" },
  });

  // Fetch open sessions (still clocked in)
  const openSessions = await prisma.volunteerTimeLog.findMany({
    where: {
      organizationId: orgId,
      volunteerEmail: email.toLowerCase(),
      clockOut: null,
      status: "PENDING",
    },
    select: { id: true, volunteerName: true, familyMemberName: true, clockIn: true },
    orderBy: { clockIn: "desc" },
  });

  // Fetch expired sessions (need resolution)
  const expiredSessions = await prisma.volunteerTimeLog.findMany({
    where: {
      organizationId: orgId,
      volunteerEmail: email.toLowerCase(),
      status: "EXPIRED",
    },
    select: { id: true, volunteerName: true, familyMemberName: true, clockIn: true },
    orderBy: { clockIn: "desc" },
  });

  return {
    volunteer: { name, email: email.toLowerCase(), familyMembers },
    openSessions,
    expiredSessions,
  };
}

// ──────────────────────────────────────────
// Clock in/out
// ──────────────────────────────────────────

interface ClockInEntry {
  volunteerName: string;
  familyMemberName?: string;
}

export async function clockIn(
  orgId: string,
  email: string,
  entries: ClockInEntry[]
) {
  const session = await auth();
  const userId = session?.user?.id || null;

  // Verify waiver exists
  const waiverCount = await prisma.waiver.count({
    where: { email: email.toLowerCase(), event: { orgId } },
  });
  if (waiverCount === 0) {
    return { error: "No waiver on file" };
  }

  // Check for already-open sessions for these people
  for (const entry of entries) {
    const existing = await prisma.volunteerTimeLog.findFirst({
      where: {
        organizationId: orgId,
        volunteerEmail: email.toLowerCase(),
        familyMemberName: entry.familyMemberName || null,
        clockOut: null,
        status: "PENDING",
      },
    });
    if (existing) {
      const who = entry.familyMemberName || entry.volunteerName;
      return { error: `${who} is already clocked in` };
    }
  }

  const now = new Date();
  await prisma.volunteerTimeLog.createMany({
    data: entries.map((entry) => ({
      organizationId: orgId,
      userId,
      volunteerEmail: email.toLowerCase(),
      volunteerName: entry.volunteerName,
      familyMemberName: entry.familyMemberName || null,
      clockIn: now,
      isManualEntry: false,
      status: "PENDING" as const,
    })),
  });

  revalidatePath(`/volunteer`);
  return { success: true };
}

export async function clockOut(timeLogId: string) {
  const log = await prisma.volunteerTimeLog.findUnique({
    where: { id: timeLogId },
    include: { organization: { select: { name: true, id: true } } },
  });
  if (!log) return { error: "Time log not found" };
  if (log.clockOut) return { error: "Already clocked out" };

  const now = new Date();
  const totalMinutes = Math.round((now.getTime() - log.clockIn.getTime()) / 60000);

  await prisma.volunteerTimeLog.update({
    where: { id: timeLogId },
    data: { clockOut: now, totalMinutes },
  });

  // Send batched email notifications
  try {
    await sendClockOutEmails(log.organizationId, log.organization.name, log.volunteerEmail, [
      { volunteerName: log.volunteerName, familyMemberName: log.familyMemberName, clockIn: log.clockIn, clockOut: now, totalMinutes },
    ]);
  } catch (e) {
    console.error("Clock out email error:", e);
  }

  revalidatePath(`/volunteer`);
  return { success: true, totalMinutes };
}

// ──────────────────────────────────────────
// Email helper (batches entries per parent)
// ──────────────────────────────────────────

export async function sendClockOutEmails(
  orgId: string,
  orgName: string,
  volunteerEmail: string,
  entries: Array<{ volunteerName: string; familyMemberName: string | null; clockIn: Date; clockOut: Date; totalMinutes: number }>
) {
  // Volunteer confirmation email (one email with all entries)
  try {
    await sendVolunteerHoursEmail(volunteerEmail, orgName, entries);
  } catch (e) {
    console.error("Volunteer hours email error:", e);
  }

  // Admin notification email (one email with all entries)
  try {
    const admins = await prisma.orgMember.findMany({
      where: { orgId, role: { in: ["OWNER", "ADMIN"] } },
      include: { user: { select: { email: true } } },
    });
    const adminEmails = admins.map((a) => a.user.email);
    if (adminEmails.length > 0) {
      await sendAdminVolunteerNotificationEmail(adminEmails, orgName, orgId, entries);
    }
  } catch (e) {
    console.error("Admin volunteer notification error:", e);
  }
}

export async function resolveExpiredSession(
  timeLogId: string,
  actualEndTime: string
) {
  const log = await prisma.volunteerTimeLog.findUnique({
    where: { id: timeLogId },
  });
  if (!log) return { error: "Time log not found" };
  if (log.status !== "EXPIRED") return { error: "Session is not expired" };

  const clockOut = new Date(actualEndTime);
  if (clockOut <= log.clockIn) {
    return { error: "End time must be after start time" };
  }

  const totalMinutes = Math.round((clockOut.getTime() - log.clockIn.getTime()) / 60000);

  await prisma.volunteerTimeLog.update({
    where: { id: timeLogId },
    data: { clockOut, totalMinutes, status: "PENDING" },
  });

  revalidatePath(`/volunteer`);
  return { success: true };
}

// ──────────────────────────────────────────
// Manual entry
// ──────────────────────────────────────────

interface ManualEntryInput {
  volunteerName: string;
  familyMemberName?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export async function submitManualEntry(
  orgId: string,
  email: string,
  entries: ManualEntryInput[]
) {
  const session = await auth();
  const userId = session?.user?.id || null;

  // Verify waiver exists
  const waiverCount = await prisma.waiver.count({
    where: { email: email.toLowerCase(), event: { orgId } },
  });
  if (waiverCount === 0) {
    return { error: "No waiver on file" };
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { name: true },
  });
  if (!org) return { error: "Organization not found" };

  const createdLogs: Array<{ volunteerName: string; familyMemberName: string | null; clockIn: Date; clockOut: Date; totalMinutes: number }> = [];

  for (const entry of entries) {
    const clockIn = new Date(`${entry.date}T${entry.startTime}`);
    const clockOut = new Date(`${entry.date}T${entry.endTime}`);

    if (clockOut <= clockIn) {
      return { error: `End time must be after start time for ${entry.familyMemberName || entry.volunteerName}` };
    }

    const totalMinutes = Math.round((clockOut.getTime() - clockIn.getTime()) / 60000);

    await prisma.volunteerTimeLog.create({
      data: {
        organizationId: orgId,
        userId,
        volunteerEmail: email.toLowerCase(),
        volunteerName: entry.volunteerName,
        familyMemberName: entry.familyMemberName || null,
        clockIn,
        clockOut,
        totalMinutes,
        isManualEntry: true,
        status: "PENDING",
      },
    });

    createdLogs.push({
      volunteerName: entry.volunteerName,
      familyMemberName: entry.familyMemberName || null,
      clockIn,
      clockOut,
      totalMinutes,
    });
  }

  if (createdLogs.length > 0) {
    try {
      await sendClockOutEmails(orgId, org.name, email, createdLogs);
    } catch (e) {
      console.error("Manual entry email error:", e);
    }
  }

  revalidatePath(`/volunteer`);
  return { success: true };
}

// ──────────────────────────────────────────
// Admin review
// ──────────────────────────────────────────

export async function getVolunteerTimeLogs(
  orgId: string,
  filters?: { status?: string; search?: string; dateFrom?: string; dateTo?: string }
) {
  await requireOrgAccess(orgId);

  // Run on-demand expire check
  const config = await prisma.volunteerTimeConfig.findUnique({
    where: { organizationId: orgId },
  });
  const autoExpireHours = config?.autoExpireHours ?? 12;
  const expireThreshold = new Date(Date.now() - autoExpireHours * 60 * 60 * 1000);

  await prisma.volunteerTimeLog.updateMany({
    where: {
      organizationId: orgId,
      clockOut: null,
      status: "PENDING",
      clockIn: { lt: expireThreshold },
    },
    data: { status: "EXPIRED" },
  });

  const where: Record<string, unknown> = { organizationId: orgId };

  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status;
  }
  if (filters?.search) {
    where.OR = [
      { volunteerName: { contains: filters.search, mode: "insensitive" } },
      { volunteerEmail: { contains: filters.search, mode: "insensitive" } },
      { familyMemberName: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters?.dateFrom) {
    where.clockIn = { ...(where.clockIn as object || {}), gte: new Date(filters.dateFrom) };
  }
  if (filters?.dateTo) {
    where.clockIn = { ...(where.clockIn as object || {}), lte: new Date(filters.dateTo + "T23:59:59") };
  }

  return prisma.volunteerTimeLog.findMany({
    where,
    include: {
      reviewer: { select: { name: true } },
    },
    orderBy: { clockIn: "desc" },
  });
}

export async function approveTimeLogs(orgId: string, timeLogIds: string[]) {
  const user = await requireOrgAccess(orgId);

  await prisma.volunteerTimeLog.updateMany({
    where: {
      id: { in: timeLogIds },
      organizationId: orgId,
      status: { in: ["PENDING", "EXPIRED"] },
    },
    data: {
      status: "APPROVED",
      reviewedBy: user.id,
      reviewedAt: new Date(),
    },
  });

  revalidatePath(`/admin/org/${orgId}/volunteer-hours`);
  return { success: true };
}

export async function disputeTimeLog(
  orgId: string,
  timeLogId: string,
  note: string
) {
  const user = await requireOrgAccess(orgId);

  await prisma.volunteerTimeLog.update({
    where: { id: timeLogId, organizationId: orgId },
    data: {
      status: "DISPUTED",
      reviewedBy: user.id,
      reviewedAt: new Date(),
      adminNote: note,
    },
  });

  revalidatePath(`/admin/org/${orgId}/volunteer-hours`);
  return { success: true };
}

export async function reopenTimeLog(orgId: string, timeLogId: string) {
  await requireOrgAccess(orgId);

  await prisma.volunteerTimeLog.update({
    where: { id: timeLogId, organizationId: orgId },
    data: {
      status: "PENDING",
      reviewedBy: null,
      reviewedAt: null,
      adminNote: null,
    },
  });

  revalidatePath(`/admin/org/${orgId}/volunteer-hours`);
  return { success: true };
}

// ──────────────────────────────────────────
// Volunteer time config
// ──────────────────────────────────────────

export async function getVolunteerTimeConfig(orgId: string) {
  return prisma.volunteerTimeConfig.findUnique({
    where: { organizationId: orgId },
  });
}

export async function updateVolunteerTimeConfig(
  orgId: string,
  data: { autoExpireHours?: number; requireApproval?: boolean; enabled?: boolean }
) {
  await requireOrgAccess(orgId);

  await prisma.volunteerTimeConfig.upsert({
    where: { organizationId: orgId },
    update: data,
    create: {
      organizationId: orgId,
      ...data,
    },
  });

  revalidatePath(`/admin/org/${orgId}/settings`);
  return { success: true };
}

// ──────────────────────────────────────────
// Volunteer dashboard (authenticated users)
// ──────────────────────────────────────────

export async function getVolunteerDashboard() {
  const user = await requireAuth();

  const logs = await prisma.volunteerTimeLog.findMany({
    where: { userId: user.id },
    include: {
      organization: { select: { name: true, slug: true } },
    },
    orderBy: { clockIn: "desc" },
    take: 50,
  });

  // Group totals by org
  const orgTotals: Record<string, { orgName: string; orgSlug: string; totalMinutes: number; approvedMinutes: number }> = {};
  for (const log of logs) {
    const key = log.organizationId;
    if (!orgTotals[key]) {
      orgTotals[key] = {
        orgName: log.organization.name,
        orgSlug: log.organization.slug,
        totalMinutes: 0,
        approvedMinutes: 0,
      };
    }
    if (log.totalMinutes) {
      orgTotals[key].totalMinutes += log.totalMinutes;
      if (log.status === "APPROVED") {
        orgTotals[key].approvedMinutes += log.totalMinutes;
      }
    }
  }

  return { logs, orgTotals: Object.values(orgTotals) };
}
