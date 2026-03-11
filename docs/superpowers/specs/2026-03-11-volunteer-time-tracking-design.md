# Volunteer Time Tracking — Design Spec

## Overview

A standalone volunteer time tracking system that works alongside the existing waiver features. Volunteers who have signed a waiver can log hours against an organization via real-time clock in/out or manual entry. Org admins are notified by email and approve hours from a dashboard.

## Problem

Organizations with long-term volunteers (e.g., animal shelters) need to track hours over time. The current system only captures self-reported hours at waiver signing — there's no way to log hours across multiple visits. Younger volunteers without accounts also need a way to track hours.

## Data Model

### VolunteerTimeLog

Individual time entries for volunteer hours.

| Field | Type | Notes |
|-------|------|-------|
| id | String | @id @default(cuid()) |
| organizationId | String | FK to Organization |
| eventId | String? | Optional — only populated for Flow 4 (waiver-signing hours) |
| waiverId | String? | Optional — only populated for Flow 4 (waiver-signing hours), links to the specific waiver that generated the entry |
| userId | String? | Optional — for authenticated volunteers |
| volunteerEmail | String | Always populated, used for guest lookup |
| volunteerName | String | Display name |
| familyMemberName | String? | If logging hours for a minor from the waiver |
| clockIn | DateTime | Start time |
| clockOut | DateTime? | Null while clocked in |
| totalMinutes | Int? | Computed on clock-out or manual entry |
| isManualEntry | Boolean | Default false |
| status | TimeLogStatus | Default PENDING |
| reviewedBy | String? | FK to User — admin who reviewed |
| reviewedAt | DateTime? | When reviewed |
| adminNote | String? | For disputes |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### VolunteerTimeConfig

Per-organization settings for the time tracking feature.

| Field | Type | Notes |
|-------|------|-------|
| id | String | @id @default(cuid()) |
| organizationId | String | Unique FK to Organization |
| autoExpireHours | Int | Default 12 |
| requireApproval | Boolean | Default true |
| enabled | Boolean | Default true |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### TimeLogStatus Enum

`PENDING` | `APPROVED` | `DISPUTED` | `EXPIRED`

### Relation Changes

- Organization gains `volunteerTimeLogs` and `volunteerTimeConfig` relations.
- Event gains optional `volunteerTimeLogs` relation.
- Waiver gains optional `volunteerTimeLogs` relation.
- User gains optional `volunteerTimeLogs` (as volunteer) and `reviewedTimeLogs` (as admin) relations.

## Pages & Routes

### Public

**`/volunteer/[orgSlug]`** — Shared clock-in/out page, QR-scannable.

- Email lookup field identifies the volunteer via their signed waiver(s)
- If no waiver found: "You need a signed waiver to log volunteer hours" + link to org events
- If found: shows volunteer name + family members from waiver (deduplicated across events)
- Volunteer selects themselves and/or family members volunteering that day
- "Clock In" button for real-time tracking
- "Clock Out" button when returning (shows open sessions after email lookup)
- "Add Past Hours" for manual entry (date, start time, end time, person selection)
- Shows expired sessions with prompt to enter actual end time
- Org with time tracking disabled: shows "not available" message

### Authenticated Volunteer Dashboard

**`/dashboard/volunteer`** — Hours across all organizations.

- Current open sessions with clock-out buttons
- Recent time log history with status indicators
- Totals per organization
- Reuses existing dashboard layout

### Admin

**`/admin/org/[orgId]/volunteer-hours`** — Review and manage time logs.

- Linked from the existing org admin navigation (add a "Volunteer Hours" link alongside Events, Members, Settings)
- Filterable by: status (pending/approved/disputed/expired), date range, volunteer name
- Each entry shows: volunteer name, date, clock in/out times, total hours, manual vs. clocked indicator
- Actions: approve, dispute (with note), bulk approve
- Summary stats: total pending, total approved hours

**`/admin/org/[orgId]/settings`** — Existing settings page extended with:

- Enable/disable volunteer time tracking toggle
- Auto-expire hours input (default 12)
- Require approval toggle

## User Flows

### Flow 1: Real-time Clock In/Out (Shared Link / QR Code)

1. Volunteer visits `/volunteer/[orgSlug]` (via QR or shared link)
2. Enters email address
3. System looks up waivers for that email in the org
4. If none found → "No waiver on file" message with link to sign one
5. If found → shows volunteer name + family members from waiver
6. Volunteer selects who is volunteering today
7. Clicks "Clock In" → creates `VolunteerTimeLog` per person, status PENDING, clockIn = now
8. Later, returns to same page, enters email, sees open sessions
9. Clicks "Clock Out" → sets clockOut, computes totalMinutes
10. Confirmation email sent to volunteer
11. Notification email sent to org admins

### Flow 2: Forgot to Clock Out

