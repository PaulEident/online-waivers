# Event Management Platform - Business Plan

## 🎯 Vision

**Build the social network for volunteers** - where people discover events, track their impact, connect with fellow volunteers, and organizations find engaged communities.

Not just a signup tool. A platform where volunteering becomes part of your identity.

### The Big Idea

**For Users:** LinkedIn + Strava for volunteering
- One profile, all your volunteer history
- Connect with friends, see where they're volunteering
- Share accomplishments, inspire others
- Discover new causes and events
- Build your volunteer resume

**For Organizations:** The place volunteers already are
- Post events where people are actively looking
- Find engaged volunteers with verified history
- Accept donations alongside event signups
- Handle waivers seamlessly
- Build community around your cause

**Network Effects:**
- More users → more orgs join (volunteers already there)
- More orgs → more events → more user engagement
- User feeds promote events organically (viral loop)
- Friends invite friends to volunteer together

## 🎭 User-Centric Architecture

### Three-Sided Platform

**Personal Users (Volunteers)**
- One account across all organizations
- Dashboard: upcoming events, volunteer history
- **Social profile:** Share accomplishments, volunteer hours
- **Friends:** Connect with other volunteers
- **Activity feed:** See where friends are volunteering
- **Bragging rights:** Share milestones to social media
- Digital waiver wallet
- Payment history and receipts
- "Become an organizer" option

**Organization Owners**
- Any user can create/own an organization
- Post events (paid/free/volunteer shifts)
- **Accept donations** (one-time + recurring)
- Manage volunteers and waivers
- View analytics and reports
- Tap into engaged volunteer network

**The Platform (Us)**
- Connect volunteers with causes
- Make volunteering social and shareable
- Verified volunteer hours (resume-worthy)
- Data insights for nonprofits

### Network Effects (The Growth Engine)

**Traditional event tools:** Zero network effects (each org is isolated)

**Our platform:** Compound network effects

1. **Direct network effects** (more users = more value for users)
   - More friends on platform = more activity in feed
   - See where friends are volunteering = discover new events
   - Social pressure to volunteer (positive!)
   
2. **Cross-side network effects** (users attract orgs, orgs attract users)
   - More volunteers → orgs join to access them
   - More orgs → more events → more users join
   
3. **Data network effects** (more usage = better product)
   - Learn which events resonate
   - Better volunteer-org matching
   - Smarter recommendations

4. **Viral growth loops**
   - User shares achievement → friend sees → friend joins
   - Org posts event → reaches followers + friends-of-attendees
   - Annual recap shared on social media → brand awareness

**Why this matters:** Once you reach critical mass (1,000-2,000 active users in a region), new orgs *must* join you because that's where the volunteers are. Classic platform dynamics.

### User Journey Examples

**1. Jane (New Volunteer)**
- Signs up for Iron County Trail Club's snowshoe event
- Creates account (Google SSO), fills out profile
- Completes event → 3 volunteer hours logged
- Posts to Instagram: "Just completed my first trail event! 🌲"
- Gets invited to spring trail work via platform notification
- Sees her friend Tom volunteering at Ski Brule → signs up too
- Discovers similar trail clubs in her feed
- After 10 events: Earns "Trail Advocate" badge, shares on LinkedIn
- Eventually creates her own running club on the platform

**2. Tom (Active Volunteer)**
- Has account, already volunteered at 15 events
- Opens app → sees Jane signed up for snowshoe event → joins her
- Shares his 50-hour milestone: "Proud to hit 50 volunteer hours this year!"
- Friends comment and like (keeps him engaged)
- Discovers new causes through friend activity
- Follows Iron County Trail Club → notified of new events
- Uses volunteer hour export for college applications

**3. Paul (Organization Owner)**
- Creates Iron County Trail Club organization
- Posts snowshoe event → reaches existing members + discovers new volunteers from platform
- Jane and Tom sign up → sees their volunteer history (verified)
- Accepts donations for trail maintenance
- Shares event success: "30 volunteers showed up, 5 miles of trail cleared!"
- Users reshare → viral reach
- Also volunteers at Ski Brule events with the same account

---

## 📊 Market Analysis

### Current Competitors
- **SignUpGenius**: $10-50/month, clunky UX, no built-in waivers
- **Signup.com**: Similar pricing, better for enterprise
- **Eventbrite**: Transaction fees, not volunteer-focused
- **Google Forms + Sheets**: Free but manual, no payments

### Our Differentiation (Why This Wins)

**Competitors (SignUpGenius, Signup.com) are tools. We're a verified volunteer marketplace.**

✅ **Social volunteering:** Friends, feeds, sharing (they have none of this)  
✅ **Volunteer identity:** Build your profile, track impact, earn recognition  
✅ **Trust & safety:** Two-way ratings, background checks, verified certifications  
✅ **Volunteer search:** Find opportunities by location, cause, skills needed  
✅ **Built-in waiver signing:** Digital signatures (they require add-ons)  
✅ **Donations integrated:** Accept donations alongside event signups  
✅ **Gamification:** Badges, challenges, annual recaps keep users engaged  
✅ **Network effects:** More users = more events = more engagement (viral loop)  
✅ **Better UX:** Modern, mobile-first, Apple/Google Pay  
✅ **Competitive pricing:** Generous free tier, cheaper paid tiers  
✅ **Cross-org profile:** One account, all your volunteer history  
✅ **Verified credentials:** CPR/BLS certs, background checks, ratings  

### The Moat (Why We're Defensible)

**1. Network Effects (Primary Defense)**
- Users bring orgs (volunteers already there)
- Orgs bring users (post events)
- Users bring friends (social sharing)
- Friends bring more users (viral growth)
- **Once you have 1,000 active users, new orgs will come to you**

**2. Switching Costs**
- Volunteer history is valuable (resume, college apps)
- Social connections live here
- Payment methods saved
- Losing badges/achievements hurts
- **Users won't leave their volunteer identity behind**

