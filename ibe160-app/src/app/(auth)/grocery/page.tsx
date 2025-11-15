"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Salad, LogOut, ShoppingCart, Sparkles, CheckCircle, TrendingUp, Trash2, Plus } from "lucide-react"
import { signOut } from "next-auth/react"

interface GroceryItem {
  id: string
  name: string
  checked: boolean
  addedAt: string
}

export default function GroceryPage() {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("grocery-list")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load grocery list", e)
      }
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (items.length >= 0) {
      localStorage.setItem("grocery-list", JSON.stringify(items))
    }
  }, [items])

  const addItem = () => {
    if (!newItemName.trim()) return

    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      checked: false,
      addedAt: new Date().toISOString(),
    }

    setItems([...items, newItem])
    setNewItemName("")
  }

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const clearChecked = () => {
    setItems(items.filter((item) => !item.checked))
  }

  const handleAISearch = async () => {
    if (!aiPrompt.trim()) return

    setAiLoading(true)
    try {
      // Call AI API to get shopping suggestions
      const response = await fetch("/api/ai/grocery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API error:", errorData)
        throw new Error(`AI search failed: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      console.log("AI response data:", data)

      // Add AI-suggested items to grocery list
      if (data.items && data.items.length > 0) {
        const newItems = data.items.map((itemName: string) => ({
          id: Date.now().toString() + Math.random(),
          name: itemName,
          checked: false,
          addedAt: new Date().toISOString(),
        }))
        setItems([...items, ...newItems])
      }

      setAiPrompt("")
    } catch (error) {
      console.error("AI search error:", error)
      alert(`Failed to get AI suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setAiLoading(false)
    }
  }

  const uncheckedItems = items.filter((item) => !item.checked)
  const checkedItems = items.filter((item) => item.checked)

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
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg"
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
        {/* Hero Section */}
        <div className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Smart Grocery Shopping Made Easy
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Our AI-powered grocery list helps you shop smarter, save money, and never forget an item. Organize your shopping with ease!
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Smart Organization</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Save Money</span>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&q=80"
                alt="Grocery shopping with fresh produce"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-sm font-medium">Building your smart list...</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      Milk ✓
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      Eggs ✓
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      Bread ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Shopping Assistant */}
        <div className="mb-8 px-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Shopping Assistant</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Tell me what you want to cook, and I'll check your pantry and add missing items to your list!
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAISearch()}
                placeholder="e.g., pasta carbonara for dinner"
                className="flex-1 px-4 py-3 border border-purple-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                disabled={aiLoading}
              />
              <button
                onClick={handleAISearch}
                disabled={!aiPrompt.trim() || aiLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Suggest Items</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Add Item */}
        <div className="mb-8 px-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                placeholder="e.g., Organic milk"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <button
                onClick={addItem}
                disabled={!newItemName.trim()}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-[#e0e0e0] bg-white">
            <p className="text-base font-medium leading-normal text-[#484848]">Total Items</p>
            <p className="tracking-light text-2xl font-bold leading-tight text-[#484848]">
              {items.length}
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-[#e0e0e0] bg-white">
            <p className="text-base font-medium leading-normal text-[#484848]">To Buy</p>
            <p className="tracking-light text-2xl font-bold leading-tight text-[#484848]">
              {uncheckedItems.length}
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-xl p-4 sm:p-6 border border-[#e0e0e0] bg-white">
            <p className="text-base font-medium leading-normal text-[#484848]">In Cart</p>
            <p className="tracking-light text-2xl font-bold leading-tight text-[#484848]">
              {checkedItems.length}
            </p>
          </div>
        </div>

        {/* To Buy Section */}
        {uncheckedItems.length > 0 && (
          <div className="px-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">To Buy</h2>
            <div className="flex flex-col gap-3">
              {uncheckedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl p-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <span className="text-base text-gray-900 font-medium">{item.name}</span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In Cart Section */}
        {checkedItems.length > 0 && (
          <div className="px-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">In Cart</h2>
            <div className="flex flex-col gap-3">
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl p-4 bg-green-50 border border-green-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <span className="text-base text-gray-600 line-through">{item.name}</span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear Button */}
        {checkedItems.length > 0 && (
          <div className="px-4 pb-8">
            <button
              onClick={clearChecked}
              className="w-full max-w-md mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl border-2 border-red-200 hover:bg-red-100 hover:border-red-300 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear Checked Items</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="mx-4 mb-6 rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your list is empty</h2>
            <p className="mb-6 text-gray-600">
              Add items you need to buy or use AI to suggest ingredients!
            </p>
            <Link
              href="/pantry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              <Salad className="w-5 h-5" />
              <span>Go to Pantry</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
