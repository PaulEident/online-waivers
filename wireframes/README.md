# Volntir Wireframes

Interactive HTML wireframes for the volunteer marketplace platform.

## 📂 Files

### 1. **index.html** - Landing Page
- Hero section with value proposition
- Feature cards (4 pillars)
- CTA buttons
- Navigation to other wireframes

### 2. **search.html** - Event Search & Discovery
- Search bar with filters
- Sidebar with advanced filters (location, cause, requirements)
- Event cards with ratings
- Map view placeholder

### 3. **event.html** - Event Detail Page
- Full event information
- Registration button
- Requirements & what to bring
- Volunteer list (friends attending)
- Organization info

### 4. **profile.html** - User Profile
- Volunteer stats (hours, events, orgs, rating)
- Volunteer history timeline
- Certifications (CPR, First Aid, Background Check)
- Achievement badges
- Download certificate CTA

### 5. **dashboard.html** - Activity Feed
- Social feed (friends' activity)
- Likes, comments, shares
- Achievement announcements
- Event registrations
- Organization posts
- Friends list sidebar
- Quick stats

### 6. **certificate.html** - Volunteer Hour Certificate
- Certificate preview
- Professional layout with seal
- QR code verification
- Pricing ($5 download)
- Benefits list

### 7. **org-dashboard.html** - Organization Dashboard
- Key metrics (volunteers, events, hours, donations)
- Upcoming events with registration counts
- Top volunteers with ratings & verified badges
- Quick actions
- Recent activity feed
- Verification check usage

---

## 🎨 Design System

### Colors
- **Primary Blue:** #2563eb
- **Yellow/Gold (badges):** #fbbf24, #fef3c7
- **Gray Scale:** #f5f5f5 (bg), #ddd (borders), #666 (text), #e5e7eb (light borders)
- **Success Green:** #10b981
- **White:** #ffffff

### Typography
- **Font:** System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI')
- **Sizes:**
  - Headers: 32-48px
  - Body: 14-16px
  - Small: 12-13px

### Components
- **Cards:** White background, 2px border (#ddd), 8px border-radius
- **Buttons:** Primary (blue), Secondary (white with blue border)
- **Badges/Tags:** Various backgrounds with 1px borders
- **Avatars:** Circular, 40-120px

---

## 📱 Features Shown

### Core Platform Features
✅ Event search & discovery  
✅ Event details & registration  
✅ User profiles with verified credentials  
✅ Social activity feed  
✅ Volunteer hour tracking  
✅ Certificate downloads ($5)  
✅ Organization dashboard  
✅ Two-way ratings  
✅ Certification badges  
✅ Friend connections  
✅ Achievement system  

### Trust & Safety
✅ Background check badges  
✅ Certification verification  
✅ Ratings display  
✅ Volunteer history verification  
✅ QR code verification  

### Monetization
✅ Certificate download ($5)  
✅ Verification check usage (Starter/Pro plans)  
✅ Transaction fees (implied in org dashboard)  

---

## 🚀 How to Use

1. **View Wireframes:**
   - Open `index.html` in any web browser
   - Navigate using the links at the bottom of the landing page
   - Or open individual HTML files directly

2. **Interactive Elements:**
   - Links between pages are functional
   - Most buttons are placeholders (no backend)
   - Layout is responsive (mobile-friendly)

3. **Customize:**
   - Edit HTML files directly
   - Colors and spacing are in `<style>` tags
   - Easy to modify without complex build tools

---

## 💡 Next Steps

### For Development:
1. Convert these to React components
2. Add real backend (Next.js API routes)
3. Integrate Stripe for payments
4. Add authentication (NextAuth.js)
5. Implement database (Prisma + PostgreSQL)

### For Figma:
1. Use these as reference for high-fidelity designs
2. Extract the design system (colors, typography, spacing)
3. Create component library in Figma
4. Add interactive prototypes

### For Feedback:
1. Share these HTML files with stakeholders
2. Test on mobile devices
3. Get user feedback on flows
4. Iterate based on feedback

---

## 📋 Screen Flow

```
Landing (index.html)
  ├─→ Search (search.html)
  │    └─→ Event Detail (event.html)
  │         └─→ Register (placeholder)
  │
  ├─→ User Profile (profile.html)
  │    ├─→ Dashboard/Feed (dashboard.html)
  │    └─→ Certificate (certificate.html)
  │         └─→ Purchase (placeholder)
  │
  └─→ Org Dashboard (org-dashboard.html)
       ├─→ Create Event (placeholder)
       ├─→ Verify Volunteer (placeholder)
       └─→ View All Events (placeholder)
```

---

## 🎯 User Flows Demonstrated

### Volunteer Journey:
1. Land on homepage → See value prop
2. Search for events → Filter by location/cause
3. View event details → Check requirements
4. Register (placeholder) → Sign waiver
5. Attend event → Get checked in
6. See activity in feed → Share to social
7. View profile → See hours accumulate
8. Download certificate → Pay $5

### Organization Journey:
1. Create account (placeholder)
2. Create first event
3. Share event link
4. Monitor registrations
5. Check in volunteers
6. Rate volunteers after event
7. View analytics
8. Verify new volunteer applicant

---

**Created:** March 7, 2026  
**Last Updated:** March 7, 2026  
**Status:** Ready for development/feedback
