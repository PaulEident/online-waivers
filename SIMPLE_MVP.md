# Volntir - Simple MVP

**Goal:** Ship a working multi-org volunteer platform in 2-3 weeks.

**Philosophy:** Build small. Ship fast. Learn from real users.

---

## ✅ What You Already Have

From your `online-waivers` project:
- ✅ Digital waiver form (draw or type signature)
- ✅ Family member support
- ✅ Email capture + Mailchimp integration
- ✅ Admin dashboard with search
- ✅ Check-in system
- ✅ Event detail page
- ✅ Next.js + Prisma + PostgreSQL stack
- ✅ Working deployment process

**This is 80% of the MVP already done!**

---

## 🎯 What To Add (The Other 20%)

### 1. User Accounts
**Why:** So volunteers can see their history across multiple events/orgs

**What:**
- NextAuth.js v5 with Google SSO (primary)
- Email/password as backup
- User profile: name, email, phone, emergency contact
- "My Events" page showing upcoming + past events
- Total volunteer hours (just sum hours from attended events)

**Time:** 3-4 days

---

### 2. Multi-Organization Support
**Why:** So multiple orgs can use the platform

**What:**
- Database changes:
  - Organizations table (name, description, owner_id)
  - Events belong to Organizations
  - Users can create/own organizations
- "Create Organization" flow (simple form)
- Organization dashboard (reuse your existing admin dashboard)
- Public org pages: `volntir.com/org/iron-county-trail-club`

**Time:** 3-4 days

---

### 3. Multi-Event Per Org
**Why:** Orgs need to run multiple events

**What:**
- "Create Event" button on org dashboard
- Event form: name, date, time, location, description, volunteer hours
- List of org's events (upcoming + past)
- Public event pages: `volntir.com/org/[slug]/events/[event-id]`

**Time:** 2-3 days

---

### 4. Registration Flow (Improved)
**Why:** Connect events to user accounts

**What:**
- If user is signed in: auto-fill waiver with their profile info
- If user is NOT signed in: show "Sign in with Google" OR fill out waiver
- After waiver submission → prompt to create account (if not signed in)
- Link waiver to user account (if they have one)

**Time:** 2-3 days

---

### 5. Basic Reporting
**Why:** Orgs need to export attendee lists

**What:**
- CSV export of attendees (existing functionality)
- Add "Total Hours" column
- That's it.

**Time:** 1 day

---

## 🚫 What NOT To Build (Yet)

**Do NOT add these until you have 50+ users asking for them:**

❌ Social features (friends, feeds, likes)  
❌ Achievements/badges  
❌ Certificate downloads ($5)  
❌ Verification service ($2-3/check)  
❌ Background checks  
❌ Certificate uploads (CPR, First Aid)  
❌ Ratings/reviews  
❌ Donations/fundraising  
❌ SMS notifications  
❌ Event search/discovery  
❌ Mobile app  

**These are all Phase 2+. Ship the basics first.**

---

## 📋 Database Schema Changes

### New Tables

```prisma
model User {
  id                String   @id @default(cuid())
  name              String?
  email             String   @unique
  emailVerified     DateTime?
  image             String?
  phone             String?
  emergencyContactName  String?
  emergencyContactPhone String?
  createdAt         DateTime @default(now())
  
  accounts          Account[]
  sessions          Session[]
  organizations     Organization[]
  waivers           Waiver[]
}

model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  events      Event[]
}

model Event {
  id               String   @id @default(cuid())
  name             String
  description      String?
  date             DateTime
  location         String?
  volunteerHours   Int      @default(3)
  createdAt        DateTime @default(now())
  
  organizationId   String
  organization     Organization @relation(fields: [organizationId], references: [id])
  waivers          Waiver[]
}

// Extend existing Waiver model
model Waiver {
  // ... existing fields ...
  
  userId     String?
  user       User?   @relation(fields: [userId], references: [id])
  
  eventId    String
  event      Event   @relation(fields: [eventId], references: [id])
}
```

---

## 🚀 Build Timeline

### Week 1: Foundation
- **Day 1-2:** Set up NextAuth.js
  - Google OAuth provider
  - User model in database
  - Sign in/sign out UI
- **Day 3-4:** User profile page
  - Basic info display
  - "My Events" list
  - Total hours counter
- **Day 5:** Organization model + "Create Org" flow

### Week 2: Multi-Org Events
- **Day 6-7:** Organization dashboard
  - List org's events
  - Create event form
  - Event management
- **Day 8-9:** Link existing waiver system to orgs/events
  - Update waiver form to auto-fill from user profile
  - Connect waivers to events
- **Day 10:** Polish + bug fixes

### Week 3: Polish & Launch
- **Day 11-12:** Public pages
  - Org landing pages
  - Event detail pages
  - Navigation/breadcrumbs
- **Day 13-14:** Testing
  - Test with Iron County Trail Club
  - Test with second org
- **Day 15:** Deploy to volntir.com
  - Point domain
  - Update DNS
  - Monitor for issues

---

## 🎨 Pages Needed

### Public Pages (No Login)
1. **Landing** - `volntir.com` (from wireframes)
2. **Org Page** - `volntir.com/org/[slug]`
3. **Event Page** - `volntir.com/org/[slug]/events/[id]`
4. **Waiver Form** - `volntir.com/org/[slug]/events/[id]/register`

