import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Volntir",
  description: "Volntir privacy policy. Learn how we collect, use, and protect your personal information when using our digital waiver management platform.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: March 12, 2026</p>

        <div className="space-y-8 text-gray-700 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              When you use Volntir, we collect information you provide directly:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Account information:</strong> name, email address, and password (or Google OAuth credentials).</li>
              <li><strong>Waiver information:</strong> name, date of birth, phone number, emergency contact, and electronic signature.</li>
              <li><strong>Family member information:</strong> names and dates of birth of minors added to a waiver.</li>
              <li><strong>Device information:</strong> IP address and user agent string, recorded at the time of waiver signing for legal validity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>To create and manage your account.</li>
              <li>To process and store signed liability waivers.</li>
              <li>To facilitate event check-in for organizers.</li>
              <li>To send transactional emails related to your account (e.g., password reset).</li>
              <li>To respond to support requests you submit through our contact form.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Sharing</h2>
            <p className="mb-3">
              We do not sell your personal information. We share data only in these circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>With event organizers:</strong> When you sign a waiver for an event, the organization running that event can view your waiver details.</li>
              <li><strong>Service providers:</strong> We use third-party services to host and operate Volntir (e.g., Vercel for hosting, Neon for database). These providers process data on our behalf under strict agreements.</li>
              <li><strong>Legal requirements:</strong> We may disclose information if required by law or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
            <p>
              Volntir uses only essential cookies required for authentication and session management. We do not use
              tracking, analytics, or advertising cookies. The cookies we set are:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li><strong>Session cookie:</strong> Keeps you signed in while you use the app.</li>
              <li><strong>CSRF token:</strong> Protects against cross-site request forgery attacks.</li>
              <li><strong>Cookie consent:</strong> Remembers that you acknowledged this policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Security</h2>
            <p>
              We protect your data with industry-standard security measures including encrypted connections (HTTPS),
              hashed passwords (bcrypt), bot protection (Cloudflare Turnstile), and input sanitization to prevent
              cross-site scripting attacks. Database access is restricted and encrypted in transit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p className="mb-3">
              We retain different categories of data for different periods based on legal requirements and operational needs:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Signed waivers:</strong> Retained for the duration specified by the organizing entity, or a minimum retention period of 3 years after the event date, whichever is longer.</li>
              <li><strong>Account data:</strong> Retained while your account is active and for 30 days following a deletion request, after which it is permanently removed.</li>
              <li><strong>Volunteer time tracking records:</strong> Retained for the same period as the associated waiver and event data.</li>
              <li><strong>Device and usage data:</strong> Retained alongside the waiver record it is associated with.</li>
            </ul>
            <p className="mt-3">
              Event organizers may request deletion of their event data at any time. Individual participant data may be retained beyond an organizer&apos;s deletion request if required by applicable law or ongoing legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data (subject to legal retention requirements for waivers).</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
            <p className="mb-3">
              Volntir is committed to protecting the privacy of children in compliance with the Children&apos;s Online Privacy Protection Act (COPPA) and similar regulations.
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Volntir does not knowingly collect personal information directly from children under 13.</li>
              <li>Minor participant data (such as name and age) is collected only through parent or legal guardian submissions during the waiver signing process.</li>
              <li>No accounts are created for minor participants. All minor data is attributed to and managed under the parent or guardian&apos;s record.</li>
              <li>We do not send emails, notifications, or any other communications directly to minor participants.</li>
              <li>Parents or legal guardians may request access to, correction of, or deletion of their child&apos;s participant data at any time by contacting us at <a href="mailto:privacy@volntir.com" className="text-brand font-medium hover:underline">privacy@volntir.com</a>.</li>
            </ul>
            <p className="mt-3">
              If we become aware that we have inadvertently collected personal information directly from a child under 13 without verified parental consent, we will take steps to delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. California Privacy Rights (CCPA)</h2>
            <p className="mb-3">
              If you are a California resident, the California Consumer Privacy Act (CCPA) provides you with additional rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Right to know:</strong> You have the right to request information about the categories and specific pieces of personal information we have collected, the purposes for collection, and any third parties with whom it has been shared.</li>
              <li><strong>Right to delete:</strong> You have the right to request deletion of your personal information, subject to certain legal exceptions (such as waiver records required for legal compliance).</li>
              <li><strong>Right to opt out of sale:</strong> Volntir does not sell personal information to third parties. We have not sold personal information in the preceding 12 months.</li>
              <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights. You will not receive different pricing, service quality, or access as a result of exercising your privacy rights.</li>
            </ul>
            <p className="mt-3 mb-3">
              <strong>Categories of information collected:</strong> Identifiers (name, email address, IP address), contact information (phone number, emergency contact), signature data (electronic signatures and timestamps), and device/usage data (user agent, IP address at time of signing).
            </p>
            <p>
              To submit a verifiable consumer request under the CCPA, contact us at <a href="mailto:privacy@volntir.com" className="text-brand font-medium hover:underline">privacy@volntir.com</a>. We will verify your identity before processing your request and respond within 45 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Data Breach Notification</h2>
            <p className="mb-3">
              Volntir is committed to the security of your personal information. In the event of a data breach that compromises personal information, we will notify affected users within 72 hours of confirming the breach.
            </p>
            <p className="mb-3">
              Breach notifications will include:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>A description of the nature and scope of the breach.</li>
              <li>The types of personal data affected.</li>
              <li>The steps we are taking to address the breach and mitigate its effects.</li>
              <li>Recommended actions you can take to protect yourself.</li>
              <li>Contact information for follow-up questions.</li>
            </ul>
            <p className="mt-3">
              We will also notify relevant regulatory authorities as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page with an
              updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or your data, please{" "}
              <Link href="/support" className="text-brand font-medium hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
