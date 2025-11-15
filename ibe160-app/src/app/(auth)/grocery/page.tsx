"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Salad, LogOut, ShoppingCart, Sparkles, Trash2, Plus } from "lucide-react"
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">Grocery List</h1>
          <p className="text-gray-600">Plan your shopping and never forget an item</p>
        </div>

        {/* AI Shopping Assistant */}
        <div className="mb-6 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI Shopping Assistant</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Tell me what you want to cook, and I'll check your pantry and add missing items!
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAISearch()}
              placeholder="e.g., pasta carbonara for dinner"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={aiLoading}
            />
            <button
              onClick={handleAISearch}
              disabled={!aiPrompt.trim() || aiLoading}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Suggest</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Bar with Item Count and Add Button */}
        {items.length > 0 && (
          <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 text-base font-normal">
              You have <span className="font-semibold text-gray-900">{items.length}</span> item{items.length !== 1 ? "s" : ""} in your list
            </p>
            <div className="flex w-full sm:w-auto items-stretch gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                placeholder="Add item..."
                className="flex-1 min-w-[200px] px-4 h-11 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
              <button
                onClick={addItem}
                disabled={!newItemName.trim()}
                className="px-6 h-11 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Add Item
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="mt-12 w-full">
            <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-xl bg-white border border-gray-200 p-8 text-center">
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-green-600/10">
                <ShoppingCart className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Let's build your list!</h2>
              <p className="mt-1 mb-6 text-gray-600">
                Add items manually or use AI to suggest ingredients based on what you want to cook.
              </p>
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addItem()}
                  placeholder="Add your first item..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={addItem}
                  disabled={!newItemName.trim()}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* To Buy Section */}
        {uncheckedItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">To Buy</h2>
            <div className="flex flex-col gap-2">
              {uncheckedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl p-4 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <span className="text-base text-gray-900 font-normal">{item.name}</span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
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
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">In Cart</h2>
            <div className="flex flex-col gap-2">
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl p-4 bg-green-50/50 border border-green-200/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <span className="text-base text-gray-500 line-through font-normal">{item.name}</span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            {/* Clear Button */}
            <button
              onClick={clearChecked}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear Checked Items</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
