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

  // Get user initials
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            <Link href="/pantry" className="flex items-center gap-2">
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
                href="/alerts"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Alerts
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg"
              >
                Profile
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
                className="ml-2"
              >
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* User Profile Card */}
        <div className="mb-8">
          <div className="flex items-center gap-4 rounded-xl bg-white border border-[#e5e2dc] p-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#2D5A3D]/10">
              <span className="text-3xl font-bold text-[#2D5A3D]">
                {getInitials(session.user.name, session.user.email)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold text-[#333333]">
                {session.user.name || "User"}
              </p>
              <p className="text-base text-[#877a64]">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/pantry"
            className="flex flex-col gap-3 rounded-xl border border-[#e5e2dc] bg-white p-6 transition-all hover:border-[#2D5A3D]/50 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#2D5A3D]" style={{ fontSize: "32px" }}>
              kitchen
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-[#333333]">Pantry</h3>
              <p className="text-sm text-[#877a64]">Manage your ingredients</p>
            </div>
          </Link>

          <Link
            href="/recipes"
            className="flex flex-col gap-3 rounded-xl border border-[#e5e2dc] bg-white p-6 transition-all hover:border-[#2D5A3D]/50 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#2D5A3D]" style={{ fontSize: "32px" }}>
              menu_book
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-[#333333]">Recipes</h3>
              <p className="text-sm text-[#877a64]">Discover new meals</p>
            </div>
          </Link>

          <Link
            href="/grocery"
            className="flex flex-col gap-3 rounded-xl border border-[#e5e2dc] bg-white p-6 transition-all hover:border-[#2D5A3D]/50 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#2D5A3D]" style={{ fontSize: "32px" }}>
              shopping_cart
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-[#333333]">Grocery</h3>
              <p className="text-sm text-[#877a64]">Plan your shopping</p>
            </div>
          </Link>

          <Link
            href="/alerts"
            className="flex flex-col gap-3 rounded-xl border border-[#e5e2dc] bg-white p-6 transition-all hover:border-[#2D5A3D]/50 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#2D5A3D]" style={{ fontSize: "32px" }}>
              notifications
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-[#333333]">Alerts</h3>
              <p className="text-sm text-[#877a64]">Track expiration dates</p>
            </div>
          </Link>
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Settings</h2>
        </div>

        <div className="grid gap-4 mb-8">
          <Link
            href="/preferences"
            className="flex items-center justify-between rounded-xl border border-[#e5e2dc] bg-white p-5 transition-all hover:border-[#2D5A3D]/50"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2D5A3D]" style={{ fontSize: "24px" }}>
                tune
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#333333]">Preferences</h3>
                <p className="text-sm text-[#877a64]">Set dietary preferences and restrictions</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#877a64]">chevron_right</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
