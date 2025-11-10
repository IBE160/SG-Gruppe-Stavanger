// Profile page - displays user information and navigation
// Connected to real authentication

import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { User, Mail, LogOut, Package, ChefHat, ShoppingCart, Bell } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-8 h-8 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <p className="text-lg text-gray-900">
                  {session.user.name || "Not set"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-lg text-gray-900">{session.user.email}</p>
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/pantry"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    My Pantry
                  </Link>
                  <Link
                    href="/recipes"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <ChefHat className="w-5 h-5" />
                    Recipes
                  </Link>
                  <Link
                    href="/grocery"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Grocery List
                  </Link>
                  <Link
                    href="/preferences"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    Preferences
                  </Link>
                </div>
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/" })
                  }}
                >
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
