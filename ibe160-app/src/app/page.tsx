import Link from "next/link"
import { Salad, Package, ChefHat, Bell, ShoppingCart } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Salad className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">ibe160</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Food Waste Reduction Platform
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Track your pantry, get AI recipe suggestions, and reduce food waste.
          </p>
          <Link
            href="/register"
            className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
          >
            Get Started Free
          </Link>
        </div>

        {/* Simple Features List */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pantry Management</h3>
            </div>
            <p className="text-gray-600">
              Track food items with expiration dates and quantities
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <ChefHat className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Recipe Search</h3>
            </div>
            <p className="text-gray-600">
              Get personalized recipe suggestions from Google Gemini AI
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Expiration Alerts</h3>
            </div>
            <p className="text-gray-600">
              Get notified before food expires to reduce waste
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Grocery Lists</h3>
            </div>
            <p className="text-gray-600">
              Create and manage shopping lists with AI suggestions
            </p>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>Built with Next.js, TypeScript, Tailwind CSS & Google Gemini AI</p>
        </div>
      </footer>
    </div>
  )
}