### Authenticated Pages
5. **User Dashboard** - `volntir.com/dashboard`
6. **User Profile** - `volntir.com/profile`
7. **Create Org** - `volntir.com/create-org`

### Org Admin Pages
8. **Org Dashboard** - `volntir.com/org/[slug]/admin`
9. **Create Event** - `volntir.com/org/[slug]/admin/events/new`
10. **Event Admin** - `volntir.com/org/[slug]/admin/events/[id]`

**Total: 10 pages. That's it.**

---

## 💻 Tech Stack (Keep It Simple)

**Already Decided:**
- Next.js 16 (App Router)
- Prisma + PostgreSQL
- Tailwind CSS
- Vercel (hosting)

**Add:**
- NextAuth.js v5 (authentication)
- Google OAuth (primary login)

**That's it. No fancy stuff.**

---

## 🎯 Success Metrics

### Launch Goals (First 30 Days)
- [ ] 2 organizations using platform
- [ ] 5 events created
- [ ] 50 users signed up
- [ ] 100 waivers signed
- [ ] 300 volunteer hours logged

### Validation Metrics
- [ ] Users return for second event (retention)
- [ ] Orgs create second event (product-market fit)
- [ ] Zero critical bugs reported
- [ ] Average load time <2 seconds

If you hit these numbers, THEN consider adding Phase 2 features.

---

## 📦 Deployment Checklist

### Before Launch
- [ ] Google OAuth app configured
- [ ] Database backed up
- [ ] volntir.com DNS pointed to Vercel
- [ ] Environment variables set
- [ ] Stripe test mode → live mode (if handling payments)
- [ ] Terms of Service + Privacy Policy pages
- [ ] Contact/Support email set up

### Launch Day
- [ ] Deploy to production
- [ ] Test end-to-end flow (signup → create org → create event → register)
- [ ] Send invite to Iron County Trail Club
- [ ] Send invite to second org
- [ ] Monitor error logs

### Post-Launch (Week 1)
- [ ] Gather feedback from first 10 users
- [ ] Fix any critical bugs
- [ ] Add requested features to backlog
- [ ] Decide on Phase 2 priorities

---

## 💡 Phase 2 Candidates (After MVP)

**Only add these after shipping MVP and getting feedback:**

1. **Hour certificates** ($5 download) - If users ask for it
2. **Event search** - If orgs complain about discoverability
3. **SMS notifications** - If email isn't enough
4. **Social features** (friends, feed) - If users want community
5. **Donations** - If orgs ask for fundraising
6. **Mobile app** - If mobile web isn't enough

**Rule:** Don't build until users explicitly request it.

---

## ⚠️ Common Pitfalls to Avoid

1. **Feature creep** - "Just one more thing" kills momentum
2. **Perfectionism** - Ship 80% solution, iterate later
3. **Analysis paralysis** - Stop planning, start coding
4. **Solving future problems** - Build for today's users, not imaginary ones
5. **Ignoring feedback** - Real users > your assumptions

---

## 🎯 The Build Mantra

**Every day, ask:**
> "Does this help me ship in 2-3 weeks?"

If no → cut it.

**Every feature request:**
> "Do I need this to launch, or can I add it later?"

If later → backlog it.

**Every complexity:**
> "Is there a simpler way?"

If yes → do the simpler thing.

---

## 📞 Support Plan (Post-Launch)

### User Support
- Email: support@volntir.com (forward to your email)
- Response time: <24 hours
- FAQs page with common questions

### Org Support
- Onboarding call (15 min) for first 10 orgs
- Help them create first event
- Get feedback on pain points

### Bug Reports
- GitHub Issues (private repo)
- Or simple Google Form
- Prioritize: crashes > data loss > UX issues > nice-to-haves

---

## ✅ Launch Checklist

**Code Complete:**
- [ ] All 10 pages built
- [ ] User auth working
- [ ] Multi-org working
- [ ] Waiver flow working
- [ ] Check-in working
- [ ] CSV export working

**Tested:**
- [ ] Signup flow (Google + email/password)
- [ ] Create org → Create event → Register
- [ ] Waiver submission (draw + type signature)
- [ ] Check-in at event
- [ ] Admin dashboard
- [ ] Mobile responsive

**Ready to Ship:**
- [ ] Domain pointed (volntir.com)
- [ ] SSL certificate active
- [ ] Database backups enabled
- [ ] Error monitoring (Sentry or similar)
- [ ] Analytics (Plausible or simple)

**Launch Day:**
- [ ] Deploy to production
- [ ] Smoke test all flows
- [ ] Invite Iron County Trail Club
- [ ] Invite second org
- [ ] Announce on social media (optional)

---

## 🎉 After Launch

### Week 1
- Monitor for bugs
- Respond to support emails
- Check analytics (signup rate, event creation rate)

### Week 2-4
- Gather feedback from orgs
- Interview 5-10 users
- Decide Phase 2 priorities

### Month 2
- Ship highest-impact Phase 2 feature
- Onboard 3-5 more orgs
- Iterate based on usage

---

**Remember:** You already built 80% of this. Don't overthink it. Ship it. Learn. Iterate.

---

**Last Updated:** March 7, 2026  
**Status:** Ready to build ✅  
**Timeline:** 2-3 weeks  
**Complexity:** KISS 🎯
