"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = [
  { key: "waivers", label: "Waivers" },
  { key: "shifts", label: "Shift Signups" },
  { key: "hours", label: "Volunteer Hours" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function HowToUsePage() {
  const [active, setActive] = useState<TabKey>("waivers");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-4 py-14 md:py-20 text-center">
          <p className="text-brand-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Getting Started
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            How to Use Volntir
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            From sharing your waiver link to managing volunteer shifts and tracking hours — here&apos;s how to get the most out of Volntir.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        {/* Tab Bar */}
        <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                active === tab.key
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {active === "waivers" && <WaiversTab />}
        {active === "shifts" && <ShiftSignupsTab />}
        {active === "hours" && <VolunteerHoursTab />}

        {/* CTA */}
        <div className="mt-14 bg-brand-dark rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Ready to Try It?</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">
            Create your free account, set up your first event, and share your waiver link in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/our-story"
              className="px-6 py-2.5 bg-white/5 text-gray-300 hover:text-white font-semibold rounded-xl border border-white/15 hover:bg-white/10 transition-colors text-sm"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Tab 1: Waivers (existing content)                        */
/* ────────────────────────────────────────────────────────── */

function WaiversTab() {
  return (
    <div className="space-y-14">
      {/* Step 1: Share Your Waiver Link */}
      <section>
        <StepHeader num={1} color="brand" title="Share Your Waiver Link" subtitle="Get your waiver in front of attendees before they arrive" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Every event in Volntir gets a short, shareable link (like <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono text-brand">volntir.com/e/ABC123</code>).
            Share it everywhere your attendees are — the more waivers signed ahead of time, the smoother your event day.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IconCard color="blue" title="Social Media" description="Post the link on Facebook, Instagram, or your group's page" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />} />
            <IconCard color="purple" title="Your Website" description="Add the link to your event page or registration info" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />} />
            <IconCard color="green" title="Email" description="Include in event reminders or newsletters" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />} />
            <IconCard color="amber" title="Text / SMS" description="Text the short link directly — it's short enough to type" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />} />
          </div>
          <TipBox>Encourage attendees to sign before the event. Pre-signed waivers speed up check-in dramatically.</TipBox>
        </div>
      </section>

      {/* Step 2: Print a QR Code */}
      <section>
        <StepHeader num={2} color="brand" title="Print a QR Code" subtitle="Let attendees scan and sign on the spot" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Every event has a downloadable QR code in your event dashboard. Download the PNG, print it out,
            and post it where attendees can see it. When they scan it with their phone camera, it takes them
            straight to the waiver.
          </p>
          <h3 className="font-bold text-gray-900 text-sm">Great places to post your QR code:</h3>
          <CheckList items={[
            "Registration table or sign-in desk",
            "Venue entrance or doorway",
            "Trailhead, parking area, or meeting point",
            "Posted on a clipboard or easel at the event",
          ]} />
          <TipBox>Print a few copies on standard letter paper. The QR code includes the event name and &quot;Scan to Sign Waiver&quot; instructions so attendees know exactly what to do.</TipBox>
        </div>
      </section>

      {/* Step 3: Check In Attendees */}
      <section>
        <StepHeader num={3} color="accent" title="Check In Attendees" subtitle="Verify waivers and mark arrivals in real time" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Once an attendee signs their waiver, they show up in your event&apos;s check-in list on Volntir.
            On event day, open the check-in page on a phone, tablet, or laptop:
          </p>
          <NumberedSteps steps={[
            { label: "Search by name", description: "start typing to find the attendee instantly" },
            { label: "Verify waiver status", description: "see at a glance if their waiver is signed" },
            { label: "Tap to check in", description: "one tap marks them as arrived", highlight: true },
          ]} />
          <TipBox>Assign an event manager in your dashboard so a volunteer can run check-in from their own phone without needing full admin access.</TipBox>
        </div>
      </section>

      {/* Step 4: Mark Who's Checked In */}
      <section>
        <StepHeader num={4} color="brand-dark" title="Mark Who's Checked In" subtitle="Simple visual methods so anyone can tell at a glance" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            After checking someone in on Volntir, use a quick visual marker so staff and volunteers can
            instantly tell who&apos;s been cleared — no need to check a screen every time.
          </p>
          <div className="space-y-3">
            <DetailCard color="purple" title="Colored Marker on the Hand" description="A small mark on the back of the hand with a washable marker. Fast, cheap, and easy to spot. Use a different color or symbol for each event to prevent reuse." icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />} />
            <DetailCard color="blue" title="Tyvek Wristband" description="Inexpensive, single-use wristbands that can't be transferred. Great for longer events or venues where you need to verify attendees at multiple points." icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />} />
            <DetailCard color="green" title="Zip Tie on a Zipper Pull" description="A small colored zip tie attached to a jacket zipper or bag. Discreet, durable, and works well for outdoor events where hands get dirty or wet." icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />} />
          </div>
          <TipBox>Whichever method you choose, keep it consistent across your event staff so everyone knows what to look for. A quick briefing before the event goes a long way.</TipBox>
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Tab 2: Shift Signups                                     */
/* ────────────────────────────────────────────────────────── */

