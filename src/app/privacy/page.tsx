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
        <p className="text-sm text-gray-400 mb-10">Last updated: March 8, 2026</p>

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
            <p>
              We retain your account data for as long as your account is active. Signed waivers are retained
              as long as the organizing entity requires them for legal purposes. You may request deletion of your
              account and associated data by contacting us.
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
            <p>
              Volntir is not intended for use by children under 13. Minor children may be listed on a waiver by
              their parent or legal guardian, but they do not create their own accounts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page with an
              updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
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