**3. Data Moat**
- Verified volunteer hours (competitors don't have this)
- Social graph of volunteers
- Event performance data
- Insights for nonprofits

**4. Community**
- Active users create content (posts, photos, comments)
- User-generated badges and challenges
- Org/volunteer relationships deepen over time

**Why SignUpGenius can't copy this:**
- They're architected as org-centric tools, not user platforms
- Retrofitting social features is expensive
- They'd cannibalize existing revenue model
- We move faster (no legacy code, no bureaucracy)

## 🚀 Development Phases

### Phase 1 - MVP (6-8 weeks)
**Goal:** Core events + basic social foundation

**Features:**
1. **User Accounts & Profiles**
   - Personal profile (name, bio, photo, emergency contact)
   - Public volunteer profile:
     - Total volunteer hours
     - Events attended (with dates)
     - Organizations supported
     - Verified badges (auto-earned milestones)
   - User dashboard:
     - Upcoming events
     - Past attendance history
     - Volunteer hours tracker
     - Waivers signed
   - Save payment methods (optional)
   - One account across all organizations
   
2. **Social Foundation (Simple Start)**
   - **Connect with friends** (follow/add volunteers)
   - **Activity feed** (personal view):
     - "Jane volunteered at Snowshoe Event (3 hours)"
     - "Tom earned '10 Events' badge"
     - Friends' upcoming events
   - **Social sharing buttons:**
     - "Share to Instagram/Facebook/X" after completing event
     - Pre-filled text: "Just volunteered at [Event] with [Org]! [hours] hours contributed 🎉"
   - Profile visibility settings (public/friends/private)
   
3. **Search & Discovery**
   - Search volunteer opportunities by:
     - Location (zip code, city, radius)
     - Cause category (environment, animals, community, etc.)
     - Date/time availability
     - Skills required
   - Filters: in-person/virtual, one-time/recurring, certified-only
   - Map view of nearby events
   
4. **Certifications & Credentials**
   - Upload certificates (CPR, BLS, First Aid, etc.)
   - Expiration date tracking
   - Verification status (pending/verified)
   - Required for certain volunteer roles
   - Badge display on profile ("CPR Certified")
   
5. **Organization Management**
   - Users can create/own organizations
   - Org profile/settings
   - Create/edit/delete events
   - Event dashboard with stats
   - Invite other users as co-admins
   - Filter volunteers by certifications
   
6. **Multi-event management**
   - Event creation wizard
   - Event types: Free, Paid Registration, Volunteer Shifts
   - **Certification requirements** (mark event as "CPR required")
   - Public event pages (shareable links)
   - Registration management
   - Check-in system (already have this)
   
7. **RSVP & Volunteer Slots**
   - Define time slots/shifts for events
   - Role assignments (e.g., "Setup Crew", "Registration Table")
   - Signup limits per slot
   - Waitlist functionality
   - Users can see their assigned shifts
   
8. **Payment Integration (Stripe)**
   - Event registration fees
   - **One-time donations** (donate to org directly)
   - Automatic receipts
   - User payment history
   
9. **Email Notifications**
   - Confirmation emails
   - Reminder emails (24h before event)
   - Admin notifications for new signups
   - Friend activity digest (weekly, opt-in)
   - Certification expiration reminders
   - Mailchimp integration (already have this)

**Tech Additions (Phase 1):**
- **Auth:** NextAuth.js v5 with Google/Apple SSO + email/password
- **2FA:** Twilio SMS verification
- **Payments:** Stripe SDK with Apple Pay, Google Pay, Link
- **Social Infrastructure:**
  - Activity feed system (Redis or database-backed)
  - Friend connections (graph relationships)
  - Real-time updates (WebSockets or Server-Sent Events)
  - Image uploads (profile photos, event images)
  - Social sharing API (Open Graph meta tags)
- **Search:**
  - Algolia or Typesense for fast volunteer opportunity search
  - Geospatial queries (location-based search)
  - Filters (date, certification requirements, etc.)
- **File Storage:**
  - Vercel Blob or AWS S3 (certificates, signatures, photos)
  - PDF generation for verification certificates
- Multi-event database schema
- User dashboard UI
- Organization creation/management flow
- Email service (Resend)
- Event templates
- Public event pages
- Magic link password reset
- Badge/achievement system

**Tech Additions (Phase 2):**
- **Background Checks:**
  - Checkr API integration (or Sterling)
  - Webhook handlers for results
  - Secure storage of verification status
- **Ratings System:**
  - Post-event rating prompts
  - Review moderation queue
  - Aggregate scoring logic
- **Certificate Verification:**
  - Admin dashboard for manual review
  - OCR for automatic extraction (Phase 3)
  - Expiration tracking + email reminders

**Hosting:**
- Vercel (zero-config, excellent for Next.js)
- Vercel Postgres (starter) or Neon (scalable)
- Vercel Blob Storage (for signatures + profile photos + certificates)
- Redis for activity feed caching (required Phase 2)

**Target Customer:** Iron County Trail Club (your org) + the requesting org

---

### Phase 2 - Beta (8-10 weeks)
**Goal:** Trust & safety, gamification, advanced fundraising

**Features:**
1. **Trust & Safety (Critical for Marketplace)**
   - **Two-way ratings & reviews:**
     - Volunteers rate organizations (1-5 stars + comment)
     - Organizations rate volunteers (private, 1-5 stars)
     - Only shown after event completion
     - Builds trust, accountability
   - **Background check integration:**
     - Partner with Checkr, Sterling, or similar
     - One-click request from user profile
     - Orgs can require background checks for certain events
     - Status badge: "Background Check: Verified"
     - Cost: ~$30-50 per check (user or org pays)
     - Results stored securely, shared only with orgs
   - **Certificate verification:**
     - Manual review of uploaded CPR/BLS/First Aid certs
     - Verification badge on profile
     - Expiration tracking + reminders
   - **Reporting & moderation:**
     - Report inappropriate behavior
     - Block users
     - Admin review queue
   
2. **Enhanced Social Features**
   - **Comments & likes** on volunteer activities
   - **Event invitations:** "Invite friends to this event"
   - **Groups/Teams:** Form volunteer crews that do events together
   - **Leaderboards:** Most hours this month (opt-in)
   - **Challenges:** "Complete 5 trail events this summer"
   - **Public discovery feed:** Explore events by location/cause
   
3. **Gamification & Bragging Rights**
   - **Achievement badges:**
     - Milestones: 10 hours, 50 hours, 100 hours
     - Streaks: 5 events in a row, monthly volunteer
     - Categories: "Trail Warrior", "Event Organizer", "Early Bird"
     - Certifications: "CPR Certified", "Background Checked"
   - **Impact stats:** "You've helped plant 47 trees! 🌲"
   - **Annual recap:** "Your Year in Volunteering" (Spotify Wrapped style)
   - **Share to social media** (auto-generated graphics)
   
4. **Donations & Fundraising**
   - **Recurring donations** (monthly supporters)
   - **Fundraising campaigns** (progress bars, goal tracking)
   - **Peer-to-peer fundraising:** Users create personal fundraising pages
   - **Donation matching** (corporate matching gifts)
   - **Donor recognition** (public thank-yous, donor wall)
   
5. **Multi-tenancy**
   - Organization accounts with subdomain or path-based routing
   - Org admin roles
   - Custom branding (logo, colors)
   
6. **Volunteer Discovery (Advanced)**
   - Orgs can search for verified volunteers (with user permission)
   - Filter by: ratings, certifications, background check status
   - Invite volunteers from other events
   - Send targeted messages to past volunteers
   - View volunteer ratings/reviews
   
7. **Custom Form Builder**
   - Drag-and-drop field creation
   - Conditional logic
   - Save form templates
   
8. **Reporting & Exports**
   - CSV exports of attendees
   - Attendance reports
   - Payment/donation reconciliation
   - Check-in analytics
   - Volunteer hour verification/certificates
   - Impact reports for donors
   - Volunteer ratings dashboard

9. **Calendar Integration**
   - iCal export
   - Google Calendar sync

**Tech Additions:**
- Row-level security (RLS) for multi-tenancy
- Form builder UI component
- Export generation service
- iCal generation

**Target:** 5-10 beta customers (nonprofits, trail clubs, ski patrols)

---

### Phase 3 - Scale (3-4 months)
**Goal:** Public launch, 50+ organizations

**Features:**
1. **SMS Notifications** (Twilio - event reminders, shift confirmations)
2. **Recurring Events** (weekly volunteer shifts, seasonal programs)
3. **Mobile App/PWA**
4. **Team/Group Signups** (sign up family, friend group at once)
5. **Automated Reminders** (SMS + Email sequences)
6. **White-label** (custom domain per org)
7. **API** (for integrations with other tools)

**Note:** SMS 2FA for account verification is in Phase 1, SMS *notifications* for events are Phase 3.

---

## 💰 Revenue Model - Freemium Pricing

### Core Philosophy
**Free tier is genuinely useful** - not a trial. Get people hooked on the platform, upgrade when they need more.

### Competitive Landscape
| Platform | Free Tier | Paid Start | Key Limits |
|----------|-----------|------------|------------|
| **SignUpGenius** | Limited (ads, branding) | $12/mo | 5 signups, basic features |
| **Signup.com** | 14-day trial only | $10/mo | No free tier |
| **Eventbrite** | Free (+ fees) | Pay per event | 2.9% + $0.79/ticket |
| **Google Forms** | Free | N/A | Manual, no payments |

### Our Pricing Tiers

---

## 🆓 **FREE (Forever)**
**Target:** Individuals, small orgs testing the platform, occasional events

**Includes:**
✅ Unlimited user accounts  
✅ Create unlimited events (free, paid, volunteer)  
✅ Unlimited attendees/registrations  
✅ **Accept donations** (one-time, no platform fee!)  
✅ Basic waiver signing  
✅ Email notifications (confirmations, reminders)  
✅ Mobile-friendly event pages  
✅ **Volunteer hour tracking** (with verified badges)  
✅ **Social features:**  
  - Public volunteer profile  
  - Connect with friends  
  - Activity feed (see friends' volunteering)  
  - Share accomplishments to social media  
✅ Check-in system  
✅ Payment processing (Apple Pay, Google Pay, cards)  
✅ 1 admin per organization  

**Fees:**
💵 **Paid tickets:** 5% platform fee + Stripe fees (2.9% + $0.30) — **buyer pays**  
  - Example: $20 ticket → buyer pays $21.90, org receives $20.00  
💵 **Donations:** No platform fee (only Stripe 2.9% + $0.30)  
💵 **Free events:** No fees

**Limitations:**
⚠️ "Powered by [Platform Name]" branding  
⚠️ 5% platform fee on paid tickets (buyer-paid)  
⚠️ No SMS notifications  
⚠️ No custom org branding  
⚠️ No recurring donations  
⚠️ Basic reporting only (CSV export)  
⚠️ Cannot require background checks for events (can suggest, not enforce)  
⚠️ Community support (email, no phone)

**Why orgs love this:** Truly free to use — no monthly fees, no risk. Only pay when you're making money (and buyers pay the fee, not you). Perfect for small events or trying the platform.

**Why volunteers love this:** All the good stuff is free! Search opportunities, track hours, upload certifications, build your profile, connect with friends.

**Paid Add-Ons for Volunteers:**
💵 **Official Volunteer Hour Report:** $5 per download (PDF certificate for college, graduation, corporate programs)

---

## 📱 **STARTER - $15/month** ($12/mo annually)
**Target:** Active clubs, recurring paid events, 30+ tickets/month

**Everything in Free, plus:**
✅ **0% platform fee on paid tickets** (only Stripe 2.9% + $0.30) 💰  
✅ **10 volunteer verification checks/month** (verify volunteer history via auth code)  
✅ **Enforce background check requirements** (mark events as "Background Check Required")  
✅ **SMS notifications** (100 messages/month included)  
✅ **Remove platform branding**  
✅ **2 admin users**  
✅ Advanced reporting (attendance trends, no-show rates, volunteer ratings)  
✅ Custom event URL slug  
✅ Automated reminder sequences  
✅ Priority email support

**Fees:**
💵 **All transactions:** No platform fee (only Stripe 2.9% + $0.30)

**Additional:**
💵 **Extra SMS:** $0.02/message after 100  
💵 **Extra verification checks:** $2-3 per check after 10/month

**ROI Calculator:**
- Sell 30 tickets/mo × $25 = $750 revenue
- Free tier: Buyers pay 5% ($37.50 in fees)
- Starter: **Save $37.50 - $15 = $22.50/mo** ✅
- **Break-even at ~30 tickets/month**

**Comparison:**
- SignUpGenius Basic: $12/mo (only 5 signups, we give unlimited)
- Signup.com: $10/mo (fewer features + they charge transaction fees)

---

## 🎨 **PRO - $39/month** ($32/mo annually)
**Target:** Established orgs, multiple events, recurring donors

**Everything in Starter, plus:**
✅ **0% platform fee** (same as Starter) 💰  
✅ **50 volunteer verification checks/month** (verify volunteer history)  
✅ **Advanced volunteer search & discovery:**  
  - Search verified volunteers by certifications, ratings, location  
  - Invite past volunteers to new events  
  - Send targeted messages to volunteer segments  
✅ **Recurring donations** (monthly giving programs)  
✅ **SMS notifications** (500 messages/month included)  
✅ **Custom branding** (logo, colors, fonts)  
✅ **Unlimited admin users**  
✅ Advanced analytics dashboard (ratings, retention, top volunteers)  
✅ Custom form builder (beyond waivers)  
✅ Calendar integrations (Google, iCal)  
✅ Volunteer badges & certifications  
✅ Export volunteer hour certificates  
✅ Custom email templates  
✅ Priority support (phone + email)  
✅ Custom subdomain (yourorg.platform.com)

**Fees:**
💵 **All transactions:** No platform fee (only Stripe 2.9% + $0.30)

**Additional:**
💵 **Extra SMS:** $0.015/message after 500  
💵 **Extra verification checks:** $2 per check after 50/month  
💵 **Unlimited verification add-on:** $15/mo

**Who needs this:**
- Orgs with 50+ tickets/month (save even more on fees)
- Professional appearance (custom branding)
- Recurring donor programs
- Multiple staff managing events

**Comparison:**
- SignUpGenius Pro: $50/mo (fewer features)
- Signup.com Business: $40/mo (no social features, no recurring donations)

---

## 🏢 **ENTERPRISE - Custom Pricing** (Starting $199/month)
**Target:** Large orgs, multi-chapter, franchise operations

**Everything in Pro, plus:**
✅ **Unlimited SMS** (or custom volume pricing)  
✅ **Bulk background check sponsorship** (org pays for volunteer checks at discounted rate)  
✅ **White-label** (custom domain: events.yourorg.com)  
✅ Multi-organization management (parent/child accounts)  
✅ API access for integrations  
✅ SSO (SAML, Active Directory)  
✅ Custom contract terms  
✅ Dedicated account manager  
✅ Custom development (paid)  
✅ Self-hosted option available  
✅ SLA guarantee (99.9% uptime)  
✅ Priority verification (certificates reviewed within 24hrs)

**Target customers:** National nonprofits, ski patrol regions, park systems, volunteer fire departments

---

### Add-Ons (All Tiers)

**Extra SMS Messages:**
- $10 for 500 messages (~$0.02 each)
- $50 for 3,000 messages (~$0.017 each)

**Premium Support:**
- $50/mo: Phone support, same-day response

**Custom Development:**
- Starting at $150/hr for custom features/integrations

---

## 💡 Strategic Notes

**Why Free Tier is Generous:**
1. **Network effects** - More free users = more cross-org discovery
2. **Land grab** - Capture market share from SignUpGenius
3. **Upgrade path** - Once they're managing 5+ events, SMS becomes necessary
4. **Word of mouth** - Free users evangelize

**Upgrade Triggers:**
1. Free → Starter: "Remove branding" + SMS notifications
2. Starter → Pro: Need custom branding + multiple admins + better analytics
3. Pro → Enterprise: Multi-chapter orgs, need white-label

**Revenue Math:**
- Target 80/15/4/1 split (80% free, 15% starter, 4% pro, 1% enterprise)
- 100 orgs = 15 Starter ($225) + 4 Pro ($156) + 1 Enterprise ($199) = **$580/mo**
- 500 orgs = **$2,900/mo**
- 1000 orgs = **$5,800/mo**

**Break-even (Phase 2):**
- ~10 Starter orgs OR 5 Pro orgs = $150-195/mo (covers $190 hosting)

---

### Additional Revenue Streams (Phase 2+) 💰

## 📜 **Verified Volunteer Hour Reports** (High Margin!)

**The Opportunity:**
- High schools require volunteer hours for graduation (40-100 hours typical)
- Colleges ask for verified volunteer work in applications
- Corporate volunteer programs offer bonuses/rewards (PTO, donations)
- Court-ordered community service needs verification
- Scholarship applications require proof

**Current Solution:** Paper forms, manual signatures, easy to fake. **Our platform provides tamper-proof verification.**

### For Volunteers: Official Report ($5 per download)

**What they get:**
- Professional PDF certificate with:
  - Total volunteer hours (lifetime or date range)
  - List of organizations + events
  - Dates, hours per event
  - Platform verification seal + unique certificate ID
  - QR code for instant verification
- Branded, professional document (suitable for college apps)
- Unlimited free views, pay $5 only to download PDF

**Use Cases:**
- High school graduation requirement
- College admissions essays
- Scholarship applications
- Resume/LinkedIn
- Corporate volunteer programs
- Court-ordered community service

**Revenue Projection:**
- 5,000 users → 20% download report annually = 1,000 downloads
- $5 per download = **$5,000/year** ($417/mo)
- At 50,000 users: **$50,000/year** ($4,167/mo)

**Why volunteers pay:** It's worth way more than $5 to get into college, graduate high school, or get a corporate bonus. No brainer purchase.

---

### For Organizations: Volunteer Verification Service 🔍

**The Need:**
- Orgs want to know volunteer history before accepting them
- "Has this person actually volunteered before?"
- "Are they reliable? Do they show up?"
- "What skills/certifications do they have?"

**How It Works:**
1. Volunteer gives org their email + 6-digit auth code (generated on-demand in app)
2. Org enters email + code on platform
3. Platform shows volunteer's verified history (if volunteer allowed):
   - Total hours (all-time)
   - Organizations volunteered with
   - Average rating from orgs (if opted in)
   - Certifications & background check status
   - No-show rate, reliability score
4. Report valid for 30 days

**Pricing Options:**

**Pay-per-check:**
- Free tier: 0 checks/month
- Starter: 10 checks/month included
- Pro: 50 checks/month included
- Additional checks: $2-3 each

**Unlimited Add-On:**
- $15/mo add-on (any tier)
- Unlimited volunteer history checks
- Good for high-volume orgs

**Privacy Controls:**
- Volunteers control what's shared (public/orgs only/private)
- Can disable verification entirely (opt-out)
- Can revoke specific org's access
- Audit log of who checked their profile

**Revenue Projection:**
- 500 orgs, 20% use verification service = 100 orgs
- Average 5 checks/month × $3 = $15/mo per org
- 100 orgs × $15 = **$1,500/mo**
- At 5,000 orgs: **$15,000/mo**

---

### Background Checks (Phase 2+)

**Model:**
- Partner with Checkr (volume pricing: $25-30 per check wholesale)
- Charge users $35-40 (or org-sponsored)
- Platform keeps $5-10 per check

**Projections:**
- At scale (5,000 orgs, 50,000 users): **$25,000/year** ($2,083/mo)

---

## 💰 Combined Revenue Potential (50,000 users, 5,000 orgs)

| Revenue Stream | Monthly | Annual | % of Total |
|----------------|---------|--------|------------|
| Subscriptions | $29,000 | $348,000 | 39% |
| Transaction fees (tickets) | $25,000 | $300,000 | 33% |
| **Volunteer hour reports** | **$4,167** | **$50,000** | **6%** |
| **Org verification checks** | **$15,000** | **$180,000** | **20%** |
| Background checks | $2,083 | $25,000 | 3% |
| **Total** | **$75,250** | **$903,000** | **100%** |

**Verification services (hour reports + org checks) = $19,167/mo (26% of revenue!)**

**This is huge:** Verification revenue is nearly as much as subscription revenue, with 90%+ margins.

---

## 🔐 Verification Infrastructure (Phase 2)

**Requirements:**
- Unique certificate IDs (UUID)
- QR code generation (links to verification page)
- PDF generation with watermarks
- Auth code system (6-digit, time-limited)
- Audit trail (who checked what, when)
- Privacy controls (user consent management)

**Security:**
- Auth codes expire after use or 7 days
- Rate limiting on verification checks (prevent scraping)
- Fraud detection (too many lookups from one IP)
- Revocation system (if volunteer requests)

**Tech Stack:**
- PDF generation: react-pdf or Puppeteer
- QR codes: qrcode npm package
- Auth codes: crypto.randomInt(100000, 999999)
- Storage: Postgres + S3 for PDFs
- Caching: Redis for auth code validation

---

### Payment Processing Fees - Hybrid Model ✨

**The "Strava Model" - Free for Orgs, Revenue from Tickets**

## Competitive Analysis

| Platform | Who Pays | Fee Structure |
|----------|----------|---------------|
| **Eventbrite** | Buyer | 3.7% + $1.79 per ticket |
| **Ticketmaster** | Buyer | 10-15% + $4-6 service fee |
| **SignUpGenius** | Org | $12-50/mo subscription |
| **Stripe** (direct) | Org | 2.9% + $0.30 |

---

## Our Model: Free with Fees vs Subscription (Buyer's Choice)

### 🆓 **FREE Tier: Pay-per-ticket**
**Perfect for:** Occasional events, small orgs, "try before you buy"

**Paid Event Tickets:**
- **Buyer pays:** 5% platform fee + Stripe fees
- **Total cost:** ~8% + $0.30 per ticket
- **Example:** $20 ticket → $21.90 to buyer, org receives $20.00

**Donations:**
- **No platform fee** on donations (build goodwill)
- **Only Stripe fees:** 2.9% + $0.30
- **Example:** $50 donation → org receives $48.05

**Why buyers accept this:**
- Industry standard (Eventbrite, Ticketmaster all charge buyers)
- Transparent ("$20 + $1.90 service fee")
- Small amounts, worth the convenience
- They're supporting a cause, not shopping on Amazon

**Why orgs love this:**
- **Truly free** - no monthly fees, no risk
- They receive full ticket price
- Can run 1 event/year without paying $12/mo × 12

---

### 💎 **PAID Tiers: Zero Transaction Fees**

**Starter ($15/mo), Pro ($39/mo), Enterprise ($199+/mo):**
- **0% platform fee** on all transactions
- **Only Stripe fees:** 2.9% + $0.30
- **Example:** $20 ticket → buyer pays $20, org receives $19.12

**Clear upgrade incentive:**
- Org sells 50 tickets × $20 = $1,000 revenue
- **Free tier:** Buyers pay $95 in fees → org keeps $1,000
- **Paid tier ($15/mo):** No platform fee, org saves $95 - $15 = **$80/mo**
- Break-even at ~30 tickets/month

**The pitch:** "Run more than 2-3 paid events per month? Upgrade and save on fees."

---

## 🎯 **Recommended Structure (Best of Both Worlds)**

### Free Tier Fees (Buyer-Paid)
✅ **Paid Event Tickets:** 5% platform fee + Stripe (2.9% + $0.30)  
✅ **Donations:** 0% platform fee (only Stripe fees)  
✅ **Free Events:** No fees (builds engagement)

### Paid Tier Fees (Zero Platform Fee)
✅ **All transactions:** 0% platform fee (only Stripe 2.9% + $0.30)  
✅ **Savings calculator:** "Based on your volume, you'd save $XX/mo"

---

## 💰 Revenue Math with Hybrid Model

**Assumptions:**
- 80% of orgs stay on Free tier (with fees)
- 15% upgrade to Starter
- 4% upgrade to Pro
- 1% upgrade to Enterprise

**100 Organizations:**
- **Free tier (80 orgs):**
  - Average 10 paid tickets/mo × $25 = $250/mo per org
  - 5% platform fee × $250 × 80 orgs = **$1,000/mo transaction revenue**
- **Paid tier (20 orgs):**
  - 15 Starter ($15) + 4 Pro ($39) + 1 Enterprise ($199) = **$580/mo subscription revenue**
- **Total:** **$1,580/mo** (vs $580 subscription-only)

**500 Organizations:**
- Free tier transaction revenue: **$5,000/mo**
- Paid tier subscription revenue: **$2,900/mo**
- **Total: $7,900/mo** (vs $2,900 subscription-only)

**This is 2.7x more revenue with the same user base!**

---

## 🤔 Strategic Questions

**Should we charge fees on free events?**
- **No** - free events build engagement, network effects
- Only charge when money changes hands

**Should we charge fees on donations?**
- **No** - builds goodwill, encourages giving
- Orgs feel good about it
- Volume of donations likely lower than ticket sales anyway
- **Alternative:** Free tier = 2% donation fee, Paid tier = 0% (incentive to upgrade)

**What about volunteer shifts (no money)?**
- **No fees ever** - volunteer shifts are core to the mission
- This is how we're different from Eventbrite

**Can orgs pass fees to buyers on paid tiers too?**
- Yes, give them the choice
- "Absorb fees" or "Pass to attendees"
- Most will absorb (looks better)

---

## 📊 Comparison: Subscription-Only vs Hybrid

### Scenario: 500 orgs, 5,000 users

**Subscription-Only Model:**
- Revenue: $2,900/mo
- All free tier = $0 revenue
- Need 20% upgrade rate to break even

**Hybrid Model (Recommended):**
- Revenue: $7,900/mo
- Free tier generates $5,000/mo
- Need only 8% upgrade rate to break even
- **More sustainable, faster growth**

---

## ✅ Final Recommendation

**YES - charge buyer-paid 5% fee on free tier paid tickets.**

**Why this works:**
1. **Truly free for orgs** (no barrier to entry)
2. **Revenue from day 1** (don't need paid conversions)
3. **Clear upgrade path** (save on fees = ROI)
4. **Industry standard** (buyers expect it)
5. **Scales with success** (more tickets = more revenue)
6. **Aligns incentives** (we win when orgs succeed)

**Pricing Summary:**
- **Free:** 5% platform fee on paid tickets (buyer pays), 0% on donations
- **Starter ($15/mo):** 0% platform fee on everything
- **Pro ($39/mo):** 0% platform fee on everything
- **Enterprise ($199+/mo):** 0% platform fee on everything

---

## 🛡️ Trust & Safety (Verified Volunteer Marketplace)

### Two-Way Ratings System

**Volunteers Rate Organizations (Public)**
- 1-5 stars + written review
- Prompts: "How was the organization?", "Would you volunteer again?"
- Builds org reputation
- Helps volunteers choose good orgs
- Public on org profile page

**Organizations Rate Volunteers (Private)**
- 1-5 stars + private notes
- Prompts: "Reliable?", "Followed instructions?", "Would invite back?"
- Only visible to the org (not public or shared)
- Helps orgs make informed decisions
- Aggregated score shown to user privately

**Rating Rules:**
- Only after event completion
- Mutual (both must rate, or neither can see)
- Cannot edit after 30 days
- Moderation for abuse

**Why This Works:**
- Builds accountability on both sides
- Volunteers have leverage (public org reviews)
- Orgs can track reliable volunteers (private notes)
- Similar to Uber/Airbnb model

---

### Background Checks (Integrated)

**Partner Integration:**
- Checkr (most popular, $30-50 per check)
- Sterling Volunteers (nonprofit-focused)
- GoodHire (budget option)

**User Flow:**
1. User clicks "Get Background Check" on profile
2. Redirected to partner site (Checkr API)
3. Completes identity verification
4. Pays $30-50 (or org can sponsor)
5. Results sent back to platform (pass/fail, no details)
6. Badge added to profile: "Background Check: Verified (Exp: 2027)"

**Organization Controls:**
- Mark events as "Background Check Required"
- Only users with valid checks can register
- See verification status in volunteer list
- Can request volunteers get checked

**Privacy & Compliance:**
- Store only pass/fail status + expiration
- No detailed criminal records stored
- FCRA compliant (partner handles this)
- User controls who sees status (public/orgs only)

**Revenue Opportunity:**
- White-label pricing: Platform takes $5-10 per check
- Or: free for Pro/Enterprise tier orgs (perk)

---

### Certifications (Uploaded & Verified)

**Supported Certifications:**
- CPR (Cardiopulmonary Resuscitation)
- BLS (Basic Life Support)
- First Aid
- Wilderness First Aid (WFA)
- Wilderness First Responder (WFR)
- Lifeguard
- Food Handler
- Custom (org-specific)

**User Upload Flow:**
1. Upload PDF/image of certificate
2. Enter expiration date
3. Platform admin reviews (Phase 2: manual, Phase 3: OCR automation)
4. Status: Pending → Verified
5. Badge added to profile

**Organization Benefits:**
- Require certifications for events (e.g., "CPR required for trail patrol")
- Filter volunteers by certifications
- Export list of certified volunteers
- Automated expiration reminders

**Expiration Tracking:**
- Email reminder 60/30/7 days before expiration
- Badge turns yellow (expiring soon)
- Badge removed when expired
- User prompted to re-upload

---

## 🎨 Platform Capabilities (Four Pillars)

### 1. 📅 **Events**
- Free events (community meetups)
- Paid registrations (5K races, workshops)
- Volunteer shifts (trail work, food bank)
- Hybrid events (paid admission + donate option)
- Recurring events (weekly volunteer opportunities)

### 2. 💰 **Donations**
- One-time donations
- Recurring giving (monthly supporters)
- Fundraising campaigns (with goals)
- Peer-to-peer fundraising
- Event-linked giving (donate while registering)
- Corporate matching

### 3. 👥 **Volunteers**
- **Search & discovery** (find opportunities by location, cause, skills needed)
- Volunteer shift management
- Hour tracking (verified, exportable)
- **Skills & certifications** (upload CPR, BLS, First Aid, etc.)
- **Background checks** (integrated with partner providers)
- **Two-way ratings** (volunteers rate orgs, orgs rate volunteers)
- Availability calendars
- Recognition & badges
- Volunteer discovery (orgs find volunteers)

### 4. 📝 **Waivers**
- Digital signature capture (draw or type)
- Family waivers (one adult, multiple minors)
- Auto-populated from profile
- Stored in user account
- Org-specific waiver templates
- Legal compliance tracking

**All four work together seamlessly:**

*Example: "Sign up for our trail work event (waiver required), donate to our maintenance fund, and volunteer for 4 hours. Your hours will be logged and you'll earn the 'Trail Builder' badge."*

---

## 🏷️ Branding Ideas

**Platform Names:**
- **Volntir** (clear, searchable)
- **GiveTime** (emphasizes the act)
- **Togetherly** (community-focused)
- **Rally** (action-oriented, short)
- **Gather** (simple, memorable)
- **Crew** (team-focused)
- **ImpactCircle** (mission-driven)

**Taglines:**
- "Volunteering, together"
- "Where volunteers connect"
- "Your volunteer story starts here"
- "Turn up. Give back. Make friends."
- "The social network for doing good"

---

**Target Audience:**
- Outdoor recreation clubs (trail clubs, ski patrols, bike clubs, paddle clubs)
- Nonprofits (food banks, animal shelters, community centers, environmental orgs)
- Schools (PTA, booster clubs, student orgs)
- Youth sports leagues
- Faith communities (churches, temples, mosques)
- Community organizations
- Volunteer fire departments
- Parks & recreation departments

---

## 🛠️ Technical Architecture

### Current Stack
- **Frontend:** Next.js 16 (React 19)
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL + Prisma ORM
- **Hosting:** Vercel (Phase 1-2) → AWS/GCP (Phase 3+)
- **Storage:** Local (signatures) → migrate to S3/R2

### Authentication & Security (Critical for User Accounts)
- **Auth Provider:** NextAuth.js v5 (Auth.js)
  - SSO: Google Sign-In (primary)
  - SSO: Apple Sign-In (iOS users)
  - Traditional: Email/password (fallback)
- **2FA:** SMS verification via Twilio
- **Session Management:** JWT tokens, secure httpOnly cookies
- **Password Reset:** Magic links (no password friction)
- **Account Verification:** SMS code on signup

**Why this approach:**
- Reduces password friction (SSO = 1-click signup)
- Apple/Google handle security, MFA on their end
- Traditional login for users without SSO accounts
- SMS 2FA adds security without complexity

### Payment Processing
- **Stripe SDK:** Full integration
  - **Apple Pay** (seamless iOS checkout - 50%+ mobile users)
  - **Google Pay** (seamless Android checkout)
  - **Link** (Stripe's 1-click autofill - saves card info across sites)
  - Credit cards (fallback for desktop)
- **Stripe Connect:** For organization payouts (if needed)
- **Saved Payment Methods:** Securely stored in Stripe (PCI compliant, we never touch card data)
- **Automatic Receipts:** Email + PDF generation

**Why Stripe:**
- Apple Pay/Google Pay support built-in
- Link reduces checkout from 30 seconds to 5 seconds
- Best-in-class fraud detection
- Handles PCI compliance
- Excellent documentation
- Support for subscriptions + one-time payments
- Mobile SDKs if we build native apps later

**User Experience:**
1. First-time user: Sign in with Google → Apple Pay checkout → done in 30 seconds
2. Returning user: Already signed in → Link autofills → 5 seconds

### Eliminating Password Friction (Critical for Conversion)

**Problem:** Users forget passwords, abandon signups, frustrate at checkout.

**Our Solution:**
1. **Prioritize SSO:**
   - "Sign in with Google" as primary CTA (80% of users)
   - "Sign in with Apple" for iOS users (15% of users)
   - Traditional email/password small and secondary (5% of users)

2. **Magic Links for Password Reset:**
   - No "security questions" nonsense
   - Click "Forgot password" → email with one-time link → instant access
   - Link expires in 15 minutes
   
3. **"Remember Me" Default:**
   - Keep users signed in for 30 days
   - Re-prompt for 2FA only on sensitive actions (payment changes)

4. **Email-Based Signup (No Password Required):**
   - Alternative: Email + verification code → create account → no password set
   - User can add password later (optional)
   - Primary identifier: email address

5. **Progressive Profile Completion:**
   - Minimum signup: Email + name only
   - Emergency contact prompted on first waiver
   - Payment info saved after first transaction
   - Don't ask for everything upfront

**Metrics to Track:**
- % signups via SSO vs traditional
- Password reset request rate
- Signup abandonment rate
- Time to first registration

### Other Services
- **Email:** Resend (better DX than SendGrid)
- **SMS:** Twilio (2FA + notifications)
- **File Storage:** AWS S3 or Cloudflare R2
- **Analytics:** Plausible or Posthog (privacy-first)

### Hosting Migration Strategy

**Phase 1-2: Vercel (0-500 users)**
- **Pros:** Zero config, automatic scaling, excellent DX
- **Cost:** ~$20/mo (Hobby) → ~$100/mo (Pro)
- **Database:** Vercel Postgres or Neon
- **Storage:** Vercel Blob
- **Best for:** Rapid iteration, MVP validation

**Phase 3: AWS/GCP (500+ users, $5k+ MRR)**
- **Trigger Points:**
  - Vercel costs exceed $200/mo
  - Need better database control (RDS, Cloud SQL)
  - Custom infrastructure (caching, CDN optimization)
  - Multi-region deployment
- **Migration Path:**
  - Move database first (Neon → AWS RDS)
  - Then app hosting (Vercel → ECS/Fargate or GCP Cloud Run)
  - Keep Vercel for marketing site
- **Cost:** ~$300-500/mo for better margins

**Self-Hosted Option (Enterprise)**
- Docker containers
- Postgres + Redis
- Deploy to any VPS or on-prem
- For privacy-conscious orgs (government, healthcare)

### Database Schema Changes
```
Users (Personal Accounts)
  ├── Profile (name, email, phone, emergency contact, bio, photo)
  ├── Organizations (owner/admin roles)
  ├── Registrations (events attended)
  ├── Volunteer History
  ├── Waivers Signed
  ├── Payment Methods
  ├── Certifications
  │     ├── Type (CPR, BLS, First Aid, etc.)
  │     ├── Expiration Date
  │     ├── Document URL
  │     └── Verification Status
  ├── Background Check
  │     ├── Status (pending/approved/expired)
  │     ├── Date Completed
  │     ├── Provider (Checkr, Sterling, etc.)
  │     └── Report ID
  ├── Ratings Given (to orgs)
  └── Ratings Received (from orgs, private)

Organizations
  ├── Events
  │     ├── TimeSlots/Shifts
  │     ├── CustomFields
  │     ├── Registrations
  │     └── Required Certifications
  ├── Owners/Admins (Users with permissions)
  ├── Branding
  ├── Ratings Given (to volunteers, private)
  └── Ratings Received (from volunteers, public)

Registrations (join table)
  ├── User
  ├── Event
  ├── Status (registered/checked-in/cancelled/completed)
  ├── Payment
  ├── Waiver
  ├── Time Slot/Shift
  └── Post-Event Rating (both directions)

Connections (friendships)
  ├── User A
  ├── User B
  └── Status (pending/accepted)

Activity Feed
  ├── User
  ├── Action Type (volunteered, earned badge, completed challenge)
  ├── Target (event, org, badge)
  └── Timestamp
```

---

## 📈 Go-to-Market Strategy

### Phase 1: Local Validation
1. Deploy for Iron County Trail Club (multiple events)
2. Onboard the requesting organization
3. Get feedback, iterate quickly

### Phase 2: Beta Outreach
**Target Beta Customers:**
- Michigan trail clubs (Upper Peninsula network)
- National Ski Patrol System (NSP) local patrols
- Michigan Trails & Greenways Alliance members
- Local running clubs
- Community event organizers

**Outreach:**
- Personal network
- Facebook groups (outdoor recreation, nonprofit management)
- Reddit (r/nonprofits, r/volunteer)
- Cold emails to organizations currently using SignUpGenius

### Phase 3: Public Launch
- Product Hunt launch
- Content marketing (blog about volunteer management)
- SEO for "free SignUpGenius alternative"
- Partner with outdoor recreation orgs

---

## 🎯 Success Metrics

### Phase 1 (MVP)
- [ ] 2 organizations using it (both on Free tier)
- [ ] 50+ user accounts created
- [ ] 5 successful events managed
- [ ] 100+ registrations processed
- [ ] $0 revenue (prove the concept, validate freemium approach)

### Phase 2 (Beta)
- [ ] 20 organizations onboarded
  - 15 on Free tier (75%)
  - 3 on Starter ($45/mo)
  - 2 on Pro ($78/mo)
- [ ] 500+ user accounts
- [ ] 50 events managed
- [ ] 20% of users attending multiple orgs' events (network effect)
- [ ] **$125 MRR** (break-even)

### Phase 3 (Scale)
- [ ] 100+ organizations
  - 80 on Free (network effects)
  - 15 on Starter ($225/mo)
  - 4 on Pro ($156/mo)
  - 1 on Enterprise ($199/mo)
- [ ] 5,000+ active users
- [ ] 500+ events managed
- [ ] 40% of users in multiple orgs (strong network effect)
- [ ] **$580 MRR** (sustainable)

---

## ⚠️ Risks & Challenges

1. **Competition:** SignUpGenius has massive brand recognition
   - **Mitigation:** Focus on niche (outdoor/recreation), social features they can't copy quickly
   
2. **Cold Start Problem:** Social platforms need critical mass
   - **Mitigation:** Start with dense communities (trail clubs, ski patrols), geographic clusters
   - Generous free tier gets orgs + users quickly
   - Phase 1 focuses on 1-2 communities, prove concept before scaling
   
3. **Payment Processing:** Compliance, fraud, chargebacks
   - **Mitigation:** Use Stripe, let them handle compliance
   
4. **Support Burden:** Small orgs need hand-holding
   - **Mitigation:** Self-service docs, video tutorials, community forum
   
5. **Churn:** Seasonal organizations (only use 3-4 months/year)
   - **Mitigation:** User accounts stay active year-round (social features), annual billing discount
   
6. **Content Moderation:** Social features = potential abuse
   - **Mitigation:** Start with private feeds (friends only), add public discovery later
   - Simple report/block tools
   - Manual review (small scale initially)
   
7. **Feature Creep:** Risk of building too much, losing focus
   - **Mitigation:** Stick to phases, ship Phase 1 before building Phase 2
   - Get feedback from real users, validate before expanding

---

## 🤔 Open Questions

1. Should we focus on outdoor recreation orgs exclusively, or go broader?
2. Subscription vs. per-event pricing? (Or both?)
3. Self-hosted option for privacy-conscious orgs?
4. International expansion? (waivers are US-specific)
5. How much customization should the free tier allow?
6. **Event Discovery:** Should there be a public event directory, or only via direct links?
7. **Privacy:** Can users make their volunteer history public/private?
8. **Verification:** Should orgs be able to verify volunteer hours for resume purposes?
9. **Social Features:** User profiles, ratings, recommendations?
10. **Mobile App:** Native apps or PWA-first approach?

---

## 🎯 Conversion Optimization Strategy

### Goal: Minimize Friction at Every Step

**Signup/Login (Target: <30 seconds)**
- SSO buttons prominent (Google/Apple)
- One-click for returning users
- Magic links instead of password resets
- Progressive profile completion

**Event Registration (Target: <60 seconds)**
- Pre-filled info from user profile
- Apple Pay / Google Pay one-tap
- Skip unnecessary fields
- Mobile-optimized forms

**Waiver Signing (Target: <45 seconds)**
- Auto-fill personal info from profile
- Signature options: draw OR type name
- Emergency contact saved from previous
- Family members quick-add

**Payment (Target: <10 seconds for returning users)**
- Saved payment methods
- Link autofill for first-time Stripe users
- Apple Pay / Google Pay primary CTAs
- No forced account creation before checkout

**Mobile-First Design**
- 70% of event signups happen on mobile
- Thumb-friendly buttons
- Minimal typing required
- Auto-advance forms

### Metrics Dashboard
Track these religiously:
- Time to first registration (from account creation)
- Cart abandonment rate
- Password reset requests
- Mobile vs desktop conversion rates
- SSO adoption rate

---

## 📝 Next Steps (Phase 1 MVP)

### Week 1-2: Foundation
1. [ ] Set up NextAuth.js with Google/Apple SSO
2. [ ] Design database schema (Users, Organizations, Events, Registrations)
3. [ ] Implement user account creation & dashboard
4. [ ] Set up Twilio for SMS 2FA

### Week 3-4: Core Features
5. [ ] Build organization creation flow
6. [ ] Multi-event management UI
7. [ ] User registration/RSVP system
8. [ ] Integrate existing waiver signing

### Week 5-6: Payments & Polish
9. [ ] Stripe integration (Apple Pay, Google Pay, Link)
10. [ ] Email notifications (Resend)
11. [ ] Mobile optimization
12. [ ] Admin dashboard improvements

### Week 7-8: Testing & Launch
13. [ ] Deploy Phase 1 for Iron County Trail Club
14. [ ] Onboard requesting organization
15. [ ] Collect feedback, iterate
16. [ ] Prepare for Phase 2 beta outreach

---

## 🎯 Executive Summary (Pitch Version)

**The Big Idea:** Build the social network for volunteers — think LinkedIn meets Strava for doing good.

**Problem:** 
- Event organizers use clunky, expensive tools (SignUpGenius, Signup.com) that charge $10-50/month
- Volunteers have no way to track their impact or connect with other volunteers
- Waivers, donations, and events are handled by separate tools
- No community or recognition for volunteering

**Solution:** A modern volunteer marketplace where:
- **Users** build their volunteer identity, get verified, connect with friends, share impact
- **Organizations** find trusted volunteers, manage events, accept donations, handle waivers
- **Everyone** benefits from network effects + trust & safety

**Four Core Capabilities:**
1. **Events:** Free, paid, and volunteer shifts (with search & discovery)
2. **Donations:** One-time and recurring giving
3. **Volunteers:** Hour tracking, badges, ratings, verified credentials (CPR, background checks)
4. **Waivers:** Digital signatures integrated seamlessly

**Trust & Safety (The Differentiator):**
- Two-way ratings (volunteers rate orgs, orgs rate volunteers)
- Background check integration (Checkr, Sterling)
- Certificate verification (CPR, BLS, First Aid)
- Volunteer search by verified credentials

**Market:** Nonprofits, outdoor recreation clubs, volunteer organizations (TAM: 1.5M nonprofits + 63M volunteers in US)

**Business Model:** Freemium SaaS + Verification Revenue (3 revenue streams)

**1. Subscriptions:**
- **Free:** Unlimited everything + social features (hook users with value)
- **Starter:** $15/mo (SMS notifications, remove branding, 10 volunteer verifications)
- **Pro:** $39/mo (custom branding, analytics, 50 volunteer verifications)
- **Enterprise:** $199+/mo (white-label, API, multi-chapter)

**2. Transaction Fees:**
- Free tier: 5% platform fee on paid tickets (buyer-paid)
- Paid tiers: 0% platform fee

**3. Verification Services (26% of revenue at scale!):**
- **Volunteer hour certificates:** $5 per download (high schools, colleges, corporate programs)
- **Org verification checks:** $2-3 per volunteer history lookup (orgs vetting applicants)

**The Moat (Why We Win):**
1. **Network effects:** More users → more orgs → more events → more users (viral loop)
2. **Switching costs:** Volunteer history is valuable, social connections live here
3. **Community:** It's not just a tool, it's your volunteer identity
4. **Social features:** Competitors can't retrofit this without rebuilding from scratch

**Differentiation:**
- **Verified volunteer marketplace** — tamper-proof hour tracking (competitors = paper forms)
- **Monetize the data** — volunteers pay $5 for certificates, orgs pay to verify history
- Social volunteering (friends, feeds, sharing) — competitors have none of this
- User-centric platform (one account across all orgs)
- Built-in digital waivers
- Gamification (badges, challenges, annual recap)
- All-in-one (events + donations + volunteers + waivers)

**Traction:**
- Proven working MVP (Iron County Trail Club snowshoe event)
- Second org already interested
- Built by web dev agency owner (Paul Eident, Aslan Interactive)

**Ask:** N/A (bootstrapping initially, may raise seed later for growth)

**Financials:**
- Phase 1: $25/mo operating costs, $0 revenue (validation)
- Phase 2: $190/mo costs, $125+ MRR (20 orgs, 500 users)
- Phase 3 (100 orgs, 5k users): $300-400/mo costs, **$580 subscription + $9,600 verification = $10,180 MRR**
- At scale (5,000 orgs, 50k users): **$75,250/mo** ($903k/year) — verification = 26% of revenue

**Timeline:**
- Phase 1 MVP (social + events): 6-8 weeks
- Phase 2 Beta (gamification + donations): +8-10 weeks
- Phase 3 Public Launch: +3-4 months

---

---

## 💰 Operating Costs Estimate

### Phase 1 (0-100 users, 2 orgs)
| Service | Cost/Month |
|---------|------------|
| Vercel Hobby | $0 (free tier) |
| Neon Postgres | $0 (free tier) |
| Vercel Blob | ~$5 |
| Resend (email) | $0 (3k emails/mo free) |
| Twilio (SMS 2FA) | ~$20 (100 verifications) |
| Stripe | 2.9% + 30¢ per transaction |
| **Total Fixed** | **~$25/mo** |

### Phase 2 (100-500 users, 10 orgs)
| Service | Cost/Month |
|---------|------------|
| Vercel Pro | $20 |
| Neon Scale | ~$30 |
| Vercel Blob | ~$20 |
| Resend (email) | ~$20 (20k emails/mo) |
| Twilio (SMS) | ~$100 (500 verifications) |
| Stripe | 2.9% + 30¢ per transaction |
| **Total Fixed** | **~$190/mo** |
| **Break-even MRR** | **~$400/mo** (10 orgs × $40) |

### Phase 3 (500-5000 users, 50+ orgs)
**Option A: Stay on Vercel**
- Monthly cost: ~$300-400
- Simple, less maintenance
- Good margins if pricing is right

**Option B: Migrate to AWS**
- Monthly cost: ~$400-600
- Better margins at scale
- More control, more complexity
- RDS, ECS/Fargate, S3, SES

**Break-even:** ~$800-1000 MRR (20-25 paying orgs)

---

---

## 🚀 Why Now?

**Social + Purpose = Mega Trend**
- Gen Z/Millennials want to volunteer but need community/recognition
- "Volunteer tourism" and impact travel booming
- People share everything (workouts, meals) — why not volunteering?
- Corporate volunteer programs looking for better tracking

**Technology Enables This**
- Mobile payments (Apple Pay, Google Pay) = friction-free
- SSO (Google, Apple) = easy onboarding
- Stripe = payments + donations in one
- Next.js + Vercel = ship fast, scale later

**Market Timing**
- SignUpGenius/Signup.com haven't innovated in years
- Nonprofits desperate for better tools (post-pandemic volunteer shortage)
- User expectations changed (people expect social features everywhere)

---

## 🎯 Success = This in 24 Months

**Users:**
- 10,000+ active volunteer accounts
- 40% monthly active usage (check feed, register for events)
- Average 3.2 organizations per user (strong cross-org engagement)
- 50% of signups via SSO (low friction validated)

**Organizations:**
- 200+ organizations using the platform
- 30 paying (Pro/Enterprise)
- $1,200 subscription + $800 verification = **$2,000 MRR** (profitable)
- 80% retention (sticky, not just seasonal use)
- 20% actively using volunteer verification service

**Network Effects:**
- 25% of event registrations come from "friend invited" or feed discovery
- Users sharing achievements to Instagram/LinkedIn regularly
- Word-of-mouth primary acquisition channel

**Platform Health:**
- 500+ events per month
- $50k+ in donations processed monthly
- 15,000+ volunteer hours logged
- Users spending 10+ min per session (high engagement)

**Verification Revenue (Key Differentiator):**
- 200+ volunteer hour certificates downloaded/month ($1,000/mo)
- 100+ volunteer verification checks/month ($300/mo)
- Users saying "I used this certificate for college applications"
- Orgs saying "We only hire volunteers with verified hours"

**Validation Metrics:**
- Orgs saying "all our volunteers are already on this platform"
- Users saying "I found my next volunteer opportunity through a friend"
- Inbound requests from national nonprofits

---

**Last Updated:** 2026-03-07
