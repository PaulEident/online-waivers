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

export async function sendWaiverConfirmationEmail(
  email: string,
  firstName: string,
  eventName: string,
  orgName: string,
  signedAt: Date,
  familyMemberCount: number,
  isGuest: boolean = false
) {
  const baseUrl = getBaseUrl();
  const dashboardUrl = `${baseUrl}/dashboard`;
  const signupUrl = `${baseUrl}/auth/signup`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@volntir.com";

  const familyLine = familyMemberCount > 0
    ? `<p style="color: #4B5563; font-size: 15px; line-height: 1.6;">You also registered <strong>${familyMemberCount} family member${familyMemberCount > 1 ? "s" : ""}</strong>.</p>`
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
        <div style="background-color: #F3F4F6; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="color: #6B7280; font-size: 13px; margin: 0 0 4px 0;">Signed on</p>
          <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${signedAt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
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
