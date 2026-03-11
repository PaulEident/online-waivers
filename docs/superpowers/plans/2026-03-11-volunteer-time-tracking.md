# Volunteer Time Tracking Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone volunteer time tracking system with real-time clock in/out, manual entry, admin approval, and email notifications that works alongside the existing waiver features.

**Architecture:** New `VolunteerTimeLog` and `VolunteerTimeConfig` Prisma models at the organization level. Server actions in a dedicated file (`src/lib/volunteer-actions.ts`) to keep the existing `actions.ts` focused. Public clock-in page at `/volunteer/[orgSlug]`, admin review at `/admin/org/[orgId]/volunteer-hours`, and integration with the existing waiver form and dashboard.

**Tech Stack:** Next.js 16 (App Router), Prisma/PostgreSQL, Resend (email), React (client components), Tailwind CSS v4

---

## File Structure

| File | Responsibility |
|------|---------------|
| `prisma/schema.prisma` | Add `TimeLogStatus` enum, `VolunteerTimeLog` model, `VolunteerTimeConfig` model, relation updates |
| `src/lib/volunteer-actions.ts` | All server actions for volunteer time tracking (lookup, clock in/out, manual entry, approve, dispute, config) |
| `src/lib/email.ts` | Add `sendVolunteerHoursEmail` and `sendAdminVolunteerNotificationEmail` functions |
| `src/app/volunteer/[orgSlug]/page.tsx` | Public volunteer clock-in/out page (server component: org lookup + config check) |
| `src/components/VolunteerTimeClock.tsx` | Client component: email lookup, person selection, clock in/out, manual entry, expired session resolution |
| `src/app/admin/org/[orgId]/volunteer-hours/page.tsx` | Admin review page: list time logs, filter, approve, dispute |
| `src/components/VolunteerHoursReview.tsx` | Client component: filterable table, approve/dispute actions, bulk approve |
| `src/app/admin/org/[orgId]/settings/page.tsx` | Extend existing settings with volunteer time config section |
| `src/app/admin/org/[orgId]/page.tsx` | Add "Volunteer Hours" nav link |
| `src/app/dashboard/page.tsx` | Add volunteer time log section to existing dashboard |
| `src/components/EventWaiverForm.tsx` | Modify waiver submission to also create VolunteerTimeLog (Flow 4) |

---

## Chunk 1: Database Schema & Server Actions Foundation

### Task 1: Prisma Schema Changes

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add TimeLogStatus enum**

Add after the `SubmissionStatus` enum (around line 33):

```prisma
enum TimeLogStatus {
  PENDING
  APPROVED
  DISPUTED
  EXPIRED
}
```

- [ ] **Step 2: Add VolunteerTimeLog model**

Add after the `CheckIn` model (after line 226):

```prisma
// ──────────────────────────────────────────
// Volunteer Time Tracking
// ──────────────────────────────────────────

model VolunteerTimeLog {
  id               String        @id @default(cuid())
  organizationId   String
  eventId          String?
  waiverId         String?
  userId           String?
  volunteerEmail   String
  volunteerName    String
  familyMemberName String?
  clockIn          DateTime
  clockOut         DateTime?
  totalMinutes     Int?
  isManualEntry    Boolean       @default(false)
  status           TimeLogStatus @default(PENDING)
  reviewedBy       String?
  reviewedAt       DateTime?
  adminNote        String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  event        Event?       @relation(fields: [eventId], references: [id], onDelete: SetNull)
  waiver       Waiver?      @relation(fields: [waiverId], references: [id], onDelete: SetNull)
  user         User?        @relation("VolunteerTimeLogs", fields: [userId], references: [id], onDelete: SetNull)
  reviewer     User?        @relation("ReviewedTimeLogs", fields: [reviewedBy], references: [id], onDelete: SetNull)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model VolunteerTimeConfig {
  id              String  @id @default(cuid())
  organizationId  String  @unique
  autoExpireHours Int     @default(12)
  requireApproval Boolean @default(true)
  enabled         Boolean @default(true)

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 3: Add relations to existing models**

Add to `User` model (after `checkedInBy` line ~55):

```prisma
  volunteerTimeLogs  VolunteerTimeLog[] @relation("VolunteerTimeLogs")
  reviewedTimeLogs   VolunteerTimeLog[] @relation("ReviewedTimeLogs")
```

Add to `Organization` model (after `events` line ~109):

```prisma
  volunteerTimeLogs  VolunteerTimeLog[]
  volunteerTimeConfig VolunteerTimeConfig?
```

Add to `Event` model (after `managers` line ~144):

```prisma
  volunteerTimeLogs VolunteerTimeLog[]
