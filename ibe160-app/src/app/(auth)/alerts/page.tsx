// Alerts page - expiration notifications and warnings
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePantryItems } from "@/hooks/usePantry"
import { Toast } from "@/components/Toast"

export default function AlertsPage() {
  const { data: items = [], isLoading } = usePantryItems()
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Calculate days until expiration and categorize
  const now = new Date()
  const itemsWithDays = items.map((item) => ({
    ...item,
    daysUntilExpiry: Math.ceil(
      (new Date(item.bestBeforeDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ),
  }))

  const expired = itemsWithDays.filter((item) => item.daysUntilExpiry < 0)
  const critical = itemsWithDays.filter((item) => item.daysUntilExpiry >= 0 && item.daysUntilExpiry <= 1)
  const warning = itemsWithDays.filter((item) => item.daysUntilExpiry > 1 && item.daysUntilExpiry <= 3)
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
    if (!("Notification" in window)) {
      setToast({ message: "Notifications not supported in this browser", type: "error" })
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      setToast({ message: "Notifications enabled! You'll be alerted about expiring items.", type: "success" })

      // Demo notification
      new Notification("ibe160 - Food Expiration Alert", {
        body: `You have ${critical.length + warning.length} items expiring soon!`,
        icon: "/icon.png",
      })
    } else {
      setToast({ message: "Notification permission denied", type: "error" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expiration Alerts</h1>
          <div className="flex gap-4">
            <Link
              href="/pantry"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Pantry
            </Link>
            <Link
              href="/recipes"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Recipes
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Enable Notifications Banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-6 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">
                <strong>🔔 Stay Informed:</strong> Enable browser notifications to get alerts when items are about to expire!
              </p>
            </div>
            <button
              onClick={requestNotifications}
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
            >
              Enable Alerts
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                ❌
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{expired.length}</p>
                <p className="text-sm text-gray-600">Expired</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{critical.length}</p>
                <p className="text-sm text-gray-600">Critical (≤1 day)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
                ⏰
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{warning.length}</p>
                <p className="text-sm text-gray-600">Warning (2-3 days)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                ✓
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{safe.length}</p>
                <p className="text-sm text-gray-600">Safe (&gt;3 days)</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading alerts...</p>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No items to track</h2>
            <p className="text-gray-600 mb-6">Add items to your pantry to start monitoring expiration dates!</p>
            <Link
              href="/pantry"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Go to Pantry
            </Link>
          </div>
        )}

        {/* Expired Items */}
        {expired.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-600 mb-4">⚠️ Expired Items</h2>
            <div className="space-y-3">
              {expired.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-red-600">
                        Expired {Math.abs(item.daysUntilExpiry)} day{Math.abs(item.daysUntilExpiry) !== 1 ? "s" : ""} ago
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/pantry"
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                  >
                    Remove
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Items */}
        {critical.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-orange-500">
            <h2 className="text-xl font-semibold text-orange-600 mb-4">🚨 Use Today!</h2>
            <div className="space-y-3">
              {critical.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-orange-600">
                        Expires {item.daysUntilExpiry === 0 ? "today" : "tomorrow"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/recipes"
                    className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700"
                  >
                    Find Recipe
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Items */}
        {warning.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-yellow-500">
            <h2 className="text-xl font-semibold text-yellow-600 mb-4">⏰ Use Soon</h2>
            <div className="space-y-3">
              {warning.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryEmoji(item.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-yellow-600">
                        Expires in {item.daysUntilExpiry} day{item.daysUntilExpiry !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/recipes"
                    className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700"
                  >
                    Find Recipe
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe Items Summary */}
        {safe.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-600 mb-2">✓ Safe Items ({safe.length})</h2>
            <p className="text-sm text-gray-600">
              These items are fresh and don't need immediate attention.
            </p>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={!!toast}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}
