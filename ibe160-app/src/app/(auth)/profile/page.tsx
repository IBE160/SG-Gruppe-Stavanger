// Profile page - displays user information and navigation
// Connected to real authentication

import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { User, Mail, LogOut, Package, ChefHat, ShoppingCart, Bell, Salad } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Airbnb Style */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Salad className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">ibe160</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/pantry"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Pantry
              </Link>
              <Link
                href="/recipes"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Recipes
              </Link>
              <Link
                href="/grocery"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Grocery
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <p className="text-lg text-gray-900">
                  {session.user.name || "Not set"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-lg text-gray-900">{session.user.email}</p>
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/pantry"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    My Pantry
                  </Link>
                  <Link
                    href="/recipes"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <ChefHat className="w-5 h-5" />
                    Recipes
                  </Link>
                  <Link
                    href="/grocery"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Grocery List
                  </Link>
                  <Link
                    href="/preferences"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
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
