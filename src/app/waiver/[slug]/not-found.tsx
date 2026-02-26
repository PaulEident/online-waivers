import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            This event doesn&apos;t exist, is no longer active, or has already
            passed.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors"
          >
            View Upcoming Events
          </Link>
        </div>
      </div>
    </main>
  );
}
