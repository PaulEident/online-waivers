import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

function getBaseUrl(): string {
  // Explicit override (set in Vercel env vars or .env)
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  // Vercel auto-provides the production domain
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  // Vercel auto-provides the deployment URL (preview/branch deploys)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Local dev fallback
  return "http://localhost:3000";
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = getBaseUrl();
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";

  await resend.emails.send({
    from: `Volntir <${fromEmail}>`,
    to: email,
    subject: "Reset your Volntir password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">Reset your password</h1>
        </div>
        <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #ea580c; color: white; font-weight: 600; font-size: 15px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
            Reset password
          </a>
        </div>
        <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5;">
          This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
        <p style="color: #9CA3AF; font-size: 12px;">
          If the button doesn't work, copy and paste this URL into your browser:<br />
          <a href="${resetUrl}" style="color: #ea580c; word-break: break-all;">${resetUrl}</a>
        </p>
      </div>
    `,
  });
}

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

// ──────────────────────────────────────────
// Volunteer Shift Emails
// ──────────────────────────────────────────

function formatSlotTime(start: Date, end: Date): string {
  const dateStr = start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dateStr}, ${startTime} — ${endTime}`;
}

export async function sendShiftSignupConfirmationEmail(
  email: string,
  volunteerName: string,
  shiftTitle: string,
  eventName: string,
  orgName: string,
  slotStart: Date,
  slotEnd: Date,
  orgSlug: string
) {
  const baseUrl = getBaseUrl();
  const volunteerUrl = `${baseUrl}/volunteer/${orgSlug}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";

  await resend.emails.send({
    from: `Volntir <${fromEmail}>`,
    to: email,
    subject: `Shift confirmed: ${shiftTitle} — ${eventName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">You're Confirmed!</h1>
        </div>
        <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
          Hi ${volunteerName}, you're signed up for a shift at <strong>${eventName}</strong> hosted by <strong>${orgName}</strong>.
        </p>
        <div style="background-color: #F3F4F6; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">Shift</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">${shiftTitle}</p>
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">When</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${formatSlotTime(slotStart, slotEnd)}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${volunteerUrl}" style="display: inline-block; background-color: #ea580c; color: white; font-weight: 600; font-size: 15px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
            View My Shifts
          </a>
        </div>
        <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5;">
          You can manage your shifts at any time by visiting the volunteer page.
        </p>
      </div>
    `,
  });
}

export async function sendWaitlistNotificationEmail(
  email: string,
  volunteerName: string,
  shiftTitle: string,
  eventName: string,
  orgName: string,
  slotStart: Date,
  slotEnd: Date,
  orgSlug: string
) {
  const baseUrl = getBaseUrl();
  const volunteerUrl = `${baseUrl}/volunteer/${orgSlug}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";

  await resend.emails.send({
    from: `Volntir <${fromEmail}>`,
    to: email,
    subject: `Waitlisted: ${shiftTitle} — ${eventName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">You're on the Waitlist</h1>
        </div>
        <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
          Hi ${volunteerName}, the shift is currently full, but you've been added to the waitlist for <strong>${eventName}</strong> hosted by <strong>${orgName}</strong>. We'll notify you if a spot opens up.
        </p>
        <div style="background-color: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">Shift</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">${shiftTitle}</p>
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">When</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${formatSlotTime(slotStart, slotEnd)}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${volunteerUrl}" style="display: inline-block; background-color: #ea580c; color: white; font-weight: 600; font-size: 15px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
            View My Shifts
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendWaitlistPromotionEmail(
  email: string,
  volunteerName: string,
  shiftTitle: string,
  eventName: string,
  orgName: string,
  slotStart: Date,
  slotEnd: Date,
  orgSlug: string
) {
  const baseUrl = getBaseUrl();
  const volunteerUrl = `${baseUrl}/volunteer/${orgSlug}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";

  await resend.emails.send({
    from: `Volntir <${fromEmail}>`,
    to: email,
    subject: `You're in! ${shiftTitle} — ${eventName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">A Spot Opened Up!</h1>
        </div>
        <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
          Great news, ${volunteerName}! A spot opened up and you've been confirmed for a shift at <strong>${eventName}</strong> hosted by <strong>${orgName}</strong>.
        </p>
        <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">Shift</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">${shiftTitle}</p>
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">When</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${formatSlotTime(slotStart, slotEnd)}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${volunteerUrl}" style="display: inline-block; background-color: #ea580c; color: white; font-weight: 600; font-size: 15px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
            View My Shifts
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendShiftCancellationEmail(
  email: string,
  volunteerName: string,
  shiftTitle: string,
  eventName: string,
  orgName: string,
  slotStart: Date,
  slotEnd: Date,
  orgSlug: string
) {
  const baseUrl = getBaseUrl();
  const volunteerUrl = `${baseUrl}/volunteer/${orgSlug}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";

  await resend.emails.send({
    from: `Volntir <${fromEmail}>`,
    to: email,
    subject: `Shift cancelled: ${shiftTitle} — ${eventName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">Shift Cancelled</h1>
        </div>
        <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
          Hi ${volunteerName}, a shift you were signed up for at <strong>${eventName}</strong> hosted by <strong>${orgName}</strong> has been cancelled by the organizer.
        </p>
        <div style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">Shift</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">${shiftTitle}</p>
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">Was scheduled for</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${formatSlotTime(slotStart, slotEnd)}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${volunteerUrl}" style="display: inline-block; background-color: #ea580c; color: white; font-weight: 600; font-size: 15px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
            Browse Available Shifts
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendWaiverConfirmationEmail(
  email: string,
  firstName: string,
  eventName: string,
  orgName: string,
  signedAt: Date,
  familyMemberCount: number,
  isGuest: boolean = false,
  waiverContentSnapshot?: string,
  familyMembersDetail?: { firstName: string; lastName: string; relationship: string }[]
) {
  const baseUrl = getBaseUrl();
  const dashboardUrl = `${baseUrl}/dashboard`;
  const signupUrl = `${baseUrl}/auth/signup`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";

  const familyLine = familyMemberCount > 0
    ? `<p style="color: #4B5563; font-size: 15px; line-height: 1.6;">You also registered <strong>${familyMemberCount} family member${familyMemberCount > 1 ? "s" : ""}</strong>.</p>`
    : "";

  const familyDetailSection = familyMembersDetail && familyMembersDetail.length > 0
    ? `<div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="color: #6B7280; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">Family Members Covered</p>
        ${familyMembersDetail.map((fm) => `<p style="color: #111827; font-size: 14px; margin: 4px 0;">Signed as ${fm.relationship} of ${fm.firstName} ${fm.lastName}</p>`).join("")}
      </div>`
    : "";

  const waiverCopySection = waiverContentSnapshot
    ? `<div style="margin: 24px 0;">
        <p style="color: #6B7280; font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">Your Signed Waiver</p>
        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; max-height: 400px; overflow: auto; font-size: 13px; color: #374151; line-height: 1.6;">
          ${waiverContentSnapshot}
        </div>
        <p style="color: #9CA3AF; font-size: 12px; margin: 8px 0 0 0;">This is a copy of the waiver you signed. Keep this email for your records.</p>
      </div>`
    : "";

  await resend.emails.send({
    from: `Volntir <${fromEmail}>`,
    to: email,
    subject: `Waiver signed: ${eventName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">Waiver Confirmed</h1>
        </div>
        <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
          Hi ${firstName}, your waiver for <strong>${eventName}</strong> hosted by <strong>${orgName}</strong> has been signed successfully.
        </p>
        ${familyLine}
        ${familyDetailSection}
        <div style="background-color: #F3F4F6; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">Signed on</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${signedAt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        ${waiverCopySection}
        ${isGuest ? `
        <div style="background-color: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="color: #9A3412; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">Want to view your waiver anytime?</p>
          <a href="${signupUrl}" style="display: inline-block; background-color: #ea580c; color: white; font-weight: 600; font-size: 14px; padding: 10px 24px; border-radius: 8px; text-decoration: none;">
            Create a Free Account
          </a>
        </div>
        ` : `
        <div style="text-align: center; margin: 32px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; background-color: #ea580c; color: white; font-weight: 600; font-size: 15px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
            View in Dashboard
          </a>
        </div>
        `}
        <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5;">
          This is a confirmation that your liability waiver was submitted. Keep this email for your records.
        </p>
        ${!isGuest ? `
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
        <p style="color: #9CA3AF; font-size: 12px;">
          If the button doesn't work, copy and paste this URL into your browser:<br />
          <a href="${dashboardUrl}" style="color: #ea580c; word-break: break-all;">${dashboardUrl}</a>
        </p>
        ` : ""}
      </div>
    `,
  });
}
