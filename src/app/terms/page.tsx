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
        <p className="text-sm text-gray-400 mb-10">Last updated: March 12, 2026</p>

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
              <li>The legal adequacy, accuracy, and completeness of all waiver content you create or upload to the Service.</li>
              <li>Managing access to your organization&apos;s data appropriately.</li>
              <li>Complying with applicable data protection and privacy laws regarding the personal information you collect through waivers.</li>
              <li>The safe and lawful operation of any events, activities, or programs associated with waivers collected through the Service.</li>
            </ul>
            <p className="mt-3">
              Volntir provides the technology platform for waiver collection but does not provide legal advice.
              We make no guarantees about the legal enforceability of any waiver created using the Service.
            </p>
            <p className="mt-3">
              Organizations agree to indemnify and hold harmless Volntir from any and all claims, damages, losses,
              liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from or related to
              (a) the content of waivers created by the organization, (b) the organization&apos;s event operations or
              activities, or (c) any third-party claims that the organization&apos;s waiver content is insufficient,
              unenforceable, or otherwise deficient.
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
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Waiver Enforceability Disclaimer</h2>
            <p>
              Volntir does not guarantee that waivers created or signed through the platform will be legally
              enforceable in any jurisdiction. The enforceability of liability waivers varies by jurisdiction and
              depends on many factors outside of Volntir&apos;s control, including the specific language used, the
              circumstances of signing, and applicable local laws. Organizations are solely responsible for ensuring
              their waiver content meets applicable legal requirements. Volntir strongly recommends that organizations
              consult with qualified legal counsel regarding the adequacy of their waiver language.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Volunteer Hour Records</h2>
            <p className="mb-3">
              Volntir may provide features for tracking and recording volunteer hours, including hours contributed
              by individuals for community service, court-ordered requirements, or other purposes. You acknowledge
              and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Volunteer hour records maintained through Volntir are provided for organizational convenience only.</li>
              <li>Organizations bear sole responsibility for the accuracy, completeness, and sufficiency of all volunteer hour records.</li>
              <li>Volntir does not verify, validate, or certify the accuracy of any volunteer hour entries.</li>
              <li>Volntir does not represent or warrant that its records constitute official documentation for any court, government agency, probation office, school, or other institution.</li>
              <li>Volntir shall not be liable for any consequences arising from the use, reliance upon, or submission of volunteer hour records generated through the Service.</li>
            </ul>
            <p className="mt-3">
              Organizations and individuals who require official documentation of volunteer hours for legal proceedings,
              court-ordered community service, or government reporting should independently verify and certify such records
              through appropriate channels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Intellectual Property</h2>
            <p>
              The Volntir platform, including its design, code, logos, and documentation, is owned by Volntir
              and protected by intellectual property laws. You may not copy, modify, or create derivative works
              of the Service without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              either express or implied. During the beta period especially, we do not guarantee that the Service will
              be uninterrupted, error-free, or that any defects will be corrected. We do not warrant the legal
              enforceability of waivers created using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Limitation of Liability</h2>
            <p className="mb-3">
              To the maximum extent permitted by law, Volntir shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including but not limited to loss of data, loss of
              profits, or damages arising from the use or inability to use the Service.
            </p>
            <p>
              Volntir&apos;s total aggregate liability for any and all claims arising out of or related to these
              Terms or your use of the Service shall not exceed the greater of (a) the total amounts paid by you
              to Volntir in the twelve (12) months immediately preceding the event giving rise to the claim, or
              (b) zero dollars ($0) during any period in which the Service is provided free of charge. This
              limitation applies regardless of the form of action, whether in contract, tort, strict liability,
              or otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">13. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Volntir, its officers, directors, employees, agents,
              and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses
              (including reasonable attorneys&apos; fees and court costs) arising out of or related to: (a) your use
              of the Service; (b) your violation of these Terms; (c) your violation of any applicable law or
              regulation; (d) any content you submit, post, or transmit through the Service, including waiver
              templates and event information; (e) any claim by a third party related to your events, activities,
              or operations; or (f) the inadequacy or unenforceability of any waiver content you create through the
              Service. This indemnification obligation shall survive the termination of your account and these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">14. Data Deletion Rights</h2>
            <p className="mb-3">
              Users and organizations may request deletion of their data by contacting Volntir through our{" "}
              <Link href="/support" className="text-brand font-medium hover:underline">support page</Link>.
              Upon receiving a verified deletion request, Volntir will delete or anonymize the applicable data
              within a reasonable timeframe, subject to the following:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Signed waiver records may be subject to legal retention requirements and may be retained for a period necessary to comply with applicable laws, resolve disputes, or enforce agreements.</li>
              <li>Volntir may retain anonymized or aggregated data that no longer identifies individual users.</li>
              <li>Organizations are responsible for maintaining their own records of waiver data before requesting deletion, as deleted data cannot be recovered.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">15. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time for violation
              of these terms or for any other reason at our discretion. You may stop using the Service at any time.
              Upon termination, your right to use the Service ceases, but provisions that by their nature should
              survive termination will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">16. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms of Service and any disputes arising out of or related to these Terms or the Service shall
              be governed by and construed in accordance with the laws of the State of Oregon, USA, without regard
              to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be
              brought exclusively in the state or federal courts located in the State of Oregon, and you hereby
              consent to the personal jurisdiction and venue of such courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">17. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Changes will be posted on this page with an updated revision
              date. Your continued use of the Service after changes are posted constitutes acceptance of the
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">18. Contact Us</h2>
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
