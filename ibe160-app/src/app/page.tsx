import Link from "next/link"
import {
  Camera, Sparkles, Bell, ShoppingCart, Palette, BarChart3,
  Users, Gamepad2, Check, Target, Salad
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Salad className="w-7 h-7 text-green-600" />
              <span className="text-xl font-semibold text-gray-900">ibe160</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-700 font-medium hover:text-gray-900">
                Sign in
              </Link>
              <Link href="/register" className="airbnb-button-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - AirBnb Style */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              Never waste food again
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              Smart pantry tracking, AI-powered recipes, and expiration alerts.
              Reduce waste, save money, cook better.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pantry" className="airbnb-button-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                Try Demo Now
              </Link>
              <Link href="/register" className="airbnb-button-secondary text-lg px-8 py-4 w-full sm:w-auto">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-br from-pink-50 to-red-50 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-full bg-gradient-to-tr from-blue-50 to-purple-50 opacity-30 blur-3xl"></div>
      </div>

      {/* Features Grid - AirBnb Card Style */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Everything you need to reduce food waste
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="airbnb-card p-8 hover-lift">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Barcode Scanning
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Scan products to auto-add items with nutritional info from our database.
            </p>
          </div>

          <div className="airbnb-card p-8 hover-lift">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-purple-50">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              AI Recipe Search
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Google Gemini AI suggests recipes based on your dietary preferences.
            </p>
          </div>

          <div className="airbnb-card p-8 hover-lift">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-yellow-50">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Smart Alerts
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Email & push notifications when food is about to expire.
            </p>
          </div>

          <div className="airbnb-card p-8 hover-lift">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-green-50">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Shopping Lists
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI-powered shopping suggestions to use expiring ingredients.
            </p>
          </div>

          <div className="airbnb-card p-8 hover-lift">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-pink-50">
              <Palette className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Creative Mode
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get ingredient substitutions when you're missing something.
            </p>
          </div>

          <div className="airbnb-card p-8 hover-lift">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Nutrition Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI-calculated nutrition facts for every recipe you browse.
            </p>
          </div>

          <div className="airbnb-card p-8 hover-lift">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-orange-50">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Family Sharing
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Share your pantry with household members (coming soon).
            </p>
          </div>

          <div className="airbnb-card p-8 hover-lift">
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
              <Gamepad2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Gamification
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Earn points and badges for reducing waste (coming soon).
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-airbnb-red mb-2">1B+</div>
              <div className="text-gray-600 text-lg">Meals wasted daily</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-airbnb-red mb-2">30%</div>
              <div className="text-gray-600 text-lg">Food waste reduction</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-airbnb-red mb-2">$1,500</div>
              <div className="text-gray-600 text-lg">Avg. savings per year</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="airbnb-card p-12 md:p-16 text-center bg-gradient-to-br from-red-50 to-pink-50">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to reduce food waste?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands making a difference. Start tracking your pantry today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pantry" className="airbnb-button-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              Try Demo Now
            </Link>
            <Link href="/register" className="airbnb-button-secondary text-lg px-8 py-4">
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Phase 2 & 3 Features Live
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">User Preferences</h3>
                <p className="text-gray-600">Dietary restrictions, allergies, cuisine preferences</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Enhanced Search</h3>
                <p className="text-gray-600">Google Gemini powered recipe suggestions</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Shopping</h3>
                <p className="text-gray-600">AI suggestions based on expiring items</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Push & Email Alerts</h3>
                <p className="text-gray-600">Daily notifications for expiring food</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Salad className="w-7 h-7 text-green-600" />
              <span className="text-xl font-semibold text-gray-900">ibe160</span>
            </div>
            <p className="text-gray-600 text-sm">
              Built with Next.js 16, TypeScript, Tailwind CSS 4 & Google Gemini AI
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
