import { Suspense } from "react";
import Link from "next/link";

function ThankYouContent({ searchParams }: { searchParams: { name?: string; count?: string } }) {
  const name = searchParams.name || "Participant";
  const familyCount = parseInt(searchParams.count || "0");

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Thank You, {name}!
          </h1>

          <p className="text-gray-600 mb-2">
            Your waiver has been successfully submitted and signed.
          </p>

          {familyCount > 0 && (
            <p className="text-gray-600 mb-4">
              Your waiver covers you and{" "}
              <strong>
                {familyCount} family member{familyCount > 1 ? "s" : ""}
              </strong>
              .
            </p>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-green-800 font-medium">
              Enjoy the Candlelight Snowshoe!
            </p>
            <p className="text-xs text-green-600 mt-1">
              Please check in with event staff when you arrive.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block mt-8 text-sm text-green-700 hover:text-green-800 underline"
          >
            Submit another waiver
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Iron County Trail Club &middot; Building single track trails for quiet sports
        </p>
      </div>
    </main>
  );
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; count?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ThankYouContent searchParams={params} />
    </Suspense>
  );
}
