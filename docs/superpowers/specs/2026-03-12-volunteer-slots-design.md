# Volunteer Slots/Shifts — Design Spec

## Overview

Add signup.com-style volunteer shift scheduling to the existing waiver platform. Admins define shifts on events (e.g., "Registration Table" from 8am–5pm with 1-hour slots for 2 people each), and the system auto-generates individual time slots. Volunteers browse and sign up for slots via the existing `/volunteer/[orgSlug]` page. Full waitlist support with auto-promotion.

## Problem

Organizations need to schedule volunteers for specific roles and time windows at events. The existing time tracking system records hours after-the-fact, but there's no way to plan coverage in advance, limit signups, or manage a waitlist. Admins currently coordinate shifts manually outside the platform.

## Data Model

### SlotSignupStatus Enum

`CONFIRMED` | `WAITLISTED` | `CANCELLED`

### VolunteerShift

The parent container — defines the overall coverage need. Used for slot generation and display grouping.

| Field | Type | Notes |
|-------|------|-------|
| id | String | @id @default(cuid()) |
| eventId | String | FK to Event |
| title | String | e.g., "Registration Table", "Setup Crew" |
| description | String? | Optional details about the role |
| startTime | DateTime | Overall coverage start (e.g., 8:00 AM) |
| endTime | DateTime | Overall coverage end (e.g., 5:00 PM) |
| slotDurationMinutes | Int | Length of each slot (e.g., 60) |
| defaultMaxVolunteers | Int | People needed per slot at generation time |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

**Relations:** Event (many shifts per event), VolunteerSlot[] (generated slots)

**Indexes:** `@@index([eventId])`

### VolunteerSlot

An individual time block within a shift. Independently editable after generation.

| Field | Type | Notes |
|-------|------|-------|
| id | String | @id @default(cuid()) |
| shiftId | String | FK to VolunteerShift |
| startTime | DateTime | Slot start |
| endTime | DateTime | Slot end |
| maxVolunteers | Int | Copied from shift default, independently editable |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

**Relations:** VolunteerShift, VolunteerSlotSignup[]

**Indexes:** `@@index([shiftId])`

### VolunteerSlotSignup

A volunteer's signup for a specific slot.

| Field | Type | Notes |
|-------|------|-------|
| id | String | @id @default(cuid()) |
| slotId | String | FK to VolunteerSlot |
| volunteerEmail | String | Matches waiver lookup pattern |
| volunteerName | String | Display name |
| familyMemberName | String | Default "" — empty string for the primary volunteer, name for family members. Non-nullable to support the unique constraint (Postgres treats NULL != NULL in unique indexes). |
| status | SlotSignupStatus | Set explicitly by server action (CONFIRMED or WAITLISTED). No @default — runtime logic determines status. |
| waitlistPosition | Int? | Null for CONFIRMED, ordinal for WAITLISTED |
| cancelledAt | DateTime? | When cancelled |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

**Constraints:** `@@unique([slotId, volunteerEmail, familyMemberName])` — one signup per person per slot. Works correctly because `familyMemberName` is non-nullable (empty string for self).

**Indexes:** `@@index([volunteerEmail])`, `@@index([slotId, status])` — the latter supports the hot-path confirmed-count queries in signup and browse.

### Cascade Behavior

All FKs use `onDelete: Cascade`:
- `VolunteerShift.eventId → Event` — deleting an event removes all its shifts
- `VolunteerSlot.shiftId → VolunteerShift` — deleting a shift removes all its slots
- `VolunteerSlotSignup.slotId → VolunteerSlot` — deleting a slot removes all its signups

Note: The existing `deleteEvent` action checks for waivers before deletion. Shift cleanup is handled by the DB cascade — no extra application logic needed for event deletion.

### Relation Changes

- Event gains `volunteerShifts VolunteerShift[]`
- VolunteerShift gains `slots VolunteerSlot[]` and `event Event`
- VolunteerSlot gains `shift VolunteerShift` and `signups VolunteerSlotSignup[]`

### Independence from Time Tracking

Shift signups and time tracking are fully independent. No FK between VolunteerSlotSignup and VolunteerTimeLog. Signing up for a slot does not auto-clock-in. They serve different purposes: slots = scheduling/planning, time logs = actual hours worked.

## Slot Auto-Generation

When an admin creates a shift, the system auto-generates slots:

**Example:** Title "Registration Table", 8:00 AM – 5:00 PM, 60-minute slots, 2 people each

