# Support & Feature Request Submissions System

**Date:** 2026-03-10
**Status:** Approved

## Problem

The `/support` contact form has no backend handler. The `/suggest` feature request form emails submissions to a hardcoded address via Resend. Neither stores data in the database, making submissions invisible in the admin interface and impossible to track.

## Decision

Store all support tickets and feature requests in the database and display them in the super admin interface with status tracking. Remove the email-sending approach entirely.

## Design

### Database Models

Two new Prisma models sharing a `SubmissionStatus` enum:

**Enum: `SubmissionStatus`** — `NEW`, `IN_PROGRESS`, `RESOLVED`

**Model: `SupportTicket`**
- `id` (String, cuid)
- `name` (String)
- `email` (String)
- `subject` (String)
- `message` (String, @db.Text)
- `status` (SubmissionStatus, default NEW)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Model: `FeatureRequest`**
- `id` (String, cuid)
- `name` (String)
- `email` (String)
- `category` (String)
- `feature` (String, @db.Text)
- `problem` (String?, @db.Text, optional)
- `status` (SubmissionStatus, default NEW)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### API Routes

**`POST /api/support`** — Validate required fields (name, email, subject, message), enforce length limits, create `SupportTicket`, return `{ ok: true }`.

**`POST /api/suggest`** — Validate required fields (name, email, category, feature), enforce length limits, create `FeatureRequest`, return `{ ok: true }`. Replaces the current Resend email implementation.

### Server Actions

- `getSubmissions(type, status?)` — List support tickets or feature requests, optionally filtered by status. Super admin only.
- `getSubmission(type, id)` — Fetch a single ticket or request. Super admin only.
- `updateSubmissionStatus(type, id, status)` — Change status (NEW/IN_PROGRESS/RESOLVED). Super admin only.
- `getSubmissionCounts()` — Return count of NEW submissions for dashboard badge.

### Super Admin Pages

**`/admin/super/submissions`** — Tabbed list view
- Two tabs: "Support Tickets" and "Feature Requests"
- Status filter: All / New / In Progress / Resolved
- Table columns: Name, Email, Subject (or Category), Status badge, Date, View link
- Follows existing super admin table patterns

**`/admin/super/submissions/[type]/[id]`** — Detail view
- Displays all submitted fields
- Status dropdown to change status
- Back link to submissions list

**`/admin/super/page.tsx`** — Dashboard update
- Add "Submissions" link to quick links section
- Show count of new submissions as badge

### Files

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | Modify | Add SubmissionStatus enum, SupportTicket and FeatureRequest models |
| `src/app/api/support/route.ts` | Create | POST handler — validate and store support ticket |
| `src/app/api/suggest/route.ts` | Modify | Replace Resend email with DB insert |
| `src/lib/actions.ts` | Modify | Add server actions for listing, viewing, updating status, counts |
| `src/app/admin/super/submissions/page.tsx` | Create | Tabbed list with status filter |
| `src/app/admin/super/submissions/[type]/[id]/page.tsx` | Create | Detail view with status management |
| `src/app/admin/super/page.tsx` | Modify | Add submissions link and new-count badge |

### What Stays the Same

- `/support` and `/suggest` form UIs (no frontend changes to public forms)
- Existing super admin pages (organizations, users)
- All other server actions and API routes
