import WaiverForm from "@/components/WaiverForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Iron County Trail Club
          </h1>
          <div className="text-green-200 text-lg md:text-xl font-medium">
            Candlelight Snowshoe
          </div>
          <div className="text-green-300 text-sm mt-2">
            Liability Waiver &amp; Release Form
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <p className="text-sm text-gray-600 mb-6">
            Please complete all required fields (<span className="text-red-500">*</span>) and sign
            below. One waiver per adult — you may add children under 18 as family members.
          </p>
          <WaiverForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400">
        Iron County Trail Club &middot; Building single track trails for quiet sports
        <br />
        <a href="/admin" className="text-gray-300 hover:text-gray-500 transition-colors">
          Admin
        </a>
      </footer>
    </main>
  );
}
