import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Food & Recipe Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Reduce food waste, inspire cooking. Track your pantry, get recipe suggestions,
            and never let food expire again.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-blue-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🥗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Track Your Pantry
            </h3>
            <p className="text-gray-600">
              Keep track of all your food items with expiration dates and never waste food again.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Recipe Matching
            </h3>
            <p className="text-gray-600">
              Get personalized recipe suggestions based on what you already have in your pantry.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Expiration Alerts
            </h3>
            <p className="text-gray-600">
              Receive notifications when items are about to expire with recipe recommendations.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-600 text-white rounded-2xl p-12 text-center my-16">
          <h2 className="text-3xl font-bold mb-4">
            Join the Fight Against Food Waste
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Households waste over 1 billion meals per day globally.
            Let's change that together.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-600">
          <p>🚧 Currently in development - Epic 2 (Authentication) Complete!</p>
          <p className="text-sm mt-2">Next: Epic 3 - Food Inventory Management</p>
        </div>
      </div>
    </div>
  )
}
