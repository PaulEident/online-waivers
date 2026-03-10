"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupportTicket, getFeatureRequest, updateSubmissionStatus } from "@/lib/actions";
import Link from "next/link";

type Submission = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subject?: string;
  message?: string;
  category?: string;
  feature?: string;
  problem?: string | null;
};

export default function SubmissionDetailPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = type === "support"
        ? await getSupportTicket(id)
        : await getFeatureRequest(id);
      setSubmission(data as Submission | null);
      setLoading(false);
    }
    load();
  }, [type, id]);

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    await updateSubmissionStatus(
      type as "support" | "feature",
      id,
      newStatus as "NEW" | "IN_PROGRESS" | "RESOLVED"
    );
    setSubmission((prev) => prev ? { ...prev, status: newStatus } : prev);
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!submission) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Submission not found.</p>
          <Link href="/admin/super/submissions" className="text-brand hover:underline">
            Back to Submissions
          </Link>
        </div>
      </main>
    );
  }

  const isSupport = type === "support";

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">
            {isSupport ? "Support Ticket" : "Feature Request"}
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            From {submission.name} &middot; {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Status</h2>
          <div className="flex items-center gap-3">
            <select
              value={submission.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={saving}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-brand focus:border-brand disabled:opacity-50"
            >
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            {saving && <span className="text-sm text-gray-500">Saving...</span>}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Name</div>
              <div className="text-gray-900">{submission.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Email</div>
              <a href={`mailto:${submission.email}`} className="text-brand hover:underline">
                {submission.email}
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isSupport ? "Message" : "Request Details"}
          </h2>

          {isSupport ? (
            <>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Subject</div>
                <div className="text-gray-900">{submission.subject}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Message</div>
                <div className="text-gray-900 whitespace-pre-wrap">{submission.message}</div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Category</div>
                <div className="text-gray-900">{submission.category}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Feature</div>
                <div className="text-gray-900 whitespace-pre-wrap">{submission.feature}</div>
              </div>
              {submission.problem && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Problem / Use Case</div>
                  <div className="text-gray-900 whitespace-pre-wrap">{submission.problem}</div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/super/submissions?tab=${type}`}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            &larr; Back to Submissions
          </Link>
          <a
            href={`mailto:${submission.email}?subject=Re: ${isSupport ? submission.subject : `Feature Request: ${submission.category}`}`}
            className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </main>
  );
}
