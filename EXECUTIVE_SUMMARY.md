# Executive Summary

## The Big Idea

Build the **LinkedIn + Strava for volunteers** — a verified volunteer marketplace where people build their volunteer identity, organizations find trusted volunteers, and everyone benefits from network effects.

---

## The Problem

**For Volunteers:**
- No way to track volunteer impact across multiple organizations
- Paper forms, manual signatures — easy to fake for college/job applications
- No community, recognition, or social connection around volunteering
- Each organization requires re-entering the same information

**For Organizations:**
- Using clunky, expensive tools (SignUpGenius: $12-50/mo) that lack modern features
- Can't verify volunteer history or reliability before accepting them
- No built-in waivers, donations, or credential verification
- No access to a network of engaged, verified volunteers

**Market Gap:**
- 63 million volunteers in the US
- 1.5 million nonprofits
- No platform combines events + donations + verified volunteer tracking + social features

---

## The Solution

A modern volunteer marketplace with **four core capabilities:**

### 1. 📅 **Events**
- Create free events, paid registrations, or volunteer shifts
- Search & discovery (by location, cause, skills needed)
- Built-in waivers with digital signatures
- Mobile-first, Apple Pay/Google Pay checkout

### 2. 💰 **Donations**
- One-time and recurring giving
- Fundraising campaigns with progress tracking
- Peer-to-peer fundraising
- Zero platform fees (Stripe fees only)

### 3. 👥 **Verified Volunteers**
- Tamper-proof hour tracking (resume-worthy)
- Upload certifications (CPR, BLS, First Aid)
- Background check integration (Checkr, Sterling)
- Two-way ratings (volunteers rate orgs, orgs rate volunteers)
- Official hour certificates for college/graduation ($5 download)

### 4. 📝 **Waivers**
- Digital signature capture (draw or type)
- Auto-populated from user profile
- Family waivers (one adult, multiple minors)
- Stored in user account

**Plus Social Features:**
- Connect with friends, see where they're volunteering
- Activity feed, badges, challenges
- Share achievements to social media
- Gamification (annual recap, impact stats)

---

## Business Model (3 Revenue Streams)

### **1. Subscription SaaS (39% of revenue)**
- **Free:** Unlimited events, all features (5% buyer-paid fee on tickets)
- **Starter ($15/mo):** Remove branding, SMS, 0% transaction fees, 10 volunteer verifications
- **Pro ($39/mo):** Custom branding, analytics, 50 volunteer verifications, recurring donations
- **Enterprise ($199+/mo):** White-label, API, bulk background checks

### **2. Transaction Fees (33% of revenue)**
- Free tier: 5% platform fee on paid tickets (buyer-paid)
- Paid tiers: 0% platform fee (only Stripe 2.9% + $0.30)

### **3. Verification Services (26% of revenue) 🔥**
- **Volunteer hour certificates:** $5 per PDF download
  - For high school graduation, college apps, corporate bonuses
  - Tamper-proof verification with QR code
  - 98% profit margin
- **Org verification checks:** $2-3 per volunteer history lookup
  - Orgs verify applicants' volunteer history before accepting them
  - Included in Starter (10/mo), Pro (50/mo), or pay-per-check

---

## Why We Win (The Moat)

### **1. Network Effects (Primary Defense)**
- More volunteers → orgs join to access them
- More orgs → more events → more users
- Friend shares achievement → friends join (viral loop)
- Once you reach 1,000-2,000 active users in a region, new orgs *must* join

### **2. Switching Costs**
- Verified volunteer hours are valuable (college apps, resume)
- Social connections live here
- Lose badges/achievements if you leave
- First-mover advantage in "verified volunteering"

### **3. Data Moat**
- Verified hour tracking (competitors = paper forms)
- Social graph of volunteers
- Two-way ratings build trust
- Credential verification (CPR, background checks)

### **4. Competitors Can't Copy**
- SignUpGenius/Signup.com are org-centric tools, not user platforms
- Retrofitting social features + verification = complete rebuild
- They'd cannibalize existing revenue model

---

## Competitive Differentiation

| Feature | Our Platform | SignUpGenius | Signup.com | Eventbrite |
|---------|--------------|--------------|------------|------------|
| **Social volunteering** | ✅ Friends, feeds, sharing | ❌ | ❌ | ❌ |
| **Verified hour tracking** | ✅ Tamper-proof | ❌ Paper only | ❌ | ❌ |
| **Official certificates** | ✅ $5 download | ❌ | ❌ | ❌ |
| **Two-way ratings** | ✅ | ❌ | ❌ | ❌ |
| **Background checks** | ✅ Integrated | ❌ | ❌ | ❌ |
| **Built-in waivers** | ✅ | ❌ | ❌ | ❌ |
| **Donations** | ✅ Free | ❌ | ❌ | Add-on |
| **Free tier** | ✅ Truly unlimited | Limited (ads) | ❌ Trial only | ✅ |
| **Pricing** | Free-$199/mo | $12-50/mo | $10-40/mo | Free + 3.7% |

**Key Advantage:** We're a verified volunteer marketplace. They're just signup tools.

---

## Market Opportunity

**Total Addressable Market:**
- 63 million volunteers in the US
- 1.5 million nonprofits
- $471 billion donated annually
- 8.9 billion volunteer hours/year

**Serviceable Addressable Market:**
- 500k+ organizations need volunteer coordination
- 10M+ active volunteers (high school students, college applicants, corporate programs)

