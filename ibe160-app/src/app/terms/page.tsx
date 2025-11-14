import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              By accessing and using ibe160 ("the Service"), you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to these Terms of Service, please do not
              use the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              ibe160 is a smart food and recipe platform that helps users track their pantry inventory,
              discover recipes based on available ingredients, manage grocery lists, and reduce food waste
              through expiration alerts. The Service includes barcode scanning, AI-powered recipe search,
              and personalized food management tools.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are responsible for maintaining the confidentiality of your account and password. You
              agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Provide accurate and complete registration information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Data and Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We collect and process your data as described in our{" "}
              <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                Privacy Policy
              </Link>
              . By using the Service, you consent to such processing and you warrant that all data provided
              by you is accurate.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Collect or harvest any information from the Service</li>
              <li>Use the Service to spam or send unsolicited messages</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Service may use third-party APIs and services including Spoonacular API for recipe data
              and OpenFoodFacts for barcode scanning. We are not responsible for the availability or
              accuracy of these third-party services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Service and its original content, features, and functionality are owned by ibe160 and are
              protected by international copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
              EXPRESS OR IMPLIED. We do not warrant that the Service will be uninterrupted, secure, or
              error-free. Recipe suggestions and expiration date tracking are for informational purposes
              only and should not replace your own judgment about food safety.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              In no event shall ibe160 be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use or inability to use the Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We reserve the right to modify or replace these Terms at any time. If a revision is material,
              we will provide at least 30 days' notice prior to any new terms taking effect. Continued use
              of the Service after changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may terminate or suspend your account and access to the Service immediately, without prior
              notice or liability, for any reason, including if you breach the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions about these Terms, please{" "}
              <Link href="/contact" className="text-green-600 hover:text-green-700 underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
