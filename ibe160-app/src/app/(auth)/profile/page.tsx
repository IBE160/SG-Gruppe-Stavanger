// Profile page (stub for sandbox)
// TODO: Connect to real auth when available

import Link from "next/link"

export default async function ProfilePage() {
  // Stub: In production, this will use real auth session
  const stubUser = {
    email: "user@example.com",
    name: "Demo User",
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-lg text-gray-900">
                  {stubUser.name || "Not set"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{stubUser.email}</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Link
                  href="/login"
                  className="inline-block px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg px-6 py-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Welcome to ibe160! 🎉
          </h2>
          <p className="text-sm text-blue-700">
            Start by adding items to your pantry to get recipe suggestions and reduce food waste.
          </p>
          <p className="mt-2 text-xs text-blue-600">
            Note: Auth stubs in place for sandbox. Full auth will work in production.
          </p>
        </div>
      </div>
    </div>
  )
}