**Result:** 9 slots generated:
- 8:00–9:00 AM (max 2)
- 9:00–10:00 AM (max 2)
- 10:00–11:00 AM (max 2)
- 11:00 AM–12:00 PM (max 2)
- 12:00–1:00 PM (max 2)
- 1:00–2:00 PM (max 2)
- 2:00–3:00 PM (max 2)
- 3:00–4:00 PM (max 2)
- 4:00–5:00 PM (max 2)

**Algorithm:**
1. Calculate total minutes = endTime - startTime
2. Number of slots = floor(totalMinutes / slotDurationMinutes)
3. Generate slots sequentially from startTime
4. Each slot gets maxVolunteers = defaultMaxVolunteers
5. If total time doesn't divide evenly, remaining time is ignored (admin can manually add an oddly-sized slot if needed)

After generation, each slot is independent and can be individually edited (change capacity, adjust times, delete).

## Pages & Routes

### Admin: Shift Management on Event Detail Page

**Location:** Add a "Volunteer Shifts" section to `/admin/org/[orgId]/events/[eventId]/page.tsx`, between the Edit Event form and the Waiver Template Editor.

**Component:** `ShiftManager.tsx` (new)

**Create Shift Flow:**
1. Admin clicks "Add Shift"
2. Inline form appears with fields:
   - Title (text, required) — e.g., "Registration Table"
   - Description (textarea, optional)
   - Start Time (datetime-local, required)
   - End Time (datetime-local, required)
   - Slot Duration (select: 30min, 1hr, 2hr, 4hr, or custom minutes input)
   - Volunteers per Slot (number, required, min 1)
3. Preview shows: "This will create N slots of X minutes, each needing Y volunteers"
4. Submit → server action creates shift + auto-generates slots
5. UI refreshes to show the shift with its generated slots

**View/Edit Shifts:**
- Each shift displays as a collapsible card showing title, time range, slot count
- Expanded view shows a table of individual slots: time range, confirmed/max count, waitlist count
- Each slot row has: edit capacity (inline number input), delete button
- Shift-level actions: edit shift details, delete shift (cascades to all slots + sends cancellation emails)
- Clicking a slot row expands to show signup list with status badges

### Volunteer: Shift Browse & Signup

**Location:** Add to existing `/volunteer/[orgSlug]` page via `VolunteerTimeClock.tsx`

**Flow:** After email lookup (existing), show tabs:

1. **Time Clock** (existing, default) — clock in/out, manual entry
2. **My Shifts** (new) — volunteer's current signups
3. **Browse Shifts** (new) — upcoming shifts to sign up for

**My Shifts Tab** — Component: `MyShiftsList.tsx` (new)
- Lists all signups for this volunteer across upcoming events in this org
- Each row: event name, shift title, slot time, status badge (Confirmed/Waitlisted)
- Waitlisted entries show position: "Waitlist #3"
- Cancel button with confirmation on each row
- Empty state: "You haven't signed up for any shifts yet"

**Browse Shifts Tab** — Component: `ShiftSignupBrowser.tsx` (new)
- Groups by event, then by shift
- Each shift shows: title, description, overall time range
- Under each shift: grid/list of slots showing time range and spots remaining
- Slot states:
  - Open: "2 of 4 spots left" → "Sign Up" button
  - Full: "Full — Join Waitlist" button
  - Already signed up: "Signed Up ✓" (disabled)
  - Past: hidden (only show future slots)
- For volunteers with family members: checkbox to select who is signing up (self + family members), same pattern as clock-in

## Server Actions

New file: `src/lib/slot-actions.ts`

### Auth Pattern

All admin actions follow the existing pattern in `actions.ts`: fetch the entity first to resolve `orgId` via joins, then call `requireOrgAccess(orgId)`. Specifically:
- Actions taking `eventId` → fetch `event.orgId` → `requireOrgAccess(event.orgId)`
- Actions taking `shiftId` → fetch `shift.event.orgId` via join → `requireOrgAccess(shift.event.orgId)`
- Actions taking `slotId` → fetch `slot.shift.event.orgId` via join → `requireOrgAccess(slot.shift.event.orgId)`

All volunteer-facing read actions are public (no auth required) — they only need an `orgId` (resolved from `orgSlug` at the page level, matching the existing pattern in `volunteer-actions.ts`).

### Admin Actions

**`createShift(eventId, data)`**
- Params: `{ title, description?, startTime, endTime, slotDurationMinutes, defaultMaxVolunteers }`
- Auth: fetch event → `requireOrgAccess(event.orgId)`
- Validates: endTime > startTime, slotDurationMinutes > 0, defaultMaxVolunteers >= 1
- Creates VolunteerShift + auto-generates VolunteerSlot records in a `prisma.$transaction`
- Returns: shift with generated slots
- Revalidates event detail page

