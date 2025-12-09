import Link from "next/link"
import { ArrowLeft, Scale, Shield, FileText, AlertCircle, UserCheck, Globe } from "lucide-react"

export default function TermsPage() {
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600 text-lg">
              Please read these terms carefully before using our service
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using ibe160 ("the Service"), you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to these Terms of Service, please do not
                  use the Service.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ibe160 is a smart food and recipe platform that helps users track their pantry inventory,
                  discover recipes based on available ingredients, manage grocery lists, and reduce food waste
                  through expiration alerts.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Features include:</strong> Barcode scanning, AI-powered recipe search, and
                    personalized food management tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You are responsible for maintaining the confidentiality of your account and password. You
                  agree to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Provide accurate and complete registration information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Keep your password secure and confidential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Notify us immediately of any unauthorized use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">Be responsible for all activities under your account</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. User Data and Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We collect and process your data as described in our{" "}
                  <Link href="/privacy" className="text-green-600 hover:text-green-700 underline font-medium">
                    Privacy Policy
                  </Link>
                  . By using the Service, you consent to such processing and you warrant that all data provided
                  by you is accurate.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Acceptable Use</h2>
                <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span className="text-gray-700">Use the Service for any illegal purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span className="text-gray-700">Attempt to gain unauthorized access to our systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span className="text-gray-700">Interfere with or disrupt the Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span className="text-gray-700">Upload or transmit viruses or malicious code</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Disclaimer</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Recipe suggestions and expiration date tracking are for <strong>informational purposes only</strong> and
                    should not replace your own judgment about food safety. Always use your best judgment when
                    consuming food.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions about these terms?</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions, please don't hesitate to reach out.
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