```

Add to `Waiver` model (after `event` relation line ~205):

```prisma
  volunteerTimeLogs VolunteerTimeLog[]
```

- [ ] **Step 4: Generate Prisma client and push schema**

Run: `npx prisma generate && npx prisma db push --accept-data-loss`

Note: `--accept-data-loss` is used for dev/preview databases (consistent with existing build script). For production, migrations should be reviewed manually.

Expected: "Your database is now in sync with your Prisma schema."

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add VolunteerTimeLog and VolunteerTimeConfig schema"
```

---

### Task 2: Core Server Actions — Lookup & Clock In/Out

**Files:**
- Create: `src/lib/volunteer-actions.ts`

- [ ] **Step 1: Create volunteer-actions.ts with imports and lookup action**

```typescript
"use server";

import { prisma } from "./prisma";
import { auth } from "./auth";
import { revalidatePath } from "next/cache";
import { requireAuth, requireOrgAccess } from "./actions";

// Email imports deferred — functions added in Chunk 2, Task 4
// import { sendVolunteerHoursEmail, sendAdminVolunteerNotificationEmail } from "./email";

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
```

- [ ] **Step 2: Add clockIn action**

```typescript
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
```

- [ ] **Step 3: Add clockOut action**

```typescript
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

  // Email notifications are sent by the batch clockOut flow (see sendClockOutEmails helper added in Chunk 2)

  revalidatePath(`/volunteer`);
  return { success: true, totalMinutes };
}
```

- [ ] **Step 4: Add resolveExpiredSession action**

```typescript
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
```

- [ ] **Step 5: Verify the file compiles**

Run: `npx tsc --noEmit`

Note: Email imports are commented out and will be uncommented in Chunk 2, Task 4 when the email functions are created. No type errors expected at this point.

- [ ] **Step 6: Commit**

```bash
git add src/lib/volunteer-actions.ts
git commit -m "feat: add volunteer lookup, clock in/out, and expired session actions"
```

---

### Task 3: Server Actions — Manual Entry, Admin Review & Config

**Files:**
- Modify: `src/lib/volunteer-actions.ts`

- [ ] **Step 1: Add submitManualEntry action**

Append to `src/lib/volunteer-actions.ts`:

```typescript
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

  // Email notifications sent via sendClockOutEmails helper (added in Chunk 2)

  revalidatePath(`/volunteer`);
  return { success: true };
}
```

- [ ] **Step 2: Add admin review actions (getVolunteerTimeLogs, approveTimeLogs, disputeTimeLog)**

```typescript
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
```

- [ ] **Step 3: Add config actions and volunteer dashboard action**

```typescript
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
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/volunteer-actions.ts
git commit -m "feat: add manual entry, admin review, config, and dashboard actions"
```

---

## Chunk 2: Email Templates & Public Volunteer Page

### Task 4: Email Templates

**Files:**
- Modify: `src/lib/email.ts`

- [ ] **Step 1: Add sendVolunteerHoursEmail function (supports batched entries)**

Append to `src/lib/email.ts`:

