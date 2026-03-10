import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - Volntir",
  description: "Volntir terms of service. Read about the terms and conditions for using our digital waiver management platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: March 10, 2026</p>

        <div className="space-y-8 text-gray-700 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Volntir (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, do not use the Service. We may update these terms from time to time,
              and continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              Volntir is a digital waiver management platform that allows organizations to create events, collect
              electronic liability waivers, and manage attendee check-in. The Service is currently in beta and
              provided free of charge. Features, availability, and pricing may change as the platform evolves.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="mb-3">
              You must create an account to use most features of the Service. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Providing accurate and complete information when creating your account.</li>
              <li>Maintaining the security of your login credentials.</li>
              <li>All activity that occurs under your account.</li>
              <li>Notifying us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Organization Responsibilities</h2>
            <p className="mb-3">
              If you create or manage an organization on Volntir, you are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Ensuring your waiver templates comply with applicable laws in your jurisdiction.</li>
              <li>Obtaining appropriate legal counsel regarding the content and enforceability of your waivers.</li>
              <li>Managing access to your organization&apos;s data appropriately.</li>
              <li>Complying with applicable data protection and privacy laws regarding the personal information you collect through waivers.</li>
            </ul>
            <p className="mt-3">
              Volntir provides the technology platform for waiver collection but does not provide legal advice.
              We make no guarantees about the legal enforceability of any waiver created using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. User Content</h2>
            <p className="mb-3">
              You retain ownership of all content you submit to the Service, including waiver templates,
              organization information, and event details. By using the Service, you grant Volntir a limited
              license to store, display, and process your content solely for the purpose of providing the Service.
            </p>
            <p>
              Waiver data — including signatures, personal information, and family member details — is stored
              securely and only shared with the relevant event organization as described in our{" "}
              <Link href="/privacy" className="text-brand font-medium hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Submit false, misleading, or fraudulent information.</li>
              <li>Attempt to gain unauthorized access to the Service or other users&apos; accounts.</li>
              <li>Interfere with or disrupt the Service or its infrastructure.</li>
              <li>Use automated tools to scrape, harvest, or collect data from the Service.</li>
              <li>Resell or redistribute the Service without our written consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Electronic Signatures</h2>
            <p>
              The Service allows users to provide electronic signatures on liability waivers. By signing a waiver
              electronically through Volntir, you acknowledge that your electronic signature is intended to have the
              same legal effect as a handwritten signature. Volntir records the date, time, IP address, and device
              information at the time of signing to support the validity of electronic signatures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>
              The Volntir platform, including its design, code, logos, and documentation, is owned by Volntir
              and protected by intellectual property laws. You may not copy, modify, or create derivative works
              of the Service without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              either express or implied. During the beta period especially, we do not guarantee that the Service will
              be uninterrupted, error-free, or that any defects will be corrected. We do not warrant the legal
              enforceability of waivers created using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Volntir shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not limited to loss of data, loss of
              profits, or damages arising from the use or inability to use the Service. Our total liability for
              any claim arising from the Service shall not exceed the amount you paid to use the Service (if any).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time for violation
              of these terms or for any other reason at our discretion. You may stop using the Service at any time.
              Upon termination, your right to use the Service ceases, but provisions that by their nature should
              survive termination will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Changes will be posted on this page with an updated revision
              date. Your continued use of the Service after changes are posted constitutes acceptance of the
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please{" "}
              <Link href="/support" className="text-brand font-medium hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
