import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to ibe160. We respect your privacy and are committed to protecting your personal
              data. This privacy policy explains how we collect, use, and safeguard your information when
              you use our Service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">When you create an account, we collect:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Name and email address</li>
              <li>Authentication credentials</li>
              <li>Profile information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Usage Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">We automatically collect:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Pantry inventory data (food items, quantities, expiration dates)</li>
              <li>Recipe searches and preferences</li>
              <li>Grocery list items</li>
              <li>Barcode scan history</li>
              <li>Device information and browser type</li>
              <li>IP address and usage statistics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Camera Access</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our barcode scanning feature requires camera access. Images captured during barcode scanning
              are processed locally on your device and are not stored or transmitted to our servers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Provide and maintain the Service</li>
              <li>Track your pantry inventory and send expiration alerts</li>
              <li>Suggest recipes based on your available ingredients</li>
              <li>Manage your grocery lists</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about updates and features</li>
              <li>Analyze usage patterns to enhance the Service</li>
              <li>Detect and prevent fraud or security issues</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the following third-party services that may collect information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>
                <strong>Spoonacular API:</strong> For recipe data and nutritional information
              </li>
              <li>
                <strong>OpenFoodFacts:</strong> For product information from barcode scans
              </li>
              <li>
                <strong>Supabase:</strong> For database hosting and authentication
              </li>
              <li>
                <strong>Unsplash:</strong> For food imagery
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              These services have their own privacy policies and we recommend reviewing them.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Storage and Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement appropriate technical and organizational measures to protect your data against
              unauthorized access, alteration, disclosure, or destruction. Your data is stored securely
              using industry-standard encryption. However, no method of transmission over the Internet is
              100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We retain your personal information only for as long as necessary to provide the Service and
              fulfill the purposes outlined in this policy. You can delete your account at any time, which
              will remove your personal data from our systems within 30 days.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Access your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent for data processing</li>
              <li>Object to certain data processing activities</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use cookies and similar tracking technologies to track activity on our Service and store
              certain information. You can configure your browser to refuse all cookies or indicate when a
              cookie is being sent. However, some parts of the Service may not function properly without
              cookies.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our Service is not directed to individuals under the age of 13. We do not knowingly collect
              personal information from children under 13. If you become aware that a child has provided us
              with personal data, please contact us.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your information may be transferred to and maintained on servers located outside of your
              country where data protection laws may differ. By using the Service, you consent to such
              transfers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new policy on this page and updating the "Last updated" date. Significant changes
              will be communicated via email.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about this Privacy Policy or wish to exercise your rights, please{" "}
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