function ShiftSignupsTab() {
  return (
    <div className="space-y-14">
      {/* Step 1: Create Volunteer Shifts */}
      <section>
        <StepHeader num={1} color="brand" title="Create Volunteer Shifts" subtitle="Set up shifts with time slots and capacity limits" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            In your event admin dashboard, go to the <strong>Volunteer Shifts</strong> tab to create shifts for your event.
            Each shift has a name, start time, end time, and a maximum number of volunteers.
          </p>
          <NumberedSteps steps={[
            { label: "Open your event", description: "go to the event admin dashboard" },
            { label: "Click Volunteer Shifts", description: "find the tab in the event settings" },
            { label: "Add a shift", description: "set the name, time slot, and capacity", highlight: true },
          ]} />
          <TipBox>Create multiple shifts to cover different time slots or roles. For example, &quot;Morning Setup (8am–10am)&quot; and &quot;Afternoon Trail Work (12pm–3pm).&quot;</TipBox>
        </div>
      </section>

      {/* Step 2: Share Your Event Page */}
      <section>
        <StepHeader num={2} color="brand" title="Share Your Event Page" subtitle="Volunteers browse and pick their shifts" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Your event page shows all available shifts along with the waiver. When you share your event link, volunteers
            can see which shifts are open, how many spots remain, and sign up right from the same page.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IconCard color="blue" title="Same Event Link" description="The waiver link and shift signups share the same event page" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />} />
            <IconCard color="green" title="Live Availability" description="Spot counts update in real time as volunteers sign up" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />} />
          </div>
          <TipBox>Share the same link you use for waivers — volunteers will see both the waiver and available shifts on one page.</TipBox>
        </div>
      </section>

      {/* Step 3: Volunteers Sign Up */}
      <section>
        <StepHeader num={3} color="accent" title="Volunteers Sign Up" subtitle="Pick a shift, sign up, or join the waitlist" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Volunteers browse the available shifts and pick the one that works for them. If a shift is full,
            they can join the waitlist and get notified if a spot opens up.
          </p>
          <CheckList items={[
            "Browse shifts with times, descriptions, and remaining spots",
            "Sign up with one tap — no separate account required",
            "Join a waitlist if a shift is full",
            "Add family members to the same shift",
          ]} />
          <TipBox>Volunteers who sign the waiver and sign up for a shift do both on the same page — no extra steps or separate links needed.</TipBox>
        </div>
      </section>

      {/* Step 4: Manage Signups */}
      <section>
        <StepHeader num={4} color="brand-dark" title="Manage Signups" subtitle="See who's signed up and manage your roster" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Your admin dashboard shows a complete view of shift signups. See who&apos;s signed up for each shift,
            how many spots are left, and manage waitlists — all in one place.
          </p>
          <NumberedSteps steps={[
            { label: "View by shift", description: "see all volunteers assigned to each time slot" },
            { label: "Check capacity", description: "monitor open spots and waitlist length" },
            { label: "Manage roster", description: "move volunteers between shifts or remove signups", highlight: true },
          ]} />
          <TipBox>Check your shift signups a day or two before the event so you can reach out if any shifts are understaffed.</TipBox>
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Tab 3: Volunteer Hours                                   */
/* ────────────────────────────────────────────────────────── */