**Initial Focus:**
- Outdoor recreation clubs (trail clubs, ski patrols, bike clubs)
- Nonprofits with recurring volunteer programs
- Schools with graduation hour requirements

---

## Traction

- ✅ **Proven MVP:** Iron County Trail Club snowshoe event (working waiver system)
- ✅ **Second org interested:** Already have inbound demand
- ✅ **Built by web dev agency:** Aslan Interactive (Paul Eident, co-owner)
- ✅ **Technical de-risked:** Modern stack (Next.js, Stripe, Vercel), easy to ship

---

## Financial Projections

### Phase 1 - MVP (6-8 weeks)
- **Users:** 50+ accounts
- **Orgs:** 2 (Iron County Trail Club + requesting org)
- **Revenue:** $0 (validation phase)
- **Costs:** $25/mo

### Phase 2 - Beta (8-10 weeks)
- **Users:** 500 accounts
- **Orgs:** 20 (15 free, 5 paid)
- **Revenue:** $125/mo (break-even)
- **Costs:** $190/mo

### Phase 3 - Public Launch (3-4 months)
- **Users:** 5,000 accounts
- **Orgs:** 100 (80 free, 20 paid)
- **Revenue:** $10,180/mo
  - Subscriptions: $580/mo
  - Transaction fees: $9,000/mo
  - Verification: $600/mo
- **Costs:** $300-400/mo

### At Scale (24 months)
- **Users:** 50,000 active volunteers
- **Orgs:** 5,000 organizations
- **Revenue:** **$75,250/mo** ($903,000/year)
  - Subscriptions: $29,000/mo (39%)
  - Transaction fees: $25,000/mo (33%)
  - Verification: $19,167/mo (26%)
  - Background checks: $2,083/mo (3%)

**Unit Economics:**
- CAC: $5-10 (organic/viral growth)
- LTV: $120+ (12-month retention × $10/mo average)
- LTV/CAC: 12-24x

---

## Go-to-Market Strategy

### Phase 1: Local Validation
- Deploy for Iron County Trail Club
- Onboard second requesting organization
- Prove concept, gather feedback

### Phase 2: Geographic Density
- Target Upper Peninsula Michigan trail clubs
- Ski Patrol System (NSP) local patrols
- Dense communities create network effects

### Phase 3: Vertical Expansion
- High schools (graduation requirements)
- Corporate volunteer programs
- National nonprofits

### Growth Channels:
1. **Organic/Viral:** Social sharing, friend invitations (primary)
2. **Content Marketing:** SEO for "verified volunteer hours certificate"
3. **Partnerships:** High schools, corporate HR programs
4. **Community:** Facebook groups, Reddit (r/volunteer, r/nonprofit)

---

## Why Now?

**1. Social + Purpose = Mega Trend**
- Gen Z/Millennials want recognition for volunteering
- People share everything (workouts, meals) — why not impact?
- Corporate volunteer programs growing

**2. Technology Enables This**
- Mobile payments (Apple Pay, Google Pay) = friction-free
- SSO (Google, Apple) = 1-click signup
- Next.js + Vercel = ship fast, scale later

**3. Market Timing**
- SignUpGenius/Signup.com haven't innovated in years
- Post-pandemic volunteer shortage
- User expectations changed (expect social features everywhere)

---

## The Ask

**Current:** Bootstrapping (no funding needed for Phase 1-2)

**Future (Optional):** Seed round ($500k-1M) to accelerate growth
- Use: Marketing, sales team, mobile app development
- When: After proving Phase 2 metrics (20+ paying orgs, 500+ users)

---

## Timeline

- **Week 0-8:** Phase 1 MVP (events + social + verification)
- **Week 8-18:** Phase 2 Beta (gamification + donations + trust/safety)
- **Month 6-9:** Phase 3 Public Launch
- **Month 12:** 1,000+ users, 50+ orgs
- **Month 24:** 10,000+ users, 200+ orgs, $2,000 MRR

---

## Success Metrics (24 Months)

**Users:**
- 10,000+ active volunteer accounts
- 40% monthly active (high engagement)
- 3.2 orgs per user (cross-org activity)

**Organizations:**
- 200+ orgs using platform
- 30 paying (Starter/Pro/Enterprise)
- $2,000 MRR (profitable, sustainable)

**Network Effects:**
- 25% of registrations via friend discovery
- Regular social sharing to Instagram/LinkedIn
- Inbound from national nonprofits

**Verification Revenue:**
- 200+ hour certificates/month
- 100+ volunteer verification checks/month
- Users saying "I used this for college"

---

## Team

**Paul Eident** - Founder
- Co-owner, Aslan Interactive (web development agency)
- 20+ years web development experience
- VP, Iron County Trail Club (first customer)
- Ski Patrol Director, Ski Brule
- Located: Caspian, MI

---

## The Vision

**In 5 years:** The go-to platform for verified volunteering in the US.

- Colleges recognize our certificates for admissions
- High schools integrate for graduation requirements
- Corporate HR departments use for volunteer programs
- Nonprofits find volunteers here first
- 1 million+ verified volunteers
- 50,000+ organizations
- $10M+ annual revenue

**We're not building a signup tool. We're building the credential system for volunteering.**

---

## Contact

**Paul Eident**  
Email: paul@aslaninteractive.com  
GitHub: PaulEident/online-waivers  
Business Plan: `/workspace/online-waivers/BUSINESS_PLAN.md`

---

**Last Updated:** March 7, 2026
