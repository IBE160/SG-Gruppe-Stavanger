// Pantry page (stub for sandbox)
// TODO: Connect to real auth when available

import Link from "next/link"

export default async function PantryPage() {
  // Stub: In production, this will check real auth session
  const isAuthenticated = true // Stub

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Pantry</h1>
          <Link 
            href="/profile"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Profile
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg 
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
              />
            </svg>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">Your pantry is empty</h2>
            <p className="mt-2 text-gray-600">
              Start adding food items to track expiration dates and get recipe suggestions!
            </p>
            <p className="mt-4 text-sm text-gray-500">
              🚧 Pantry features coming in Epic 3 (Stories 3.1-3.5)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
