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
    <div className="relative flex min-h-screen w-full flex-col font-display overflow-x-hidden bg-[#f7f7f7]">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex w-full items-center justify-center border-b border-[#e5e5e5] bg-[#f7f7f7]/80 p-4 pb-3 backdrop-blur-sm">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#1f1f1f]">Profile</h2>
      </div>

      <main className="flex-1">
        {/* User Profile Card */}
        <div className="p-4">
          <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#4F7942]/20">
              <span className="text-2xl font-bold text-[#4F7942]">
                {getInitials(session.user.name, session.user.email)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold leading-tight text-[#1f1f1f]">
                {session.user.name || "User"}
              </p>
              <p className="text-sm font-normal leading-normal text-[#6b6b6b]">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <h3 className="px-4 pb-2 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-[#1f1f1f]">
          Quick Actions
        </h3>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 p-4">
          <Link
            href="/pantry"
            className="flex flex-1 cursor-pointer flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-white p-4 transition-all hover:border-[#4F7942]/50 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#4F7942]" style={{ fontSize: "28px" }}>
              kitchen
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold leading-tight text-[#1f1f1f]">Pantry</h2>
              <p className="text-sm font-normal leading-normal text-[#6b6b6b]">Manage items</p>
            </div>
          </Link>

          <Link
            href="/recipes"
            className="flex flex-1 cursor-pointer flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-white p-4 transition-all hover:border-[#4F7942]/50 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#4F7942]" style={{ fontSize: "28px" }}>
              menu_book
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold leading-tight text-[#1f1f1f]">Recipes</h2>
              <p className="text-sm font-normal leading-normal text-[#6b6b6b]">Find meals</p>
            </div>
          </Link>

          <Link
            href="/grocery"
            className="flex flex-1 cursor-pointer flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-white p-4 transition-all hover:border-[#4F7942]/50 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#4F7942]" style={{ fontSize: "28px" }}>
              shopping_cart
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold leading-tight text-[#1f1f1f]">Grocery</h2>
              <p className="text-sm font-normal leading-normal text-[#6b6b6b]">Plan shopping</p>
            </div>
          </Link>

          <Link
            href="/preferences"
            className="flex flex-1 cursor-pointer flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-white p-4 transition-all hover:border-[#4F7942]/50 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#4F7942]" style={{ fontSize: "28px" }}>
              tune
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold leading-tight text-[#1f1f1f]">Prefs</h2>
              <p className="text-sm font-normal leading-normal text-[#6b6b6b]">Set diet</p>
            </div>
          </Link>
        </div>
      </main>

      {/* Sign Out Button */}
      <div className="mt-auto px-4 py-6">
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <button
            type="submit"
            className="flex h-12 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#d98a71] px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-opacity hover:opacity-90"
          >
            <span className="truncate">Sign out</span>
          </button>
        </form>
      </div>
    </div>
  )
}
