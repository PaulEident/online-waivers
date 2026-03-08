# Waiver System MVP Specification

**Project:** Multi-tenant digital waiver platform  
**Timeline:** 2-3 weeks to MVP  
**Current Status:** Basic waiver form + NextAuth working at `https://cp30.pauleident.com`

---

## Core Problem

Organizations need a simple way to collect digital waivers for events, with role-based access for check-in and management.

---

## User Roles & Permissions

### Role Hierarchy
```
SUPER_ADMIN (platform owner)
  ↓
ORG_OWNER / ORG_ADMIN (manage organizations)
  ↓
EVENT_MANAGER (check-in volunteers)
  ↓
USER (attendees/volunteers)
```

### Permissions Matrix

| Feature | Super Admin | Org Owner/Admin | Event Manager | User |
|---------|-------------|-----------------|---------------|------|
| Create organizations | ✅ | ❌ | ❌ | ❌ |
| Manage all orgs | ✅ | ❌ | ❌ | ❌ |
| Manage assigned org(s) | ✅ | ✅ | ❌ | ❌ |
| Create events | ✅ | ✅ | ❌ | ❌ |
| Assign Event Managers | ✅ | ✅ | ❌ | ❌ |
| Edit waiver template | ✅ | ✅ | ❌ | ❌ |
| Check in attendees | ✅ | ✅ | ✅ | ❌ |
| Sign waivers | ✅ | ✅ | ✅ | ✅ |
| View own waivers | ✅ | ✅ | ✅ | ✅ |

---

## Database Schema

