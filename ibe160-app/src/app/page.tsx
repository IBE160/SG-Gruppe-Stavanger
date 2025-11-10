import Link from "next/link"
import {
  Camera, Sparkles, Bell, ShoppingCart, ChefHat, Zap,
  ArrowRight, Check, TrendingDown, DollarSign, Salad
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Airbnb Style */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Salad className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">ibe160</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                Sign in
              </Link>
              <Link href="/register" className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Airbnb Style */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Value Prop */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Food Waste Solution
              </div>

              <h1 className="text-5xl lg:text-6xl font-semibold text-gray-900 leading-[1.1] tracking-tight">
                Stop wasting food.<br/>
                <span className="text-green-600">Start saving money.</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Track your pantry, get AI recipe suggestions, and reduce food waste.
              </p>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-500 text-white text-base font-medium rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Visual Preview */}
            <div className="relative">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <Salad className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Your Pantry</h3>
                      <p className="text-xs text-gray-500">Track your ingredients</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Tomatoes</span>
                      <span className="text-xs text-green-600 font-medium">Fresh</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Milk</span>
                      <span className="text-xs text-yellow-700 font-medium">2 days left</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Chicken</span>
                      <span className="text-xs text-green-600 font-medium">Fresh</span>
                    </div>
                  </div>

                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    Find Recipes with AI
                  </Link>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-green-600 text-white rounded-full text-xs font-medium shadow-lg">
                ✨ AI Powered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid - Airbnb Style */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                    AI Recipe Search
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Get personalized recipes powered by Google Gemini AI
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                    Expiration Alerts
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Get notified before food expires to reduce waste
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Airbnb Style */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 text-center">
          <p className="text-gray-500 text-xs">
            Built with Next.js, TypeScript & Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  )
}
