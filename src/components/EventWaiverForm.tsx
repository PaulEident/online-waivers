"use client";

import { useState, useCallback } from "react";
import SignaturePad from "./SignaturePad";
import FamilyMembers, { FamilyMember } from "./FamilyMembers";
import { submitWaiver } from "@/lib/actions";

interface EventWaiverFormProps {
  eventId: string;
  renderedTemplate: string;
  orgName: string;
  showMailchimpOptIn?: boolean;
  isGuest?: boolean;
  showVolntirOptIn?: boolean;
}

export default function EventWaiverForm({ eventId, renderedTemplate, orgName, showMailchimpOptIn = false, isGuest = false, showVolntirOptIn = false }: EventWaiverFormProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [signatureType, setSignatureType] = useState<"draw" | "type">("draw");
  const [signatureData, setSignatureData] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [electronicConsent, setElectronicConsent] = useState(false);
  const [mailchimpOptIn, setMailchimpOptIn] = useState(false);
  const [volntirMarketingOptIn, setVolntirMarketingOptIn] = useState(true);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [volunteerHours, setVolunteerHours] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSignatureChange = useCallback(
    (type: "draw" | "type", data: string) => {
      setSignatureType(type);
      setSignatureData(data);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const validationErrors: string[] = [];

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const emergencyContactName = formData.get("emergencyContactName") as string;
    const emergencyContactPhone = formData.get("emergencyContactPhone") as string;

    if (!firstName.trim()) validationErrors.push("First name is required");
    if (!lastName.trim()) validationErrors.push("Last name is required");
    if (!email.trim()) validationErrors.push("Email is required");
    if (!dateOfBirth) validationErrors.push("Date of birth is required");
    if (!emergencyContactName.trim()) validationErrors.push("Emergency contact name is required");
    if (!emergencyContactPhone.trim()) validationErrors.push("Emergency contact phone is required");

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 18) {
        validationErrors.push("You must be 18 or older to sign this waiver.");
      }
    }

    for (let i = 0; i < familyMembers.length; i++) {
      const fm = familyMembers[i];
      if (!fm.firstName.trim()) validationErrors.push(`Child #${i + 1}: First name is required`);
      if (!fm.lastName.trim()) validationErrors.push(`Child #${i + 1}: Last name is required`);
      const age = parseInt(fm.age);
      if (!fm.age || isNaN(age) || age < 0 || age >= 18) {
        validationErrors.push(`Child #${i + 1}: Age must be between 0 and 17`);
      }
      if (!fm.relationship) validationErrors.push(`Child #${i + 1}: Relationship is required`);
      if (fm.relationship === "Other" && !fm.relationshipOther?.trim()) {
        validationErrors.push(`Child #${i + 1}: Please specify your relationship`);
      }
    }

    if (!signatureData) validationErrors.push("Signature is required");
    if (!agreed) validationErrors.push("You must agree to the waiver terms");
    if (!electronicConsent) validationErrors.push("You must consent to sign electronically");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const result = await submitWaiver({
        eventId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone?.trim() || undefined,
        dateOfBirth,
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        signatureType,
        signatureData,
        electronicConsent,
        waiverContentSnapshot: renderedTemplate,
        mailchimpOptIn,
        isVolunteer,
        volunteerHours: isVolunteer && volunteerHours ? parseFloat(volunteerHours) : undefined,
        volntirMarketingOptIn: showVolntirOptIn ? volntirMarketingOptIn : undefined,
        familyMembers: familyMembers.map((fm) => ({
          firstName: fm.firstName.trim(),
          lastName: fm.lastName.trim(),
          age: parseInt(fm.age),
          relationship: fm.relationship,
          relationshipOther: fm.relationship === "Other" ? fm.relationshipOther?.trim() : undefined,
        })),
      });
      if (result && "error" in result) {
        setErrors([result.error]);
        setSubmitting(false);
      }
    } catch {
      // redirect throws, so this is fine
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isGuest && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-amber-800">
              You&apos;re signing as a guest. You won&apos;t be able to view this waiver later.{" "}
              <a href="/auth/signup" className="text-brand hover:text-brand-hover font-medium underline">
                Create a free account
              </a>{" "}
              to save your waivers.
            </p>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-sm text-red-700">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Participant Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Participant Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="firstName" name="firstName" required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="lastName" name="lastName" required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input type="email" id="email" name="email" required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
            <input type="tel" id="phone" name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" />
          </div>
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" />
          <p className="text-xs text-gray-500 mt-1">You must be 18 or older to sign this waiver</p>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Emergency Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emergencyContactName" className="block text-sm font-semibold text-gray-700 mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="emergencyContactName" name="emergencyContactName" required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" />
          </div>
          <div>
            <label htmlFor="emergencyContactPhone" className="block text-sm font-semibold text-gray-700 mb-1">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <input type="tel" id="emergencyContactPhone" name="emergencyContactPhone" required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand" />
          </div>
        </div>
      </section>

      {/* Family Members */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Family Members</h2>
        <FamilyMembers members={familyMembers} onChange={setFamilyMembers} />
      </section>

      {/* Waiver Text */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Liability Waiver</h2>
        <div
          className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedTemplate }}
        />
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreed"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-5 w-5 text-brand border-gray-300 rounded focus:ring-brand"
          />
          <label htmlFor="agreed" className="text-sm text-gray-700">
            <span className="font-semibold">
              I have read, understand, and agree to the terms of this Release and Waiver of
              Liability, Assumption of Risk, and Indemnity Agreement.
            </span>{" "}
            {familyMembers.length > 0 && (
              <span>
                I also certify that I am the parent or legal guardian of the minor(s) listed above
                and accept responsibility for their participation.
              </span>
            )}
            <span className="text-red-500"> *</span>
          </label>
        </div>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="electronicConsent"
            checked={electronicConsent}
            onChange={(e) => setElectronicConsent(e.target.checked)}
            className="mt-1 h-5 w-5 text-brand border-gray-300 rounded focus:ring-brand"
          />
          <label htmlFor="electronicConsent" className="text-sm text-gray-700">
            <span className="font-semibold">
              I consent to sign this waiver electronically.
            </span>{" "}
            I understand that my electronic signature has the same legal effect as a handwritten signature.
            <span className="text-red-500"> *</span>
          </label>
        </div>
      </section>

      {/* Signature */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Signature</h2>
        <SignaturePad onSignatureChange={handleSignatureChange} />
      </section>

      {/* Volunteer */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Volunteering</h2>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="isVolunteer"
            checked={isVolunteer}
            onChange={(e) => setIsVolunteer(e.target.checked)}
            className="mt-1 h-5 w-5 text-brand border-gray-300 rounded focus:ring-brand"
          />
          <label htmlFor="isVolunteer" className="text-sm text-gray-700">
            <span className="font-semibold">I&apos;m volunteering for this event</span>
            <br />
            <span className="text-gray-500">Check this if you are volunteering, so we can track your hours.</span>
          </label>
        </div>
        {isVolunteer && (
          <div className="ml-8">
            <label htmlFor="volunteerHours" className="block text-sm font-semibold text-gray-700 mb-1">
              Expected Volunteer Hours
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="volunteerHours"
                min="0.5"
                step="0.5"
                value={volunteerHours}
                onChange={(e) => setVolunteerHours(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">hours</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Your hours will be verified by the event organizer.</p>
            <p className="text-xs text-gray-400 mt-1">
              Volntir records are for organizational tracking only. Courts and supervising agencies determine what constitutes valid documentation for compliance purposes.
            </p>
          </div>
        )}
      </section>

      {/* Mailchimp Opt-in */}
      {showMailchimpOptIn && (
        <section>
          <div className="flex items-start gap-3 p-4 bg-brand-light border border-orange-200 rounded-lg">
            <input
              type="checkbox"
              id="mailchimpOptIn"
              checked={mailchimpOptIn}
              onChange={(e) => setMailchimpOptIn(e.target.checked)}
              className="mt-1 h-5 w-5 text-brand border-gray-300 rounded focus:ring-brand"
            />
            <label htmlFor="mailchimpOptIn" className="text-sm text-gray-700">
              <span className="font-semibold">Join the {orgName} mailing list</span>
              <br />
              <span className="text-gray-500">Stay updated on events and volunteer opportunities.</span>
            </label>
          </div>
        </section>
      )}

      {/* Volntir Marketing Opt-in */}
      {showVolntirOptIn && (
        <section>
          <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              id="volntirMarketingOptIn"
              checked={volntirMarketingOptIn}
              onChange={(e) => setVolntirMarketingOptIn(e.target.checked)}
              className="mt-1 h-5 w-5 text-brand border-gray-300 rounded focus:ring-brand"
            />
            <label htmlFor="volntirMarketingOptIn" className="text-sm text-gray-700">
              <span className="font-semibold">Get occasional updates from Volntir</span>
              <br />
              <span className="text-gray-500">New features and volunteer opportunities. We email infrequently and never share your information.</span>
            </label>
          </div>
        </section>
      )}

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 px-6 bg-brand text-white text-lg font-bold rounded-lg hover:bg-brand-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting..." : "Sign Waiver & Submit"}
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          By clicking submit, you are electronically signing this waiver on{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          .
        </p>
      </div>
    </form>
  );
}
