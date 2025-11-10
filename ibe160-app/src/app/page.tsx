import Link from "next/link"
import {
  Camera, Sparkles, Bell, ShoppingCart, ChefHat, Zap,
  ArrowRight, Check, TrendingDown, DollarSign, Salad
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Salad className="w-7 h-7 text-green-600" />
              <span className="text-xl font-semibold text-gray-900">ibe160</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="airbnb-button-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Massive & Visual */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Value Prop */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-sm font-medium text-green-700">
                <Sparkles className="w-4 h-4" />
                AI-Powered Food Waste Solution
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Stop wasting food.
                <span className="block text-green-600 mt-2">Start saving money.</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Track your pantry, get AI recipe suggestions, and reduce food waste.
              </p>

              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Visual Preview */}
            <div className="relative">
              <div className="airbnb-card p-8 bg-white shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Salad className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Your Pantry</h3>
                      <p className="text-sm text-gray-600">12 items tracked</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Tomatoes</span>
                      <span className="text-xs text-green-600 font-medium">Fresh</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="text-sm font-medium">Milk</span>
                      <span className="text-xs text-yellow-700 font-medium">2 days left</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Chicken</span>
                      <span className="text-xs text-green-600 font-medium">Fresh</span>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg">
                    <Sparkles className="w-5 h-5" />
                    Find Recipes with AI
                  </button>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold shadow-lg">
                ✨ AI Powered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="airbnb-card p-8 hover-lift">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    AI Recipe Search
                  </h3>
                  <p className="text-gray-600">
                    Get personalized recipes powered by Google Gemini AI
                  </p>
                </div>
              </div>
            </div>

            <div className="airbnb-card p-8 hover-lift">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Expiration Alerts
                  </h3>
                  <p className="text-gray-600">
                    Get notified before food expires to reduce waste
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm">
            Built with Next.js, TypeScript & Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  )
}
