import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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
