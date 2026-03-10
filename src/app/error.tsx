"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-gray-300 mb-4">500</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-hover transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