function VolunteerHoursTab() {
  return (
    <div className="space-y-14">
      {/* Step 1: Enable Volunteer Tracking */}
      <section>
        <StepHeader num={1} color="brand" title="Enable Volunteer Tracking" subtitle="Turn on hour tracking for your event" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Volunteer hour tracking is available on any event. When attendees sign the waiver, they can
            indicate that they&apos;re volunteering — this enables the time clock and hour logging features for them.
          </p>
          <NumberedSteps steps={[
            { label: "Attendee signs the waiver", description: "the standard event waiver flow" },
            { label: "Checks 'I am volunteering'", description: "opts into volunteer hour tracking on the waiver form" },
            { label: "Time clock becomes available", description: "the volunteer can now clock in/out and log hours", highlight: true },
          ]} />
          <TipBox>Volunteers opt in during the waiver signing process — there&apos;s no separate setup needed from the admin side.</TipBox>
        </div>
      </section>

      {/* Step 2: Clock In & Out */}
      <section>
        <StepHeader num={2} color="brand" title="Clock In & Out" subtitle="Volunteers track their time on event day" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            On event day, volunteers open the event page from their phone and use the built-in time clock.
            One tap to clock in when they arrive, one tap to clock out when they leave.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IconCard color="green" title="One-Tap Clock In" description="Volunteers tap a button when they arrive to start tracking" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} />
            <IconCard color="blue" title="One-Tap Clock Out" description="Another tap when they leave records the total time" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />} />
          </div>
          <TipBox>The time clock works on any device with a web browser — no app to install. Remind volunteers to clock out before they leave.</TipBox>
        </div>
      </section>

      {/* Step 3: Log Past Hours */}
      <section>
        <StepHeader num={3} color="accent" title="Log Past Hours" subtitle="Manually submit hours for previous work" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Forgot to clock in? No problem. Volunteers can manually log hours after the fact by entering
            the date, start time, end time, and an optional note describing what they did.
          </p>
          <CheckList items={[
            "Enter the date and time range for the work",
            "Add an optional description of what was done",
            "Submit for admin review and approval",
            "View a history of all logged hours in one place",
          ]} />
          <TipBox>Manually logged hours go through admin approval, so there&apos;s always a review step before they&apos;re counted.</TipBox>
        </div>
      </section>

      {/* Step 4: Review & Approve */}
      <section>
        <StepHeader num={4} color="brand-dark" title="Review & Approve" subtitle="Admins verify and approve submitted hours" />
        <div className="ml-14 space-y-4 text-[15px] text-gray-700 leading-relaxed">
          <p>
            Event admins can review all submitted volunteer hours from the admin dashboard. Approve hours that
            look correct, or reject entries that need correction.
          </p>
          <NumberedSteps steps={[
            { label: "Open the event admin", description: "go to the volunteer hours section" },
            { label: "Review submissions", description: "see each volunteer's logged hours with timestamps" },
            { label: "Approve or reject", description: "one click to approve, with optional notes for rejections", highlight: true },
          ]} />
          <TipBox>Volntir records are for organizational tracking only. Courts and supervising agencies determine what constitutes valid documentation for compliance purposes.</TipBox>
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Shared Components                                        */
/* ────────────────────────────────────────────────────────── */

function StepHeader({ num, color, title, subtitle }: { num: number; color: string; title: string; subtitle: string }) {
  const bgMap: Record<string, string> = {
    brand: "bg-brand",
    accent: "bg-accent",
    "brand-dark": "bg-brand-dark",
  };
  return (
    <div className="flex items-start gap-4 mb-5">
      <div className={`w-10 h-10 ${bgMap[color] || "bg-brand"} rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 mt-0.5`}>
        {num}
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm">
      <p className="text-brand-800">
        <strong>💡 Tip:</strong> {children}
      </p>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NumberedSteps({ steps }: { steps: { label: string; description: string; highlight?: boolean }[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`w-6 h-6 ${step.highlight ? "bg-accent/10" : "bg-gray-100"} rounded-full flex items-center justify-center text-xs font-bold ${step.highlight ? "text-accent" : "text-gray-500"} shrink-0 mt-0.5`}>
            {i + 1}
          </div>
          <p className="text-sm"><strong>{step.label}</strong> — {step.description}</p>
        </div>
      ))}
    </div>
  );
}

function IconCard({ color, title, description, icon }: { color: string; title: string; description: string; icon: React.ReactNode }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
    green: { bg: "bg-green-50", text: "text-green-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center shrink-0`}>
        <svg className={`w-4 h-4 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function DetailCard({ color, title, description, icon }: { color: string; title: string; description: string; icon: React.ReactNode }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
    green: { bg: "bg-green-50", text: "text-green-600" },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center shrink-0`}>
        <svg className={`w-5 h-5 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        <p className="text-sm text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
