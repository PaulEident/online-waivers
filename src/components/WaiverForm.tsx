"use client";

import { useState, useCallback } from "react";
import SignaturePad from "./SignaturePad";
import FamilyMembers, { FamilyMember } from "./FamilyMembers";
import WaiverText from "./WaiverText";
import { submitWaiver } from "@/lib/actions";

interface WaiverFormProps {
  eventId: string;
  eventSlug: string;
  eventName: string;
}

export default function WaiverForm({ eventId, eventSlug, eventName }: WaiverFormProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [signatureType, setSignatureType] = useState<"draw" | "type">("draw");
  const [signatureData, setSignatureData] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [mailchimpOptIn, setMailchimpOptIn] = useState(false);
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

    // Validate required fields
    if (!firstName.trim()) validationErrors.push("First name is required");
    if (!lastName.trim()) validationErrors.push("Last name is required");
    if (!email.trim()) validationErrors.push("Email is required");
    if (!dateOfBirth) validationErrors.push("Date of birth is required");
    if (!emergencyContactName.trim()) validationErrors.push("Emergency contact name is required");
    if (!emergencyContactPhone.trim()) validationErrors.push("Emergency contact phone is required");

    // Validate age (must be 18+)
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        validationErrors.push("You must be 18 or older to sign this waiver. A parent or legal guardian must complete the form.");
      }
    }

    // Validate family members
    for (let i = 0; i < familyMembers.length; i++) {
      const fm = familyMembers[i];
      if (!fm.firstName.trim()) validationErrors.push(`Child #${i + 1}: First name is required`);
      if (!fm.lastName.trim()) validationErrors.push(`Child #${i + 1}: Last name is required`);
      if (!fm.age) validationErrors.push(`Child #${i + 1}: Age is required`);
      const age = parseInt(fm.age);
      if (fm.age && (isNaN(age) || age < 0 || age >= 18)) {
        validationErrors.push(`Child #${i + 1}: Age must be between 0 and 17`);
      }
    }

    // Validate signature
    if (!signatureData) {
      validationErrors.push("Signature is required");
    }

    // Validate agreement
    if (!agreed) {
      validationErrors.push("You must agree to the waiver terms");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await submitWaiver({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone?.trim() || undefined,
        dateOfBirth,
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        signatureType,
        signatureData,
        mailchimpOptIn,
        eventId,
        eventSlug,
        familyMembers: familyMembers.map((fm) => ({
          firstName: fm.firstName.trim(),
          lastName: fm.lastName.trim(),
          age: parseInt(fm.age),
        })),
      });
    } catch {
      setErrors(["An error occurred submitting the waiver. Please try again."]);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-sm text-red-700">
                {error}
              </li>
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
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            You must be 18 or older to sign this waiver
          </p>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Emergency Contact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emergencyContactName" className="block text-sm font-semibold text-gray-700 mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="emergencyContactName"
              name="emergencyContactName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="emergencyContactPhone" className="block text-sm font-semibold text-gray-700 mb-1">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </section>

      {/* Family Members */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Family Members
        </h2>
        <FamilyMembers members={familyMembers} onChange={setFamilyMembers} />
      </section>

      {/* Waiver Text */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Liability Waiver
        </h2>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
          <WaiverText eventName={eventName} />
        </div>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreed"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
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
      </section>

      {/* Signature */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Signature
        </h2>
        <SignaturePad onSignatureChange={handleSignatureChange} />
      </section>

      {/* Mailchimp Opt-in */}
      <section>
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <input
            type="checkbox"
            id="mailchimpOptIn"
            checked={mailchimpOptIn}
            onChange={(e) => setMailchimpOptIn(e.target.checked)}
            className="mt-1 h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="mailchimpOptIn" className="text-sm text-gray-700">
            <span className="font-semibold">Join the Iron County Trail Club mailing list</span>
            <br />
            <span className="text-gray-500">
              Stay updated on trail conditions, events, and volunteer opportunities.
            </span>
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 px-6 bg-green-700 text-white text-lg font-bold rounded-lg hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