```typescript
interface VolunteerHoursEntry {
  volunteerName: string;
  familyMemberName: string | null;
  clockIn: Date;
  clockOut: Date;
  totalMinutes: number;
}

export async function sendVolunteerHoursEmail(
  email: string,
  orgName: string,
  entries: VolunteerHoursEntry[]
) {
  if (entries.length === 0) return;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";
  const primaryName = entries[0].volunteerName;

  const entryRows = entries.map((entry) => {
    const hours = Math.floor(entry.totalMinutes / 60);
    const mins = entry.totalMinutes % 60;
    const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    const who = entry.familyMemberName || entry.volunteerName;
    const dateStr = entry.clockIn.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeIn = entry.clockIn.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const timeOut = entry.clockOut.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB; color: #111827; font-size: 14px;">${who}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">${dateStr}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">${timeIn} — ${timeOut}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E5E7EB; color: #111827; font-weight: 600; font-size: 14px;">${duration}</td>
      </tr>`;
  }).join("");

  await resend.emails.send({
    from: `Volntir <${fromEmail}>`,
    to: email,
    subject: `Volunteer hours logged — ${orgName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">Volunteer Hours Logged</h1>
        </div>
        <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
          Hi ${primaryName}, volunteer hours have been logged at <strong>${orgName}</strong>.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: #F9FAFB; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #F3F4F6;">
              <th style="padding: 8px 12px; text-align: left; color: #6B7280; font-size: 12px; font-weight: 600;">Who</th>
              <th style="padding: 8px 12px; text-align: left; color: #6B7280; font-size: 12px; font-weight: 600;">Date</th>
              <th style="padding: 8px 12px; text-align: left; color: #6B7280; font-size: 12px; font-weight: 600;">Time</th>
              <th style="padding: 8px 12px; text-align: left; color: #6B7280; font-size: 12px; font-weight: 600;">Total</th>
            </tr>
          </thead>
          <tbody>${entryRows}</tbody>
        </table>
        <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5;">
          These hours are pending approval by the organization admin.
        </p>
      </div>
    `,
  });
}
```

- [ ] **Step 2: Add sendAdminVolunteerNotificationEmail function (supports batched entries)**

```typescript
export async function sendAdminVolunteerNotificationEmail(
  adminEmails: string[],
  orgName: string,
  orgId: string,
  entries: VolunteerHoursEntry[]
) {
  if (entries.length === 0 || adminEmails.length === 0) return;
  const baseUrl = getBaseUrl();
  const reviewUrl = `${baseUrl}/admin/org/${orgId}/volunteer-hours?status=PENDING`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";

  const totalMins = entries.reduce((sum, e) => sum + e.totalMinutes, 0);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const totalDuration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  const names = [...new Set(entries.map((e) => e.familyMemberName || e.volunteerName))].join(", ");
  const dateStr = entries[0].clockIn.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  await resend.emails.send({
    from: `Volntir <${fromEmail}>`,
    to: adminEmails,
    subject: `Volunteer hours to review — ${orgName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">Volunteer Hours to Review</h1>
        </div>
        <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
          <strong>${names}</strong> logged <strong>${totalDuration}</strong> on ${dateStr} for <strong>${orgName}</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${reviewUrl}" style="display: inline-block; background-color: #ea580c; color: white; font-weight: 600; font-size: 15px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
            Review Hours
          </a>
        </div>
        <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5;">
          You're receiving this because you're an admin of ${orgName} on Volntir.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
        <p style="color: #9CA3AF; font-size: 12px;">
          If the button doesn't work, copy and paste this URL into your browser:<br />
          <a href="${reviewUrl}" style="color: #ea580c; word-break: break-all;">${reviewUrl}</a>
        </p>
      </div>
    `,
  });
}
```

- [ ] **Step 3: Uncomment email imports and add sendClockOutEmails helper to volunteer-actions.ts**

In `src/lib/volunteer-actions.ts`, replace the commented-out email import line with:

```typescript
import { sendVolunteerHoursEmail, sendAdminVolunteerNotificationEmail } from "./email";
```

Then add this helper function after the `clockOut` function and call it from both `clockOut` and `submitManualEntry`:

```typescript
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
```

Update the `clockOut` function's email comment to actually call the helper:

Replace `// Email notifications are sent by the batch clockOut flow (see sendClockOutEmails helper added in Chunk 2)` with:

```typescript
  // Send batched email notifications
  try {
    await sendClockOutEmails(log.organizationId, log.organization.name, log.volunteerEmail, [
      { volunteerName: log.volunteerName, familyMemberName: log.familyMemberName, clockIn: log.clockIn, clockOut: now, totalMinutes },
    ]);
  } catch (e) {
    console.error("Clock out email error:", e);
  }
```

Update the `submitManualEntry` function's email comment similarly:

Replace `// Email notifications sent via sendClockOutEmails helper (added in Chunk 2)` with:

```typescript
  if (createdLogs.length > 0) {
    try {
      await sendClockOutEmails(orgId, org.name, email, createdLogs);
    } catch (e) {
      console.error("Manual entry email error:", e);
    }
  }
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors (or only pre-existing ones)

- [ ] **Step 5: Commit**

```bash
git add src/lib/email.ts src/lib/volunteer-actions.ts
git commit -m "feat: add volunteer hours and admin notification email templates with batching"
```

---

### Task 5: Public Volunteer Page — Server Component

**Files:**
- Create: `src/app/volunteer/[orgSlug]/page.tsx`

- [ ] **Step 1: Create the server component page**

```tsx
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
```

- [ ] **Step 2: Commit**

Note: This page imports `VolunteerTimeClock` which is created in Task 6. TypeScript will show an import error until Task 6 is complete. Verify compilation at the end of Task 6.

```bash
git add src/app/volunteer/[orgSlug]/page.tsx
git commit -m "feat: add public volunteer time tracking page"
```

---

### Task 6: VolunteerTimeClock Client Component

**Files:**
- Create: `src/components/VolunteerTimeClock.tsx`

- [ ] **Step 1: Create the component with email lookup and state management**

```tsx
"use client";