**`updateShift(shiftId, data)`**
- Params: `{ title?, description? }` — only metadata, not times (would require slot regeneration)
- Auth: fetch shift with `include: { event: true }` → `requireOrgAccess(shift.event.orgId)`
- **Limitation:** Time changes not supported. To change the coverage window, admin must delete the shift and create a new one. This is an intentional simplification — regenerating slots while preserving existing signups is complex and error-prone. The UI should surface this: "To change times, delete this shift and create a new one."

**`deleteShift(shiftId)`**
- Auth: fetch shift with event join → `requireOrgAccess(shift.event.orgId)`
- Deletes shift (DB cascade removes slots + signups)
- After deletion, sends cancellation emails non-blockingly (try/catch, matching existing pattern in `volunteer-actions.ts`)

**`updateSlot(slotId, data)`**
- Params: `{ maxVolunteers?, startTime?, endTime? }`
- Auth: fetch slot with `include: { shift: { include: { event: true } } }` → `requireOrgAccess(...)`
- Rejects reducing maxVolunteers below current confirmed count
- Revalidates event detail page

**`deleteSlot(slotId)`**
- Auth: fetch slot with shift+event join → `requireOrgAccess(...)`
- Deletes slot (DB cascade removes signups)
- After deletion, sends cancellation emails non-blockingly

**`getEventShifts(eventId)`** (admin version)
- Auth: `requireOrgAccess(event.orgId)`
- Returns shifts with slots, including confirmed count, waitlist count, and full signup details per slot
- Used by admin event detail page

### Volunteer Actions (public, no auth)

**`getEventShiftsPublic(eventId)`**
- No auth required — public data only
- Returns shifts with slots, including confirmed count and waitlist count per slot (no volunteer names/emails)
- Used by volunteer browse tab

**`signupForSlot(slotId, email, volunteerName, familyMemberName?)`**
- Verifies waiver exists for this email in the event's org
- Rejects signups for past slots (startTime < now)
- **Uses `prisma.$transaction` with serializable isolation** to prevent race conditions:
  1. Count confirmed signups for the slot (within transaction)
  2. If count < maxVolunteers → create with status CONFIRMED
  3. If count >= maxVolunteers → create with status WAITLISTED, waitlistPosition = max + 1
  4. Unique constraint catches any duplicate that slips through
- After transaction: sends confirmation or waitlist email non-blockingly
- Revalidates volunteer page

**`cancelSlotSignup(signupId, email)`**
- Verifies signup belongs to this email
- **Entire cancellation + promotion in a single `prisma.$transaction`:**
  1. Update signup: status CANCELLED, cancelledAt = now
  2. If was CONFIRMED and slot hasn't started yet:
     a. Find first WAITLISTED signup (lowest waitlistPosition) → update to CONFIRMED, set waitlistPosition = null
     b. Decrement waitlistPosition for all remaining WAITLISTED signups for this slot (single `updateMany`)
- After transaction: send promotion email to promoted volunteer non-blockingly
- Revalidates volunteer page

**`getVolunteerSlotSignups(orgId, email)`**
- Takes `orgId` (resolved from `orgSlug` at the page level, consistent with existing pattern)
- Returns all non-cancelled signups for this email across upcoming events in the org
- Includes shift title, slot times, event name, status, waitlist position
- Used by "My Shifts" tab

**`getOrgUpcomingShifts(orgId)`**
- Takes `orgId` (resolved from `orgSlug` at the page level)
- Returns all shifts with future slots for the org
- Includes slot signup counts (confirmed, waitlisted)
- Used by "Browse Shifts" tab

## Email Notifications

Four new email functions added to `src/lib/email.ts`, following the existing inline HTML + Resend pattern:

| Email | Trigger | Recipient | Subject |
|-------|---------|-----------|---------|
| Shift signup confirmation | Volunteer signs up (confirmed) | Volunteer | "Shift confirmed: {title} — {event}" |
| Waitlist notification | Volunteer joins waitlist | Volunteer | "Waitlisted: {title} — {event}" |
| Waitlist promotion | Auto-promoted from waitlist | Volunteer | "You're in! {title} — {event}" |
| Shift cancellation | Admin deletes shift/slot | All affected volunteers | "Shift cancelled: {title} — {event}" |

Each email includes: event name, shift title, slot date/time, org name, and a link to `/volunteer/[orgSlug]`.