### Users
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // bcrypt hash for email/password auth
  role          UserRole  @default(USER)
  
  accounts      Account[]
  sessions      Session[]
  orgMembers    OrgMember[]
  waivers       Waiver[]
  checkIns      CheckIn[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum UserRole {
  SUPER_ADMIN
  ORG_OWNER
  ORG_ADMIN
  EVENT_MANAGER
  USER
}
```

### Organizations
```prisma
model Organization {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  waiverTemplate  String   @db.Text  // HTML with template variables
  
  members         OrgMember[]
  events          Event[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### OrgMember (Many-to-Many with Roles)
```prisma
model OrgMember {
  id     String @id @default(cuid())
  userId String
  orgId  String
  role   OrgRole
  
  user   User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  org    Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, orgId])
}

enum OrgRole {
  OWNER
  ADMIN
  EVENT_MANAGER
}
```

### Events
```prisma
model Event {
  id          String    @id @default(cuid())
  orgId       String
  name        String
  slug        String
  shortCode   String    @unique  // For short URLs: /e/ABC123
  date        DateTime?
  location    String?
  description String?   @db.Text
  
  org         Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  waivers     Waiver[]
  checkIns    CheckIn[]
  managers    EventManager[]
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@unique([orgId, slug])
}
```

### EventManager (Event-specific access)
```prisma
model EventManager {
  id      String @id @default(cuid())
  eventId String
  userId  String
  
  event   Event  @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  assignedAt DateTime @default(now())
  
  @@unique([eventId, userId])
}
```

### Waivers (Signed by users)
```prisma
model Waiver {
  id                    String   @id @default(cuid())
  userId                String
  eventId               String
  
  // Participant info
  firstName             String
  lastName              String
  email                 String
  phone                 String?
  dateOfBirth           DateTime
  
  // Emergency contact
  emergencyContactName  String
  emergencyContactPhone String
  
  // Family members (children under 18)
  familyMembers         Json?    // Array of {firstName, lastName, dateOfBirth}
  
  // Signature
  signatureData         String   @db.Text  // Base64 canvas data
  signatureType         String   // "drawn" | "typed"
  signedAt              DateTime @default(now())
  ipAddress             String?
  userAgent             String?
  
  // Marketing opt-in
  mailchimpOptIn        Boolean  @default(false)
  
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  event                 Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  createdAt             DateTime @default(now())
  
  @@unique([userId, eventId])  // One waiver per user per event
}
```

### CheckIns (Track event attendance)
```prisma
model CheckIn {
  id          String   @id @default(cuid())
  userId      String
  eventId     String
  checkedInBy String   // User ID of person who checked them in
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  checker     User     @relation("CheckedInBy", fields: [checkedInBy], references: [id])
  
  checkedInAt DateTime @default(now())
  
  @@unique([userId, eventId])  // One check-in per user per event
}
```

---

## URL Structure

### Public Routes
- `/` → Welcome page (login/signup buttons)
- `/auth/signin` → Sign in (Google or Email/Password)
- `/auth/signup` → Create account
- `/events/[orgSlug]/[eventSlug]` → Event waiver form (auth required)
- `/e/[shortCode]` → Short URL redirect to waiver form

### User Dashboard
- `/dashboard` → User's events, waivers, check-ins

### Organization Admin
- `/admin/org/[orgId]` → Org dashboard
- `/admin/org/[orgId]/settings` → Edit org details, waiver template
- `/admin/org/[orgId]/events` → List events
- `/admin/org/[orgId]/events/new` → Create event
- `/admin/org/[orgId]/events/[eventId]` → Edit event
- `/admin/org/[orgId]/members` → Manage org members

### Event Manager
- `/admin/event/[eventId]/checkin` → Check-in interface (name search)
- `/admin/event/[eventId]/waivers` → View signed waivers

### Super Admin
- `/admin/super` → Platform dashboard
- `/admin/super/organizations` → List all orgs
- `/admin/super/organizations/new` → Create org
- `/admin/super/users` → Manage users and roles

---

## Waiver Template System

### Template Variables
Org admins can use these variables in their waiver template:

- `{{ORG_NAME}}` → Organization name
- `{{EVENT_NAME}}` → Event name
- `{{EVENT_DATE}}` → Event date (formatted)
- `{{EVENT_LOCATION}}` → Event location
- `{{YEAR}}` → Current year

### Default Template
Use the existing Iron County Trail Club waiver as the default template.

Example:
```html
<h3>RELEASE AND WAIVER OF LIABILITY, ASSUMPTION OF RISK, AND INDEMNITY AGREEMENT</h3>
<p><strong>EVENT:</strong> {{EVENT_NAME}}, organized by {{ORG_NAME}}</p>
<p>In consideration of being permitted to participate in {{EVENT_NAME}}...</p>
```

### Org Admin Interface
- Rich text editor (or simple textarea for MVP)
- Preview mode (shows rendered waiver with sample data)
- "Reset to Default" button
- List of available variables

---

## Authentication Flow

### Sign In/Sign Up
1. User visits event URL: `/events/iron-county-trail-club/candlelight-snowshoe`
2. Not authenticated → Redirect to `/auth/signin?callbackUrl=/events/...`
3. Sign in via:
   - **Google OAuth** (existing, working)
   - **Email + Password** (new, need to add)
4. After auth → Redirect back to event waiver form
5. User signs waiver → Redirect to `/dashboard`

### Session Management
- NextAuth.js v5 (already configured)
- JWT strategy
- 30-day session expiry

---

## Check-In Interface

### Features (MVP)
- **Name search:** Type name, shows matching users
- **Waiver status indicator:**
  - ✅ Green = Signed waiver
  - ❌ Red = No waiver
  - ⚠️ Yellow = Checked in but no waiver (flag for review)
- **Check-in button:** Mark as checked in
- **Check-in list:** Show all checked-in users
- **Export CSV:** Download check-in list

### UI Mockup (text)
```
┌─────────────────────────────────────────┐
│  Candlelight Snowshoe Check-In          │
│  Iron County Trail Club                 │
├─────────────────────────────────────────┤
│  Search: [________________] [Search]    │
├─────────────────────────────────────────┤
│  Results:                               │
│  ✅ Paul Eident (signed, not checked in)│
│     [Check In]                          │
│  ✅ John Doe (signed, checked in 2:30pm)│
│  ❌ Jane Smith (no waiver)              │
│     [Check In Anyway?]                  │
└─────────────────────────────────────────┘
```

---

## MVP Feature List

### ✅ Phase 1 (Must-Have - 2-3 weeks)

**Auth:**
- [x] Google OAuth (working)
- [ ] Email/password signup and login
- [ ] Role-based access control

**Database:**
- [ ] Prisma schema (Organizations, Events, Waivers, CheckIns)
- [ ] Database migrations
- [ ] Seed script (create Super Admin + test org)

**Super Admin:**
- [ ] Create organizations
- [ ] Assign Org Owners
- [ ] View all orgs/events/waivers

**Org Admin:**
- [ ] Org dashboard
- [ ] Edit waiver template (simple textarea MVP)
- [ ] Create events
- [ ] Assign Event Managers to events
- [ ] View org waivers and check-ins

**Event Manager:**
- [ ] Check-in interface (name search)
- [ ] View event waivers
- [ ] Mark users as checked in

**User:**
- [ ] Sign waivers for events
- [ ] View own waivers and check-ins
- [ ] User dashboard

**Event Waiver Form:**
- [ ] Render org waiver template with event data
- [ ] Capture signature (canvas drawing or typed)
- [ ] Save waiver to database
- [ ] Prevent duplicate waivers (one per user per event)

**URLs:**
- [ ] `/events/[orgSlug]/[eventSlug]` (long URL)
- [ ] `/e/[shortCode]` (short URL redirect)

---

### ❌ Phase 2 (Nice-to-Have - Later)

- [ ] QR code check-in
- [ ] Org-level waivers (sign once, RSVP to events)
- [ ] Public org creation (users request, Super Admin approves)
- [ ] Apple SSO
- [ ] Advanced reporting/analytics
- [ ] Rich text editor for waiver templates (TipTap, Quill)
- [ ] Waiver PDF export
- [ ] Email notifications (waiver signed, event reminders)
- [ ] Mobile app (PWA for now)

---

## Tech Stack

**Current:**
- Next.js 16 (App Router) ✅
- Prisma + PostgreSQL (Neon) ✅
- NextAuth.js v5 (Google OAuth working) ✅
- Tailwind CSS ✅
- TypeScript ✅

**Add for MVP:**
- `bcrypt` (password hashing)
- Email/password provider for NextAuth
- Prisma migrations

---

## Development Plan

### Week 1: Foundation
- [ ] Update Prisma schema (multi-tenant)
- [ ] Database migrations
- [ ] Add email/password auth
- [ ] Role-based middleware
- [ ] Super Admin panel (create orgs)

### Week 2: Core Features
- [ ] Org Admin panel (create events, edit waiver template)
- [ ] Event waiver form (render template)
- [ ] Save waivers to database
- [ ] User dashboard

### Week 3: Check-In & Polish
- [ ] Event Manager check-in interface
- [ ] Name search + check-in
- [ ] Short URLs (`/e/[code]`)
- [ ] Testing with Iron County
- [ ] Bug fixes + polish

---

## Success Criteria (MVP Launch)

✅ **You** can:
- Create an organization (Iron County Trail Club)
- Assign Org Admins
- Edit the waiver template

✅ **Org Admins** can:
- Create events (Candlelight Snowshoe)
- Assign Event Managers

✅ **Event Managers** can:
- Search for attendees by name
- See waiver status (signed/not signed)
- Check in attendees

✅ **Users** can:
- Visit event URL (shareable link)
- Sign in (Google or email/password)
- Sign waiver
- See their signed waivers in dashboard

✅ **Iron County Trail Club** uses it for a real event (Candlelight Snowshoe 2026)

---

## Notes

- **Security:** All routes require auth except home page and auth pages
- **Mobile-first:** Waiver form and check-in interface must work on phones
- **Performance:** Optimize for 1,000+ waivers per event
- **Data retention:** Keep waivers indefinitely (legal requirement)
- **Privacy:** GDPR-friendly (user can request deletion, but waiver signatures may be retained for legal reasons)

---

## Questions / Decisions

- [ ] Should Org Admins be able to manage multiple organizations? ✅ **YES**
- [ ] Can users edit a waiver after signing? ❌ **NO** (legal document)
- [ ] Export format for waivers? **CSV + PDF (Phase 2)**
- [ ] Mailchimp integration for opt-ins? **Later (Phase 2)**
- [ ] Stripe integration for paid events? **Later (beyond MVP)**

---

**Last Updated:** 2026-03-08  
**Status:** Ready for development
