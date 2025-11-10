"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Camera, Sparkles, Bell, ShoppingCart, ChefHat, Zap,
  Check, TrendingDown, DollarSign, Salad, X
} from "lucide-react"

type ModalType =
  | "ai-search"
  | "pantry-tracking"
  | "expiration-alerts"
  | "food-waste"
  | "sustainability"
  | "gemini-ai"
  | "tech-stack"
  | null

export default function Home() {
  const [openModal, setOpenModal] = useState<ModalType>(null)

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

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop"
                          alt="Tomatoes"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Tomatoes</p>
                        <p className="text-xs text-gray-500">250g</p>
                      </div>
                      <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full">Fresh</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-yellow-200 hover:border-yellow-300 hover:shadow-sm transition-all">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop"
                          alt="Milk"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Milk</p>
                        <p className="text-xs text-gray-500">1L</p>
                      </div>
                      <span className="text-xs text-yellow-700 font-medium px-2 py-1 bg-yellow-50 rounded-full">2 days</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop"
                          alt="Chicken"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Chicken</p>
                        <p className="text-xs text-gray-500">500g</p>
                      </div>
                      <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full">Fresh</span>
                    </div>
                  </div>

                  <Link
                    href="/login"
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

      {/* Features - Full Width Airbnb Style */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
          {/* Feature 1: AI Recipe Search */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 lg:mb-24">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                AI Powered
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">
                Recipe search that understands you
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Just describe what you're craving. Our AI powered by Google Gemini creates personalized recipes based on your pantry and preferences.
              </p>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
                alt="AI Recipe Search"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Feature 2: Expiration Alerts */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 shadow-xl lg:order-first">
              <img
                src="https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800&h=600&fit=crop"
                alt="Food tracking"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4 lg:order-last">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                <Bell className="w-3.5 h-3.5" />
                Smart Alerts
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">
                Never waste food again
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Get timely notifications before your ingredients expire. Track everything in your pantry and use food before it goes bad.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Airbnb Style */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/register" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setOpenModal("ai-search")}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    AI Recipe Search
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setOpenModal("pantry-tracking")}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Pantry Tracking
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setOpenModal("expiration-alerts")}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Expiration Alerts
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">About</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setOpenModal("food-waste")}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Food Waste Reduction
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setOpenModal("sustainability")}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Sustainability
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Technology</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setOpenModal("gemini-ai")}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Google Gemini AI
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setOpenModal("tech-stack")}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Next.js & TypeScript
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Salad className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-900">ibe160</span>
              </div>
              <p className="text-xs text-gray-500">
                © 2025 ibe160. Reducing food waste, one ingredient at a time.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {openModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setOpenModal(null)}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 z-10">
              {/* Close Button */}
              <button
                onClick={() => setOpenModal(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* AI Recipe Search */}
              {openModal === "ai-search" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">AI Recipe Search</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Our AI-powered recipe search uses Google Gemini 2.0 to understand natural language queries and provide personalized recipe recommendations.
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Key Features:</h3>
                    <ul className="space-y-2 text-sm text-purple-800">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Natural language understanding - just describe what you want!</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Personalized based on your dietary restrictions and preferences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Uses ingredients you already have in your pantry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Fallback to Spoonacular API for additional recipe variety</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Pantry Tracking */}
              {openModal === "pantry-tracking" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <Salad className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Pantry Tracking</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Keep track of all your ingredients with our intelligent pantry management system. Scan barcodes or manually add items with expiration dates.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Key Features:</h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Barcode scanning with Open Food Facts integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Categorize items (dairy, produce, protein, grains, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Track quantities and best-before dates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Persistent storage with Supabase PostgreSQL</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Expiration Alerts */}
              {openModal === "expiration-alerts" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Expiration Alerts</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Never let food go to waste again! Get timely notifications before your ingredients expire so you can use them in time.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Key Features:</h3>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Visual indicators: Fresh (green), expiring soon (yellow), expired (red)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Email notifications for items about to expire</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Browser push notifications (optional)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Priority sorting - items expiring soon appear first</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Food Waste Reduction */}
              {openModal === "food-waste" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Food Waste Reduction</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Food waste is a major global problem. Approximately 1/3 of all food produced globally is wasted, contributing to environmental damage and economic loss.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-semibold text-green-900 mb-2">How ibe160 Helps:</h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Track what you have to avoid buying duplicates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Get alerted before food expires so you can use it in time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Find recipes using ingredients that are expiring soon</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Plan meals more efficiently and save money</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Sustainability */}
              {openModal === "sustainability" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <Salad className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Sustainability</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Our mission is to make sustainable living easier by helping individuals reduce their environmental impact through better food management.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Environmental Impact:</h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Reduce greenhouse gas emissions from decomposing food waste</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Conserve water and energy used in food production</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Save money while helping the planet</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Build more conscious consumption habits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Google Gemini AI */}
              {openModal === "gemini-ai" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Google Gemini AI</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    We use Google's latest Gemini 2.0 Flash model to power our AI recipe recommendations and ingredient substitution suggestions.
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">What Makes It Special:</h3>
                    <ul className="space-y-2 text-sm text-purple-800">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Advanced natural language understanding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Context-aware recipe generation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Intelligent ingredient substitution recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Fast response times with the Flash variant</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {openModal === "tech-stack" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Technology Stack</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Built with modern, cutting-edge technologies to deliver a fast, reliable, and scalable user experience.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Technologies Used:</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Next.js 16</strong> - React framework with App Router and Turbopack</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>TypeScript</strong> - Type-safe development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Supabase PostgreSQL</strong> - Scalable database storage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Prisma ORM</strong> - Type-safe database queries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>NextAuth.js v5</strong> - Secure authentication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Tailwind CSS</strong> - Modern, responsive design</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>React Query</strong> - Efficient data fetching and caching</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