1. After `autoExpireHours` (default 12), open sessions are flagged as EXPIRED
2. Next time volunteer enters their email, they see the expired session
3. Prompted to enter their actual end time
4. Submitting updates the entry, sets status back to PENDING
5. Admin also sees EXPIRED entries in their dashboard to resolve

### Flow 3: Manual Entry

1. From `/volunteer/[orgSlug]`, volunteer clicks "Add Past Hours"
2. Enters date, start time, end time
3. Selects who volunteered (self + family members)
4. Creates entry with `isManualEntry = true`, status PENDING
5. Same email notifications as real-time flow

### Flow 4: Hours from Waiver Signing

1. Volunteer checks `isVolunteer` and enters hours on the waiver form
2. On waiver submission, a `VolunteerTimeLog` is also created
3. Linked to the event and waiver via `eventId` and `waiverId`
4. `clockIn` is set to the event date (or waiver `signedAt` if no event date); `clockOut` is set to `clockIn` + reported hours. `isManualEntry = true` since these are self-reported, not real-time
5. Status set to PENDING (goes through same admin approval flow)
6. Unifies reporting — all hours visible in the admin dashboard

### Flow 5: Admin Review

1. Admin receives email: "3 new volunteer hours to review for [Org Name]"
2. Clicks link → `/admin/org/[orgId]/volunteer-hours?status=PENDING`
3. Sees pending entries: volunteer name, date, hours, manual vs. clocked
4. Can approve individually, bulk approve, or dispute with a note
5. Approved/disputed status updates are final

## Email Notifications

### Volunteer Confirmation (on clock-out or manual entry)

- **To:** volunteer's email
- **Subject:** "Volunteer hours logged — [Org Name]"
- **Body:** date, clock-in/out times, total hours, who was logged (including family members), status (pending approval)

### Admin Notification (on clock-out or manual entry)

- **To:** all org members with OWNER or ADMIN role
- **Subject:** "Volunteer hours to review — [Org Name]"
- **Body:** volunteer name, date, hours, manual vs. clocked, direct link to review dashboard
- **Batching:** if a parent clocks out multiple family members, one email with all entries (not separate emails)

### Expired Session Notification (future — requires cron job)

Deferred to post-launch. Since auto-expire is on-demand only (triggered by page visits), there's no reliable moment to send this email without a cron job. Admins can see expired entries in the dashboard for now.

### Email Implementation Note

All email templates follow the existing pattern in `src/lib/email.ts`: inline HTML with Resend, using `getBaseUrl()` for links and the shared `fromEmail` constant.

## Edge Cases

- **No waiver on file** — Show message with link to sign a waiver
- **Already clocked in** — Block duplicate clock-in, show open session with clock-out button
- **Clock out before clock in** — Server action validates clockOut > clockIn
- **Manual entry overlap** — Allowed; admin approval is the quality gate
- **Time tracking disabled** — Public page shows "not available" message
- **Multiple waivers across events** — Email lookup returns all family members across all waivers for that org, deduplicated by exact `firstName + lastName` match (case-insensitive). Minor name variations across waivers may result in duplicates; admin can resolve via the dashboard
- **Org deleted** — Lookup only matches organizations that exist. There is no waiver expiration concept in the current schema; any signed waiver qualifies the volunteer for time tracking

## Server Actions

New actions in `lib/actions.ts` (following existing patterns):

- `lookupVolunteerByEmail(orgId, email)` — find waivers + family members (slug-to-ID resolution happens at the page level, consistent with existing action patterns)
- `clockIn(orgId, entries[])` — create time log entries
- `clockOut(timeLogId)` — set clockOut + compute totalMinutes
- `resolveExpiredSession(timeLogId, actualEndTime)` — fix forgotten clock-out
- `submitManualEntry(orgId, entries[])` — create manual time logs
- `getVolunteerTimeLogs(orgId, filters)` — admin list with filtering
- `approveTimeLogs(timeLogIds[])` — bulk approve
- `disputeTimeLog(timeLogId, note)` — dispute with admin note
- `getVolunteerDashboard(userId)` — authenticated user's hours across orgs
- `getVolunteerTimeConfig(orgId)` — get org config
- `updateVolunteerTimeConfig(orgId, config)` — update org config

## Auto-Expire Mechanism

Two triggers for expiring sessions:

1. **On-demand check** — when a volunteer looks up their email or when an admin views the dashboard, check for open sessions past `autoExpireHours` and flag them as EXPIRED
2. **Cron job** (optional future enhancement) — periodic sweep for expired sessions + admin notification

On-demand is sufficient for launch. The cron can be added later if needed.

## QR Code

Organizations can generate a QR code for `/volunteer/[orgSlug]` using the same QR code pattern already used for events. This lets orgs post a physical sign at their location for volunteers to scan and clock in on their phones.

## Testing

- Server action tests: clock in, clock out, manual entry, auto-expire, approval, dispute
- Edge case coverage: no waiver, already clocked in, expired sessions, family member deduplication
- Email template rendering tests
