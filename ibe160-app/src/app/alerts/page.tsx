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
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <p className="text-gray-600">Loading alerts...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔔 Expiration Alerts</h1>
          <div className="flex gap-4">
            <Link href="/pantry" className="text-sm text-blue-600 hover:underline">
              Pantry
            </Link>
            <Link href="/grocery" className="text-sm text-blue-600 hover:underline">
              Grocery
            </Link>
            <Link href="/recipes" className="text-sm text-blue-600 hover:underline">
              Recipes
            </Link>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            🔔 <strong>Stay Ahead:</strong> Get notified about expiring items and find recipes to
            use them before they go bad!
          </p>
        </div>

        {/* Notification Permission */}
        {!notificationsEnabled && "Notification" in window && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-yellow-700">
                📲 Enable browser notifications to get alerts when items are expiring
              </p>
              <button
                onClick={requestNotifications}
                className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-red-600">{expired.length}</p>
            <p className="text-sm text-gray-600 mt-1">Expired</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-orange-600">{critical.length}</p>
            <p className="text-sm text-gray-600 mt-1">Critical (0-1 days)</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-yellow-600">{warning.length}</p>
            <p className="text-sm text-gray-600 mt-1">Warning (2-3 days)</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{safe.length}</p>
            <p className="text-sm text-gray-600 mt-1">Safe (3+ days)</p>
          </div>
        </div>

        {/* Expired Items */}
        {expired.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-600 mb-4">⚠️ Expired Items</h2>
            <div className="space-y-3">
              {expired.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-red-600">
                        Expired {Math.abs(item.daysUntilExpiry)} days ago
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Items (0-1 days) */}
        {critical.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-orange-500">
            <h2 className="text-xl font-semibold text-orange-600 mb-4">🚨 Critical (Use Today!)</h2>
            <div className="space-y-3">
              {critical.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-orange-600">
                        {item.daysUntilExpiry === 0
                          ? "Expires today"
                          : `Expires in ${item.daysUntilExpiry} day`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </p>
                    <Link
                      href={`/recipes?ingredient=${item.name}`}
                      className="text-xs text-blue-600 hover:underline"
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-yellow-500">
            <h2 className="text-xl font-semibold text-yellow-600 mb-4">⚠️ Use Soon (2-3 days)</h2>
            <div className="space-y-3">
              {warning.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-yellow-600">
                        Expires in {item.daysUntilExpiry} days
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe Items */}
        {safe.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-600 mb-4">✅ Safe Items (3+ days)</h2>
            <div className="grid grid-cols-2 gap-3">
              {safe.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-xl">{getCategoryEmoji(item.category)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-green-600">{item.daysUntilExpiry} days left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Items in Pantry</h2>
            <p className="text-gray-600 mb-4">
              Add items to your pantry to start tracking expiration dates!
            </p>
            <Link
              href="/pantry"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Go to Pantry
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