import { useState } from "react";
import {
  lookupVolunteerByEmail,
  clockIn,
  clockOut,
  resolveExpiredSession,
  submitManualEntry,
} from "@/lib/volunteer-actions";

interface VolunteerInfo {
  name: string;
  email: string;
  familyMembers: { firstName: string; lastName: string }[];
}

interface OpenSession {
  id: string;
  volunteerName: string;
  familyMemberName: string | null;
  clockIn: Date;
}

export default function VolunteerTimeClock({
  orgId,
  orgSlug,
  orgName,
  latestEventSlug,
}: {
  orgId: string;
  orgSlug: string;
  orgName: string;
  latestEventSlug?: string;
}) {
  const [email, setEmail] = useState("");
  const [volunteer, setVolunteer] = useState<VolunteerInfo | null>(null);
  const [openSessions, setOpenSessions] = useState<OpenSession[]>([]);
  const [expiredSessions, setExpiredSessions] = useState<OpenSession[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualStartTime, setManualStartTime] = useState("");
  const [manualEndTime, setManualEndTime] = useState("");
  const [expireEndTimes, setExpireEndTimes] = useState<Record<string, string>>({});

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await lookupVolunteerByEmail(orgId, email);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setVolunteer(null);
      return;
    }

    setVolunteer(result.volunteer || null);
    setOpenSessions(
      (result.openSessions || []).map((s) => ({
        ...s,
        clockIn: new Date(s.clockIn),
      }))
    );
    setExpiredSessions(
      (result.expiredSessions || []).map((s) => ({
        ...s,
        clockIn: new Date(s.clockIn),
      }))
    );
  }

  async function handleClockIn() {
    if (selectedPeople.size === 0) {
      setError("Select at least one person to clock in");
      return;
    }
    setError("");
    setLoading(true);

    const entries = Array.from(selectedPeople).map((key) => {
      if (key === "__self__") {
        return { volunteerName: volunteer!.name };
      }
      const [firstName, lastName] = key.split("|");
      return {
        volunteerName: volunteer!.name,
        familyMemberName: `${firstName} ${lastName}`,
      };
    });

    const result = await clockIn(orgId, email, entries);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("Clocked in successfully!");
    setSelectedPeople(new Set());
    // Re-lookup to refresh state
    const refreshed = await lookupVolunteerByEmail(orgId, email);
    if (refreshed.volunteer) {
      setVolunteer(refreshed.volunteer);
      setOpenSessions(
        (refreshed.openSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
      setExpiredSessions(
        (refreshed.expiredSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
    }
  }

  async function handleClockOut(sessionId: string) {
    setError("");
    setLoading(true);
    const result = await clockOut(sessionId);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    const mins = result.totalMinutes || 0;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    setSuccess(`Clocked out! Total: ${h > 0 ? `${h}h ` : ""}${m}m`);

    // Re-lookup
    const refreshed = await lookupVolunteerByEmail(orgId, email);
    if (refreshed.volunteer) {
      setOpenSessions(
        (refreshed.openSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
      setExpiredSessions(
        (refreshed.expiredSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
    }
  }

  async function handleResolveExpired(sessionId: string) {
    const endTime = expireEndTimes[sessionId];
    if (!endTime) {
      setError("Please enter the actual end time");
      return;
    }
    setError("");
    setLoading(true);
    const result = await resolveExpiredSession(sessionId, endTime);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("Session updated and submitted for review");
    // Re-lookup
    const refreshed = await lookupVolunteerByEmail(orgId, email);
    if (refreshed.volunteer) {
      setOpenSessions(
        (refreshed.openSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
      setExpiredSessions(
        (refreshed.expiredSessions || []).map((s) => ({
          ...s,
          clockIn: new Date(s.clockIn),
        }))
      );
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedPeople.size === 0) {
      setError("Select at least one person");
      return;
    }
    setError("");
    setLoading(true);

    const entries = Array.from(selectedPeople).map((key) => {
      if (key === "__self__") {
        return {
          volunteerName: volunteer!.name,
          date: manualDate,
          startTime: manualStartTime,
          endTime: manualEndTime,
        };
      }
      const [firstName, lastName] = key.split("|");
      return {
        volunteerName: volunteer!.name,
        familyMemberName: `${firstName} ${lastName}`,
        date: manualDate,
        startTime: manualStartTime,
        endTime: manualEndTime,
      };
    });

    const result = await submitManualEntry(orgId, email, entries);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("Hours submitted for review!");
    setShowManualEntry(false);
    setManualDate("");
    setManualStartTime("");
    setManualEndTime("");
    setSelectedPeople(new Set());
  }

  function togglePerson(key: string) {
    setSelectedPeople((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Email Lookup */}
      {!volunteer && (
        <form onSubmit={handleLookup} className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your email to get started
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover disabled:opacity-50"
            >
              {loading ? "Looking up..." : "Continue"}
            </button>
          </div>
          {error && (
            <div className="mt-4">
              <p className="text-red-600 text-sm">{error}</p>
              {error.includes("No waiver") && latestEventSlug && (
                <a
                  href={`/events/${orgSlug}/${latestEventSlug}`}
                  className="text-brand text-sm underline mt-1 inline-block"
                >
                  Sign a waiver here
                </a>
              )}
            </div>
          )}
        </form>
      )}

      {/* Volunteer Found */}
      {volunteer && (
        <>
          {/* Header with change email */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {volunteer.name}
                </h2>
                <p className="text-sm text-gray-500">{volunteer.email}</p>
              </div>
              <button
                onClick={() => {
                  setVolunteer(null);
                  setEmail("");
                  setError("");
                  setSuccess("");
                  setOpenSessions([]);
                  setExpiredSessions([]);
                  setSelectedPeople(new Set());
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Change email
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Expired Sessions */}
          {expiredSessions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-amber-800 mb-3">
                Expired Sessions — Please enter actual end time
              </h3>
              {expiredSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-700">
                    {session.familyMemberName || session.volunteerName} —{" "}
                    {new Date(session.clockIn).toLocaleDateString()}{" "}
                    {new Date(session.clockIn).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <input
                    type="datetime-local"
                    value={expireEndTimes[session.id] || ""}
                    onChange={(e) =>
                      setExpireEndTimes((prev) => ({
                        ...prev,
                        [session.id]: e.target.value,
                      }))
                    }
                    className="rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => handleResolveExpired(session.id)}
                    disabled={loading}
                    className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Open Sessions */}
          {openSessions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Currently Clocked In
              </h3>
              {openSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.familyMemberName || session.volunteerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Since{" "}
                      {new Date(session.clockIn).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleClockOut(session.id)}
                    disabled={loading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    Clock Out
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Person Selection + Clock In / Manual Entry */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {showManualEntry ? "Add Past Hours" : "Clock In"}
            </h3>

            {/* Person checkboxes */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPeople.has("__self__")}
                  onChange={() => togglePerson("__self__")}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm font-medium text-gray-900">
                  {volunteer.name} (me)
                </span>
              </label>
              {volunteer.familyMembers.map((fm) => {
                const key = `${fm.firstName}|${fm.lastName}`;
                return (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPeople.has(key)}
                      onChange={() => togglePerson(key)}
                      className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-gray-900">
                      {fm.firstName} {fm.lastName}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Manual Entry Fields */}
            {showManualEntry ? (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={manualStartTime}
                      onChange={(e) => setManualStartTime(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      required
                      value={manualEndTime}
                      onChange={(e) => setManualEndTime(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Hours"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowManualEntry(false)}
                    className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleClockIn}
                  disabled={loading || selectedPeople.size === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Clocking in..." : "Clock In"}
                </button>
                <button
                  onClick={() => setShowManualEntry(true)}
                  className="text-gray-600 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Add Past Hours
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/VolunteerTimeClock.tsx
git commit -m "feat: add VolunteerTimeClock client component"
```

---

## Chunk 3: Admin Pages & Integration

### Task 7: Admin Volunteer Hours Review Page

**Files:**
- Create: `src/app/admin/org/[orgId]/volunteer-hours/page.tsx`
- Create: `src/components/VolunteerHoursReview.tsx`

- [ ] **Step 1: Create the server component page**

```tsx
import { getVolunteerTimeLogs } from "@/lib/volunteer-actions";
import { requireOrgAccess, getOrganization } from "@/lib/actions";
import VolunteerHoursReview from "@/components/VolunteerHoursReview";

export const dynamic = "force-dynamic";

export default async function VolunteerHoursPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{ status?: string; search?: string; dateFrom?: string; dateTo?: string }>;
}) {
  const { orgId } = await params;
  const filters = await searchParams;
  await requireOrgAccess(orgId);

  const [logs, org] = await Promise.all([
    getVolunteerTimeLogs(orgId, filters),
    getOrganization(orgId),
  ]);

  const pendingCount = logs.filter((l) => l.status === "PENDING").length;
  const approvedMinutes = logs
    .filter((l) => l.status === "APPROVED")
    .reduce((sum, l) => sum + (l.totalMinutes || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Volunteer Hours</h1>
          <p className="text-white/70 mt-1">{org?.name}</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Pending Review</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Approved Hours</p>
            <p className="text-2xl font-bold text-green-600">
              {Math.floor(approvedMinutes / 60)}h {approvedMinutes % 60}m
            </p>
          </div>
        </div>

        <VolunteerHoursReview
          orgId={orgId}
          initialLogs={JSON.parse(JSON.stringify(logs))}
          initialFilters={filters}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the VolunteerHoursReview client component**

```tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { approveTimeLogs, disputeTimeLog } from "@/lib/volunteer-actions";

interface TimeLog {
  id: string;
  volunteerName: string;
  volunteerEmail: string;
  familyMemberName: string | null;
  clockIn: string;
  clockOut: string | null;
  totalMinutes: number | null;
  isManualEntry: boolean;
  status: string;
  adminNote: string | null;
  reviewer: { name: string | null } | null;
  reviewedAt: string | null;
}

export default function VolunteerHoursReview({
  orgId,
  initialLogs,
  initialFilters,
}: {
  orgId: string;
  initialLogs: TimeLog[];
  initialFilters: { status?: string; search?: string; dateFrom?: string; dateTo?: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [logs] = useState<TimeLog[]>(initialLogs);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [disputeId, setDisputeId] = useState<string | null>(null);
  const [disputeNote, setDisputeNote] = useState("");

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/org/${orgId}/volunteer-hours?${params.toString()}`);
  }

  async function handleBulkApprove() {
    if (selectedIds.size === 0) return;
    setLoading(true);
    await approveTimeLogs(orgId, Array.from(selectedIds));
    setSelectedIds(new Set());
    setLoading(false);
    router.refresh();
  }

  async function handleApprove(id: string) {
    setLoading(true);
    await approveTimeLogs(orgId, [id]);
    setLoading(false);
    router.refresh();
  }

  async function handleDispute() {
    if (!disputeId || !disputeNote.trim()) return;
    setLoading(true);
    await disputeTimeLog(orgId, disputeId, disputeNote);
    setDisputeId(null);
    setDisputeNote("");
    setLoading(false);
    router.refresh();
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    const pending = logs.filter((l) => l.status === "PENDING" || l.status === "EXPIRED");
    if (selectedIds.size === pending.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pending.map((l) => l.id)));
    }
  }

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const formatDuration = (mins: number | null) => {
    if (!mins) return "—";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-amber-100 text-amber-800",
      APPROVED: "bg-green-100 text-green-800",
      DISPUTED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || ""}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            value={initialFilters.status || "ALL"}
            onChange={(e) => updateFilter("status", e.target.value === "ALL" ? "" : e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="DISPUTED">Disputed</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Name or email"
            defaultValue={initialFilters.search || ""}
            onBlur={(e) => updateFilter("search", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateFilter("search", e.currentTarget.value);
            }}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={initialFilters.dateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={initialFilters.dateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkApprove}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 ml-auto"
          >
            Approve Selected ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    selectedIds.size > 0 &&
                    selectedIds.size ===
                      logs.filter((l) => l.status === "PENDING" || l.status === "EXPIRED").length
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Volunteer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Time</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Duration</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No volunteer hours found
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {(log.status === "PENDING" || log.status === "EXPIRED") && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(log.id)}
                      onChange={() => toggleSelect(log.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">
                    {log.familyMemberName || log.volunteerName}
                  </p>
                  {log.familyMemberName && (
                    <p className="text-xs text-gray-500">via {log.volunteerName}</p>
                  )}
                  <p className="text-xs text-gray-400">{log.volunteerEmail}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{formatDate(log.clockIn)}</td>
                <td className="px-4 py-3 text-gray-700">
                  {formatTime(log.clockIn)}
                  {log.clockOut ? ` — ${formatTime(log.clockOut)}` : " — ..."}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatDuration(log.totalMinutes)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-500">
                    {log.isManualEntry ? "Manual" : "Clocked"}
                  </span>
                </td>
                <td className="px-4 py-3">{statusBadge(log.status)}</td>
                <td className="px-4 py-3">
                  {(log.status === "PENDING" || log.status === "EXPIRED") && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(log.id)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-800 text-xs font-medium disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setDisputeId(log.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Dispute
                      </button>
                    </div>
                  )}
                  {log.status === "DISPUTED" && log.adminNote && (
                    <p className="text-xs text-red-600">{log.adminNote}</p>
                  )}
                  {(log.status === "APPROVED" || log.status === "DISPUTED") && log.reviewer && (
                    <p className="text-xs text-gray-400">
                      by {log.reviewer.name}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispute Modal */}
      {disputeId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute Hours</h3>
            <textarea
              value={disputeNote}
              onChange={(e) => setDisputeNote(e.target.value)}
              placeholder="Reason for dispute..."
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:outline-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDisputeId(null);
                  setDisputeNote("");
                }}
                className="text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDispute}
                disabled={loading || !disputeNote.trim()}
                className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="text-center">
        <a href={`/admin/org/${orgId}`} className="text-sm text-gray-500 hover:text-gray-700">
          Back to Organization
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/org/[orgId]/volunteer-hours/page.tsx src/components/VolunteerHoursReview.tsx
git commit -m "feat: add admin volunteer hours review page"
```

---

### Task 8: Extend Admin Org Settings & Navigation

**Files:**
- Modify: `src/app/admin/org/[orgId]/settings/page.tsx`
- Modify: `src/app/admin/org/[orgId]/page.tsx`

- [ ] **Step 1: Add volunteer time config to settings page**

The settings page is a `"use client"` component. Add imports, state, and a new settings card.

Add to imports at top of `src/app/admin/org/[orgId]/settings/page.tsx`:

```typescript
import { getVolunteerTimeConfig, updateVolunteerTimeConfig } from "@/lib/volunteer-actions";
```

Add new state variables after the existing `useState` declarations (after line 15):

```typescript
  const [vtEnabled, setVtEnabled] = useState(true);
  const [vtAutoExpireHours, setVtAutoExpireHours] = useState(12);
  const [vtRequireApproval, setVtRequireApproval] = useState(true);
  const [vtSaving, setVtSaving] = useState(false);
  const [vtMessage, setVtMessage] = useState("");
```

Add a second `useEffect` after the existing one (after line 26) to load config:

```typescript
  useEffect(() => {
    getVolunteerTimeConfig(orgId).then((config) => {
      if (config) {
        setVtEnabled(config.enabled);
        setVtAutoExpireHours(config.autoExpireHours);
        setVtRequireApproval(config.requireApproval);
      }
    });
  }, [orgId]);
```

Add a save handler after `handleSave` (after line 40):

```typescript
  const handleVtSave = async () => {
    setVtSaving(true);
    setVtMessage("");
    const result = await updateVolunteerTimeConfig(orgId, {
      enabled: vtEnabled,
      autoExpireHours: vtAutoExpireHours,
      requireApproval: vtRequireApproval,
    });
    if (result.success) {
      setVtMessage("Volunteer tracking settings saved!");
      setTimeout(() => setVtMessage(""), 3000);
    }
    setVtSaving(false);
  };
```

Add a new card after the "Default Waiver Template" card and before the button `<div>` (before the `<div className="flex gap-3">` at line 95):

```tsx
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Volunteer Time Tracking</h2>
            {vtMessage && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700 mb-4">
                {vtMessage}
              </div>
            )}
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={vtEnabled}
                  onChange={(e) => setVtEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm font-medium text-gray-700">Enable volunteer time tracking</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-expire open sessions after (hours)
                </label>
                <input
                  type="number"
                  min={1}
                  value={vtAutoExpireHours}
                  onChange={(e) => setVtAutoExpireHours(parseInt(e.target.value) || 12)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={vtRequireApproval}
                  onChange={(e) => setVtRequireApproval(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm font-medium text-gray-700">Require admin approval for volunteer hours</span>
              </label>
              <button
                type="button"
                onClick={handleVtSave}
                disabled={vtSaving}
                className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover disabled:opacity-50 transition-colors"
              >
                {vtSaving ? "Saving..." : "Save Tracking Settings"}
              </button>
            </div>
          </div>
```

- [ ] **Step 2: Add "Volunteer Hours" link to org admin page**

In `src/app/admin/org/[orgId]/page.tsx`, add inside the `<div className="flex flex-wrap gap-3">` quick links section, after the Settings link and before the "My Dashboard" link (between lines 76 and 77):

```tsx
          <Link
            href={`/admin/org/${orgId}/volunteer-hours`}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            Volunteer Hours
          </Link>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/org/[orgId]/settings/page.tsx src/app/admin/org/[orgId]/page.tsx
git commit -m "feat: add volunteer time config to settings and nav link"
```

---

### Task 9: Waiver Form Integration (Flow 4)

**Files:**
- Modify: `src/lib/actions.ts` (submitWaiver function)

- [ ] **Step 1: Add VolunteerTimeLog creation to submitWaiver**

In `src/lib/actions.ts`, find the `submitWaiver` function. Locate the `prisma.waiver.create()` call. **Capture its return value** by changing:

```typescript
  await prisma.waiver.create({
```

to:

```typescript
  const createdWaiver = await prisma.waiver.create({
```

Then, **after** the `prisma.waiver.create()` block and **before** the `// Send confirmation email` comment, insert:

```typescript
  // Create VolunteerTimeLog if volunteer with hours (Flow 4)
  if (data.isVolunteer && data.volunteerHours && data.volunteerHours > 0) {
    const clockIn = event.date || new Date();
    const totalMinutes = Math.round(data.volunteerHours * 60);
    const clockOut = new Date(clockIn.getTime() + totalMinutes * 60000);

    try {
      await prisma.volunteerTimeLog.create({
        data: {
          organizationId: event.orgId,
          eventId: data.eventId,
          waiverId: createdWaiver.id,
          userId,
          volunteerEmail: data.email.toLowerCase(),
          volunteerName: `${data.firstName} ${data.lastName}`,
          clockIn,
          clockOut,
          totalMinutes,
          isManualEntry: true,
          status: "PENDING",
        },
      });
    } catch (error) {
      console.error("Failed to create volunteer time log from waiver:", error);
    }
  }
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/lib/actions.ts
git commit -m "feat: create VolunteerTimeLog on waiver submission (Flow 4)"
```

---

### Task 10: Dashboard Integration

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Add volunteer time tracking data to dashboard**

The dashboard is a server component. Add import at top of `src/app/dashboard/page.tsx`:

```typescript
import { getVolunteerDashboard } from "@/lib/volunteer-actions";
```

After the existing data fetching (after `const orgs = await getUserOrgs();`), add:

```typescript
  const volunteerData = await getVolunteerDashboard();
  const openSessions = volunteerData.logs.filter((l) => !l.clockOut && l.status === "PENDING");
```

- [ ] **Step 2: Replace existing Volunteer Hours section with enhanced version**

Replace the existing `{/* Volunteer Hours Summary */}` section (the `<div>` with `border-l-teal-500` that checks `waivers.some((w) => w.isVolunteer)`) with:

```tsx
        {/* Volunteer Hours Summary */}
        {(waivers.some((w) => w.isVolunteer) || volunteerData.logs.length > 0) && (
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 border-l-4 border-l-teal-500">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-base font-bold text-gray-900">Volunteer Hours</h2>
            </div>

            {/* Org totals from time tracking */}
            {volunteerData.orgTotals.length > 0 && (
              <div className="space-y-2 mb-4">
                {volunteerData.orgTotals.map((org) => (
                  <div key={org.orgSlug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{org.orgName}</p>
                      <p className="text-xs text-gray-500">
                        {Math.floor(org.approvedMinutes / 60)}h approved · {Math.floor(org.totalMinutes / 60)}h total
                      </p>
                    </div>
                    <Link
                      href={`/volunteer/${org.orgSlug}`}
                      className="text-xs text-brand hover:text-brand-hover font-medium"
                    >
                      Log hours
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Open sessions */}
            {openSessions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-amber-700 mb-2">Currently Clocked In</p>
                {openSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg mb-1">
                    <span className="text-sm text-gray-700">
                      {session.familyMemberName || session.volunteerName} — {session.organization.name}
                    </span>
                    <Link
                      href={`/volunteer/${session.organization.slug}`}
                      className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                    >
                      Clock out
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Legacy waiver-based hours */}
            {waivers.some((w) => w.isVolunteer) && (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-teal-700">{totalVolunteerHours}</span>
                <span className="text-sm text-gray-500">hours from event waivers</span>
              </div>
            )}
          </div>
        )}
```

Note: The `volunteerData.logs` includes `organization: { name, slug }` from the `getVolunteerDashboard` action. Open sessions link to the org's volunteer page where the user can clock out. No client component needed since this is display-only with link-based actions.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: add volunteer time tracking section to dashboard"
```

---

### Task 11: Final Verification

- [ ] **Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`

Expected: No new errors

- [ ] **Step 2: Run the dev server to verify pages load**

Run: `npm run dev` (manual check)

Verify:
- `/volunteer/[orgSlug]` loads and shows email lookup
- `/admin/org/[orgId]/volunteer-hours` loads behind auth
- `/admin/org/[orgId]/settings` shows volunteer time config
- `/admin/org/[orgId]` shows Volunteer Hours nav link
- `/dashboard` shows volunteer time section

- [ ] **Step 3: Final commit if any fixes needed**

If fixes were made, stage only the specific files that were changed and commit with a descriptive message. Skip this step if no fixes were needed.