**Deferred: Reminder emails.** The business plan calls for 24-hour-before-event reminders. This requires a cron job (same situation as the time tracking expired-session notifications). Deferred to a follow-up — when cron infrastructure is added, shift reminders and expired-session notifications can share it.

## Edge Cases

- **Uneven time division:** If 8am–5pm with 2-hour slots → 4 full slots (8–10, 10–12, 12–2, 2–4), remaining 1 hour is not generated. Admin can manually note this or adjust times.
- **Overlapping signups:** Allowed. A volunteer can sign up for consecutive or overlapping slots. No server-side enforcement.
- **Past events:** Signup rejected server-side. Browse tab only shows future slots.
- **Cancellation after slot start:** Allowed, but no waitlist promotion if slot has already started.
- **Reducing slot capacity below confirmed count:** Rejected with error. Admin must cancel signups first.
- **Deleting shift/slot with signups:** Allowed. Cancellation emails sent before cascade delete.
- **Duplicate signups:** Prevented by unique constraint `[slotId, volunteerEmail, familyMemberName]`. Server action returns friendly error.
- **Waitlist ordering:** Simple integer `waitlistPosition`. On promotion, remaining positions decremented. Fine for expected scale.

## Data Flow: Volunteer Page

The existing `/volunteer/[orgSlug]/page.tsx` resolves `orgSlug` → org record and passes `orgId` + `orgSlug` to `VolunteerTimeClock`. The updated flow:

1. **Page (server component):** Resolves `orgSlug` → org. Passes `orgId`, `orgSlug`, and `orgName` to `VolunteerTimeClock`. No shift data pre-fetched server-side — shift data is fetched client-side after email lookup, since it depends on knowing the volunteer's email for signup status.

2. **VolunteerTimeClock (client component):** After email lookup succeeds (existing flow), adds tab state: `"clock" | "shifts" | "browse"` (default `"clock"`). Passes `orgId`, `volunteerEmail`, `volunteerName`, and `familyMembers` down to the new tab components.

3. **MyShiftsList:** Calls `getVolunteerSlotSignups(orgId, email)` on mount. Renders signups with cancel buttons.

4. **ShiftSignupBrowser:** Calls `getOrgUpcomingShifts(orgId)` on mount. Renders shift/slot grid. Sign-up buttons call `signupForSlot()` and refresh both tabs.

## Component Summary

| Component | Type | Location | Purpose |
|-----------|------|----------|---------|
| `ShiftManager.tsx` | New | `src/components/` | Admin: create shifts, view/edit slots, manage signups |
| `ShiftSignupBrowser.tsx` | New | `src/components/` | Volunteer: browse upcoming shifts, sign up for slots |
| `MyShiftsList.tsx` | New | `src/components/` | Volunteer: view own signups, cancel |
| `VolunteerTimeClock.tsx` | Modified | `src/components/` | Add tabs for My Shifts and Browse Shifts after email lookup |
| Event detail page | Modified | `src/app/admin/org/[orgId]/events/[eventId]/page.tsx` | Add ShiftManager section |

## Files to Create/Modify

**New files:**
- `src/lib/slot-actions.ts` — all server actions
- `src/components/ShiftManager.tsx` — admin shift/slot management
- `src/components/ShiftSignupBrowser.tsx` — volunteer shift browsing
- `src/components/MyShiftsList.tsx` — volunteer's signups list

**Modified files:**
- `prisma/schema.prisma` — add 3 models + 1 enum + Event relation
- `src/lib/email.ts` — add 4 email templates
- `src/components/VolunteerTimeClock.tsx` — add tab navigation + integrate new components
- `src/app/admin/org/[orgId]/events/[eventId]/page.tsx` — add ShiftManager section
- `src/app/volunteer/[orgSlug]/page.tsx` — fetch and pass shift data

## Verification

1. **Schema:** Run `npx prisma migrate dev` — verify migration succeeds
2. **Admin flow:** Create event → add shift (e.g., "Setup", 8am–12pm, 1hr slots, 2 people) → verify 4 slots generated → edit one slot's capacity → delete one slot
3. **Volunteer flow:** Visit `/volunteer/[orgSlug]` → enter email → browse shifts → sign up for a slot → verify confirmation email → check "My Shifts" tab
4. **Waitlist:** Fill a slot to capacity → sign up another volunteer → verify WAITLISTED status → cancel a confirmed volunteer → verify auto-promotion + email
5. **Edge cases:** Try signing up for past slot (rejected), duplicate signup (rejected), reduce capacity below confirmed count (rejected)
