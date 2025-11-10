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
                Track your pantry, get AI recipe suggestions, and receive alerts before food expires.
                Join thousands reducing waste and saving <strong>$1,500/year</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-lg font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-gray-400 transition-all"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Setup in 2 min</span>
                </div>
              </div>
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

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="w-8 h-8 text-green-400" />
                <div className="text-5xl font-bold">30%</div>
              </div>
              <div className="text-gray-400 text-lg">Less food waste</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div className="text-5xl font-bold">$1.5K</div>
              </div>
              <div className="text-gray-400 text-lg">Saved per year</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <ChefHat className="w-8 h-8 text-green-400" />
                <div className="text-5xl font-bold">1000+</div>
              </div>
              <div className="text-gray-400 text-lg">AI recipes</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - Simple 3 Steps */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              From pantry to plate in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-2xl font-bold">
                  1
                </div>
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <Camera className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Add Your Ingredients</h3>
                  <p className="text-gray-600">
                    Scan barcodes or type in what's in your kitchen
                  </p>
                </div>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-8 -right-4 text-gray-300">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            <div className="relative">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 text-2xl font-bold">
                  2
                </div>
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <Sparkles className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Get AI Recipes</h3>
                  <p className="text-gray-600">
                    AI suggests recipes based on what you have
                  </p>
                </div>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-8 -right-4 text-gray-300">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
                3
              </div>
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Bell className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Never Waste Again</h3>
                <p className="text-gray-600">
                  Get alerts before food expires, save money
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid - Simplified */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powered by AI & Smart Alerts
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="airbnb-card p-6 hover-lift text-center">
              <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mx-auto">
                <Camera className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Barcode Scanner
              </h3>
              <p className="text-gray-600 text-sm">
                Scan products instantly
              </p>
            </div>

            <div className="airbnb-card p-6 hover-lift text-center">
              <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mx-auto">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Recipe Search
              </h3>
              <p className="text-gray-600 text-sm">
                Google Gemini powered
              </p>
            </div>

            <div className="airbnb-card p-6 hover-lift text-center">
              <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-yellow-50 mx-auto">
                <Bell className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Alerts
              </h3>
              <p className="text-gray-600 text-sm">
                Email & push notifications
              </p>
            </div>

            <div className="airbnb-card p-6 hover-lift text-center">
              <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mx-auto">
                <ShoppingCart className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Shopping Lists
              </h3>
              <p className="text-gray-600 text-sm">
                AI-powered suggestions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to stop wasting food?
          </h2>
          <p className="text-xl text-green-50 mb-8 leading-relaxed">
            Join thousands making a difference. Start tracking your pantry today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 text-lg font-bold rounded-xl hover:shadow-2xl transition-all"
            >
              <Zap className="w-5 h-5" />
              Get Started Free
            </Link>
            <Link
              href="/recipes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-700 text-white text-lg font-semibold rounded-xl hover:bg-green-800 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Try AI Search
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
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
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
