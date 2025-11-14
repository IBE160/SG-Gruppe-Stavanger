"use client"

import { useState } from "react"
import Link from "next/link"
import { usePantryItems } from "@/hooks/usePantry"

export default function AlertsPage() {
  const { data: items = [], isLoading } = usePantryItems()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Calculate days until expiration and categorize
  const now = new Date()
  const itemsWithDays = items.map((item) => ({
    ...item,
    daysUntilExpiry: Math.ceil(
      (new Date(item.bestBeforeDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ),
  }))

  const expired = itemsWithDays.filter((item) => item.daysUntilExpiry < 0)
  const critical = itemsWithDays.filter(
    (item) => item.daysUntilExpiry >= 0 && item.daysUntilExpiry <= 1
  )
  const warning = itemsWithDays.filter(
    (item) => item.daysUntilExpiry > 1 && item.daysUntilExpiry <= 3
  )
  const safe = itemsWithDays.filter((item) => item.daysUntilExpiry > 3)

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      dairy: "🥛",
      produce: "🥗",
      meat: "🍗",
      grains: "🌾",
      other: "📦",
    }
    return emojis[category] || "📦"
  }

  const requestNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        setNotificationsEnabled(true)
        new Notification("Notifications Enabled", {
          body: "You'll receive alerts when food is about to expire!",
          icon: "/favicon.ico",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <p className="text-[#333333]">Loading alerts...</p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F7F7F7]">
      {/* Sticky Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e0e0e0] bg-[#F7F7F7]/80 p-4 pb-2 backdrop-blur-sm">
        <div className="flex size-12 shrink-0 items-center justify-start text-[#4CAF50]">
          <span className="material-symbols-outlined text-3xl">compost</span>
        </div>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-[#333333]">
          PantryPal
        </h2>
        <div className="flex w-12 items-center justify-end">
          <Link
            href="/profile"
            className="flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-transparent text-[#333333] min-w-0 p-0"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Headline Text */}
        <h1 className="text-[#333333] tracking-light px-4 pt-6 pb-3 text-left text-[32px] font-bold leading-tight">
          Expiration Alerts
        </h1>

        {/* Action Panel / Notification Banner */}
        <div className="p-4">
          <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-[#e0e0e0] bg-white p-5 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <p className="text-[#333333] text-base font-bold leading-tight">
                Never Miss an Expiration Date
              </p>
              <p className="text-[#333333]/70 text-base font-normal leading-normal">
                Get timely reminders to use your food before it goes bad.
              </p>
            </div>
            {!notificationsEnabled && "Notification" in window && (
              <button
                onClick={requestNotifications}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#4CAF50] text-white text-sm font-medium leading-normal hover:bg-[#4CAF50]/90 transition-colors"
              >
                <span className="truncate">Enable</span>
              </button>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          <div className="flex flex-col gap-2 rounded-xl border border-[#e0e0e0] bg-white p-4 text-center">
            <p className="text-3xl font-bold text-[#E54D4D]">{expired.length}</p>
            <p className="text-sm text-[#333333]/70 font-medium">Expired</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#e0e0e0] bg-white p-4 text-center">
            <p className="text-3xl font-bold text-[#FF9800]">{critical.length}</p>
            <p className="text-sm text-[#333333]/70 font-medium">Critical (0-1 days)</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#e0e0e0] bg-white p-4 text-center">
            <p className="text-3xl font-bold text-[#FFC107]">{warning.length}</p>
            <p className="text-sm text-[#333333]/70 font-medium">Warning (2-3 days)</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#e0e0e0] bg-white p-4 text-center">
            <p className="text-3xl font-bold text-[#4CAF50]">{safe.length}</p>
            <p className="text-sm text-[#333333]/70 font-medium">Safe (3+ days)</p>
          </div>
        </div>

        {/* Expired Items */}
        {expired.length > 0 && (
          <div className="mx-4 mb-6 rounded-xl border border-[#e0e0e0] bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#E54D4D]">
              <span className="material-symbols-outlined">warning</span>
              Expired Items
            </h2>
            <div className="space-y-3">
              {expired.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-[#E54D4D]/20 bg-[#E54D4D]/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-[#333333]">{item.name}</p>
                      <p className="text-sm text-[#E54D4D] font-medium">
                        Expired {Math.abs(item.daysUntilExpiry)} days ago
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#333333] font-medium">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-[#333333]/70">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Items (0-1 days) */}
        {critical.length > 0 && (
          <div className="mx-4 mb-6 rounded-xl border border-[#e0e0e0] bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#FF9800]">
              <span className="material-symbols-outlined">emergency</span>
              Critical (Use Today!)
            </h2>
            <div className="space-y-3">
              {critical.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-[#FF9800]/20 bg-[#FF9800]/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-[#333333]">{item.name}</p>
                      <p className="text-sm text-[#FF9800] font-medium">
                        {item.daysUntilExpiry === 0
                          ? "Expires today"
                          : `Expires in ${item.daysUntilExpiry} day`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#333333] font-medium">
                      {item.quantity} {item.unit}
                    </p>
                    <Link
                      href={`/recipes?ingredient=${item.name}`}
                      className="text-xs text-[#4CAF50] hover:underline font-medium"
                    >
                      Find Recipes →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Items (2-3 days) */}
        {warning.length > 0 && (
          <div className="mx-4 mb-6 rounded-xl border border-[#e0e0e0] bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#FFC107]">
              <span className="material-symbols-outlined">schedule</span>
              Use Soon (2-3 days)
            </h2>
            <div className="space-y-3">
              {warning.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-[#FFC107]/20 bg-[#FFC107]/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-[#333333]">{item.name}</p>
                      <p className="text-sm text-[#FFC107] font-medium">
                        Expires in {item.daysUntilExpiry} days
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#333333] font-medium">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-[#333333]/70">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe Items */}
        {safe.length > 0 && (
          <div className="mx-4 mb-6 rounded-xl border border-[#e0e0e0] bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#4CAF50]">
              <span className="material-symbols-outlined">check_circle</span>
              Safe Items (3+ days)
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {safe.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-[#4CAF50]/20 bg-[#4CAF50]/5 p-3"
                >
                  <span className="text-xl">{getCategoryEmoji(item.category)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-[#333333]">{item.name}</p>
                    <p className="text-xs text-[#4CAF50] font-medium">
                      {item.daysUntilExpiry} days left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="mx-4 mb-6 rounded-xl border border-[#e0e0e0] bg-white p-12 text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-[#4CAF50]/30">
              notifications
            </span>
            <h2 className="mb-2 text-2xl font-bold text-[#333333]">No Items in Pantry</h2>
            <p className="mb-6 text-[#333333]/70">
              Add items to your pantry to start tracking expiration dates!
            </p>
            <Link
              href="/pantry"
              className="inline-block rounded-lg bg-[#4CAF50] px-6 py-3 font-bold text-white transition-colors hover:bg-[#4CAF50]/90"
            >
              Go to Pantry
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
