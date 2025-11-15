"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, Target, Salad, Ban, Globe, ThumbsDown, Bell, Check, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { subscribeToPushNotifications, unsubscribeFromPushNotifications } from "@/utils/push-notifications"

interface UserPreferences {
  dietaryRestrictions: string[]
  allergies: string[]
  cuisinePreferences: string[]
  dislikedIngredients: string[]
  emailNotifications: boolean
  pushNotifications: boolean
}

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "Halal",
  "Kosher",
]

const ALLERGY_OPTIONS = [
  "Peanuts",
  "Tree Nuts",
  "Dairy",
  "Eggs",
  "Soy",
  "Wheat/Gluten",
  "Shellfish",
  "Fish",
  "Sesame",
]

const CUISINE_OPTIONS = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "Thai",
  "French",
  "Greek",
  "Mediterranean",
  "American",
  "Korean",
  "Vietnamese",
]

export default function PreferencesPage() {
  const router = useRouter()
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    cuisinePreferences: [],
    dislikedIngredients: [],
    emailNotifications: true,
    pushNotifications: false,
  })
  const [newIngredient, setNewIngredient] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/preferences")
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setPreferences({
            dietaryRestrictions: JSON.parse(data.dietaryRestrictions || "[]"),
            allergies: JSON.parse(data.allergies || "[]"),
            cuisinePreferences: JSON.parse(data.cuisinePreferences || "[]"),
            dislikedIngredients: JSON.parse(data.dislikedIngredients || "[]"),
            emailNotifications: data.emailNotifications ?? true,
            pushNotifications: data.pushNotifications ?? false,
          })
        }
      }
    } catch (error) {
      console.error("Failed to fetch preferences", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      // Subscribe to push notifications
      const subscription = await subscribeToPushNotifications()
      if (subscription) {
        // Send subscription to backend
        try {
          const res = await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription }),
          })

          if (res.ok) {
            setPreferences({ ...preferences, pushNotifications: true })
            alert("✅ Push notifications enabled!")
          } else {
            alert("❌ Failed to enable push notifications")
          }
        } catch (error) {
          console.error("Failed to subscribe:", error)
          alert("❌ Failed to enable push notifications")
        }
      } else {
        alert("❌ Push notifications not supported or permission denied")
      }
    } else {
      // Unsubscribe from push notifications
      const success = await unsubscribeFromPushNotifications()
      if (success) {
        try {
          const res = await fetch("/api/push/subscribe", {
            method: "DELETE",
          })

          if (res.ok) {
            setPreferences({ ...preferences, pushNotifications: false })
            alert("✅ Push notifications disabled!")
          } else {
            alert("❌ Failed to disable push notifications")
          }
        } catch (error) {
          console.error("Failed to unsubscribe:", error)
          alert("❌ Failed to disable push notifications")
        }
      }
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dietaryRestrictions: JSON.stringify(preferences.dietaryRestrictions),
          allergies: JSON.stringify(preferences.allergies),
          cuisinePreferences: JSON.stringify(preferences.cuisinePreferences),
          dislikedIngredients: JSON.stringify(preferences.dislikedIngredients),
          emailNotifications: preferences.emailNotifications,
          pushNotifications: preferences.pushNotifications,
        }),
      })

      if (res.ok) {
        alert("✅ Preferences saved successfully!")
      } else {
        alert("❌ Failed to save preferences")
      }
    } catch (error) {
      console.error("Failed to save preferences", error)
      alert("❌ Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item)
    } else {
      return [...array, item]
    }
  }

  const addDislikedIngredient = () => {
    if (newIngredient.trim() && !preferences.dislikedIngredients.includes(newIngredient.trim())) {
      setPreferences({
        ...preferences,
        dislikedIngredients: [...preferences.dislikedIngredients, newIngredient.trim()],
      })
      setNewIngredient("")
    }
  }

  const removeDislikedIngredient = (ingredient: string) => {
    setPreferences({
      ...preferences,
      dislikedIngredients: preferences.dislikedIngredients.filter((i) => i !== ingredient),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading preferences...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Airbnb Style */}
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
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-2 flex items-center gap-3">
              <Settings className="w-10 h-10" />
              Preferences & Dietary Profile
            </h1>
            <p className="text-gray-600">Personalize your experience with dietary preferences</p>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-blue-700">
              ✓ <strong>Personalize Your Experience:</strong> Set your dietary restrictions,
              allergies, and preferences to get tailored recipe recommendations!
            </p>
          </div>

        {/* Dietary Restrictions */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Salad className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Dietary Restrictions</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {DIETARY_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    dietaryRestrictions: toggleArrayItem(preferences.dietaryRestrictions, option),
                  })
                }
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  preferences.dietaryRestrictions.includes(option)
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {preferences.dietaryRestrictions.includes(option) && <Check className="w-4 h-4" />}
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Allergies & Intolerances</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {ALLERGY_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    allergies: toggleArrayItem(preferences.allergies, option),
                  })
                }
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  preferences.allergies.includes(option)
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {preferences.allergies.includes(option) && <Check className="w-4 h-4" />}
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine Preferences */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Favorite Cuisines</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {CUISINE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    cuisinePreferences: toggleArrayItem(preferences.cuisinePreferences, option),
                  })
                }
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  preferences.cuisinePreferences.includes(option)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {preferences.cuisinePreferences.includes(option) && <Check className="w-4 h-4" />}
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Disliked Ingredients */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ThumbsDown className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Disliked Ingredients</h2>
          </div>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addDislikedIngredient()}
              placeholder="e.g., Mushrooms, Olives, Cilantro..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            <button
              onClick={addDislikedIngredient}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.dislikedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
              >
                {ingredient}
                <button
                  onClick={() => removeDislikedIngredient(ingredient)}
                  className="text-red-600 hover:text-red-700 font-bold transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {preferences.dislikedIngredients.length === 0 && (
            <p className="text-gray-500 text-sm">No disliked ingredients added yet.</p>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, emailNotifications: e.target.checked })
                }
                className="w-5 h-5 text-green-600 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive emails when food items are about to expire
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => handlePushNotificationToggle(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive browser push notifications for expiring items
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={savePreferences}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
