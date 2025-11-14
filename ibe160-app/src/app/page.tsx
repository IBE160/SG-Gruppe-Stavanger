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
    <div className="relative w-full overflow-x-hidden bg-[#F9FAFB]" style={{ fontFamily: '"Space Grotesk", "sans-serif"' }}>
      {/* Header */}
      <header className="p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#34D399] text-3xl">eco</span>
            <span className="text-xl font-bold">FoodWise AI</span>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-10 px-4">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div className="flex flex-col items-start gap-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#34D399]/20 px-3 py-1 text-sm font-medium text-[#34D399]">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>AI-Powered Food Waste Solution</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Stop wasting food. <br />
                <span className="text-[#34D399]">Start saving</span> money.
              </h1>
              <p className="text-base text-[#6B7280] sm:text-lg">
                Our app helps you track food, get AI-powered recipe suggestions, and reduce waste.
                Manage your pantry effectively and become a food hero.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#34D399] px-5 text-base font-bold text-white hover:bg-[#34D399]/90 transition-colors"
                >
                  <span>Get Started</span>
                </Link>
                <Link
                  href="/login"
                  className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200/50 px-5 text-base font-bold text-[#1F2937] hover:bg-gray-200 transition-colors"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Your Pantry</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] p-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-500">egg_alt</span>
                      <span className="font-medium">Tomatoes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="h-2 w-2 rounded-full bg-green-400"></span>
                      <span>Fresh</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] p-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-blue-400">water_drop</span>
                      <span className="font-medium">Milk</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                      <span>Expiring Soon</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#F9FAFB] p-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-orange-400">restaurant</span>
                      <span className="font-medium">Chicken</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span>Expired</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section 1 */}
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Discover Recipes with What You Have
              </h2>
              <p className="text-base text-[#6B7280] sm:text-lg">
                Our AI scans your pantry and suggests delicious recipes, ensuring no ingredient goes to
                waste. Just tell us what you have, and we'll handle the inspiration.
              </p>
            </div>
            <div
              className="flex h-80 w-full items-center justify-center rounded-xl bg-center bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80')",
              }}
            ></div>
          </div>
        </section>

        {/* Feature Section 2 */}
        <section className="py-16 px-4">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div
              className="flex h-80 w-full items-center justify-center rounded-xl bg-center bg-no-repeat bg-cover md:order-last"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1643494847705-74808059bf07?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              }}
            ></div>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Never Miss an Expiration Date
              </h2>
              <p className="text-base text-[#6B7280] sm:text-lg">
                Get timely notifications to prevent your food from spoiling. Our smart alerts help you use
                ingredients at their peak freshness, saving you money and reducing waste.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Ready to Transform Your Kitchen?
            </h2>
            <p className="text-base text-[#6B7280] sm:text-lg">
              Join thousands of users who are saving money and the planet, one meal at a time. Get started
              for free and see how easy it is to fight food waste.
            </p>
            <Link
              href="/register"
              className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#34D399] px-6 text-base font-bold text-white hover:bg-[#34D399]/90 transition-colors"
            >
              <span>Get Started for Free</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 bg-[#F9FAFB] py-10 px-5 text-center">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-between">
            <p className="text-base text-[#6B7280]">© 2024 FoodWise AI. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a className="text-base text-[#6B7280] hover:text-[#34D399] transition-colors" href="/terms">
                Terms of Service
              </a>
              <a className="text-base text-[#6B7280] hover:text-[#34D399] transition-colors" href="/privacy">
                Privacy Policy
              </a>
              <a className="text-base text-[#6B7280] hover:text-[#34D399] transition-colors" href="/contact">
                Contact Us
              </a>
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
