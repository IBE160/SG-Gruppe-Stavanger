import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Cookie, Users, Bell } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 text-lg">
              Your privacy is important to us. Learn how we protect your data.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex gap-4">
                <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Commitment to Privacy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We respect your privacy and are committed to protecting your personal data. This privacy
                    policy explains how we collect, use, and safeguard your information when you use ibe160.
                  </p>
                </div>
              </div>
            </div>

            {/* What We Collect */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">Name and email address</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">Authentication credentials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">Profile information</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">Pantry inventory (food items, quantities, dates)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">Recipe searches and preferences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">Device information and browser type</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Access */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Camera Access</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Important:</strong> Our barcode scanning feature requires camera access. Images are
                    processed <strong>locally on your device</strong> and are <strong>not stored or transmitted</strong> to
                    our servers. Your camera is only used for real-time barcode scanning.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Data */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Provide and maintain the Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Track your pantry inventory and send expiration alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Suggest recipes based on your ingredients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Improve and personalize your experience</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the following third-party services:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">Spoonacular API</p>
                    <p className="text-sm text-gray-600">Recipe data</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">OpenFoodFacts</p>
                    <p className="text-sm text-gray-600">Product info</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">Supabase</p>
                    <p className="text-sm text-gray-600">Database hosting</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">Unsplash</p>
                    <p className="text-sm text-gray-600">Food imagery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your data:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Encryption:</strong> Your data is stored securely using industry-standard encryption.
                    However, no method of transmission over the Internet is 100% secure.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Rights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">✓</span>
                    <span className="text-gray-700">Access your data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">✓</span>
                    <span className="text-gray-700">Correct inaccurate data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">✓</span>
                    <span className="text-gray-700">Request deletion</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">✓</span>
                    <span className="text-gray-700">Export your data</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies to track activity and store certain information. You can configure your browser
                  to refuse cookies, though some features may not function properly.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions about your privacy?</h3>
              <p className="text-gray-700 mb-4">
                If you have questions or wish to exercise your rights, please contact us.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
