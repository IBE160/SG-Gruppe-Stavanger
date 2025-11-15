"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Salad, LogOut, ShoppingCart, Trash2 } from "lucide-react"
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
  const [addMode, setAddMode] = useState<"manual" | "ai">("manual")

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
      const response = await fetch("/api/ai/grocery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`AI search failed: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()

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
                Never forget an item again! Our AI-powered shopping list helps you plan your grocery trips efficiently and suggests items based on what you want to cook.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Smart Lists</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <span className="material-symbols-outlined text-green-600" style={{ fontSize: "20px" }}>auto_awesome</span>
                  <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <span className="material-symbols-outlined text-green-600" style={{ fontSize: "20px" }}>sync</span>
                  <span className="text-sm font-medium text-gray-700">Auto-Sync</span>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop&q=80"
                alt="Grocery shopping"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-white">auto_awesome</span>
                    <span className="text-sm font-medium">AI building your list...</span>
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

        {/* Mode Selection and Inputs - Only show when list has items */}
        {items.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How would you like to add items?</h2>
            </div>

            {/* Segmented Buttons */}
            <div className="flex px-4 py-3">
              <div className="flex h-10 flex-1 max-w-md items-center justify-center rounded-xl bg-gray-200 p-1">
                <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 ${addMode === "manual" ? "bg-white shadow-sm text-[#2D5A3D]" : "text-[#877a64]"} text-sm font-medium leading-normal transition-all`}>
                  <span className="truncate">Add Manually</span>
                  <input
                    className="invisible w-0"
                    name="add-mode"
                    type="radio"
                    value="manual"
                    checked={addMode === "manual"}
                    onChange={() => setAddMode("manual")}
                  />
                </label>
                <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 ${addMode === "ai" ? "bg-white shadow-sm text-[#2D5A3D]" : "text-[#877a64]"} text-sm font-medium leading-normal transition-all`}>
                  <span className="truncate">AI Suggest</span>
                  <input
                    className="invisible w-0"
                    name="add-mode"
                    type="radio"
                    value="ai"
                    checked={addMode === "ai"}
                    onChange={() => setAddMode("ai")}
                  />
                </label>
              </div>
            </div>

            {/* Manual Add */}
            {addMode === "manual" && (
              <div className="px-4 py-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add item (e.g., Organic milk)..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addItem()}
                    className="flex-1 px-4 py-3 border border-[#e5e2dc] rounded-xl text-[#333333] placeholder:text-[#877a64] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/50 focus:border-transparent transition-all bg-white"
                  />
                  <button
                    onClick={addItem}
                    disabled={!newItemName.trim()}
                    className="px-6 py-3 bg-[#2D5A3D] text-white font-medium rounded-xl hover:bg-[#2D5A3D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}

            {/* AI Add */}
            {addMode === "ai" && (
              <div className="flex flex-col gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                    What do you want to cook?
                  </p>
                  <textarea
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#333333] focus:outline-0 focus:ring-2 focus:ring-[#2D5A3D]/50 border border-[#e5e2dc] bg-white min-h-36 placeholder:text-[#877a64] p-[15px] text-base font-normal leading-normal"
                    placeholder="e.g., pasta carbonara for dinner..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  ></textarea>
                </label>
                <button
                  onClick={handleAISearch}
                  disabled={aiPrompt.trim().length === 0 || aiLoading}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundImage: "linear-gradient(to right, #8A2BE2, #FF69B4)",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="truncate">Thinking...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
                      <span className="truncate">AI Suggest</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Item Count */}
            <div className="px-4 py-3">
              <p className="text-[#877a64] text-base font-normal">
                You have <span className="font-semibold text-[#333333]">{items.length}</span> item{items.length !== 1 ? "s" : ""} in your list
              </p>
            </div>
          </>
        )}

        {/* Empty State with Inputs */}
        {items.length === 0 && (
          <div className="w-full">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-xl bg-white border border-[#e5e2dc] p-12">
              <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-[#2D5A3D]/10">
                <ShoppingCart className="w-12 h-12 text-[#2D5A3D]" />
              </div>
              <h2 className="text-2xl font-bold text-[#333333]">Your list is empty</h2>
              <p className="mt-2 mb-10 text-[#877a64] text-center max-w-md">
                Add items manually or use AI to suggest ingredients based on what you want to cook.
              </p>

              {/* Mode Selection in Empty State */}
              <div className="w-full mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">How would you like to add items?</h3>
                <div className="flex justify-center">
                  <div className="flex h-10 w-full max-w-md items-center justify-center rounded-xl bg-gray-200 p-1">
                    <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 ${addMode === "manual" ? "bg-white shadow-sm text-[#2D5A3D]" : "text-[#877a64]"} text-sm font-medium leading-normal transition-all`}>
                      <span className="truncate">Add Manually</span>
                      <input
                        className="invisible w-0"
                        name="add-mode-empty"
                        type="radio"
                        value="manual"
                        checked={addMode === "manual"}
                        onChange={() => setAddMode("manual")}
                      />
                    </label>
                    <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 ${addMode === "ai" ? "bg-white shadow-sm text-[#2D5A3D]" : "text-[#877a64]"} text-sm font-medium leading-normal transition-all`}>
                      <span className="truncate">AI Suggest</span>
                      <input
                        className="invisible w-0"
                        name="add-mode-empty"
                        type="radio"
                        value="ai"
                        checked={addMode === "ai"}
                        onChange={() => setAddMode("ai")}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Manual Add in Empty State */}
              {addMode === "manual" && (
                <div className="w-full">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Add item (e.g., Organic milk)..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addItem()}
                      className="flex-1 px-4 py-3 border border-[#e5e2dc] rounded-xl text-[#333333] placeholder:text-[#877a64] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/50 focus:border-transparent transition-all bg-white"
                    />
                    <button
                      onClick={addItem}
                      disabled={!newItemName.trim()}
                      className="px-6 py-3 bg-[#2D5A3D] text-white font-medium rounded-xl hover:bg-[#2D5A3D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              )}

              {/* AI Add in Empty State */}
              {addMode === "ai" && (
                <div className="flex flex-col gap-4 w-full">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                      What do you want to cook?
                    </p>
                    <textarea
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#333333] focus:outline-0 focus:ring-2 focus:ring-[#2D5A3D]/50 border border-[#e5e2dc] bg-white min-h-36 placeholder:text-[#877a64] p-[15px] text-base font-normal leading-normal"
                      placeholder="e.g., pasta carbonara for dinner..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    ></textarea>
                  </label>
                  <button
                    onClick={handleAISearch}
                    disabled={aiPrompt.trim().length === 0 || aiLoading}
                    className="flex min-w-[84px] max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundImage: "linear-gradient(to right, #8A2BE2, #FF69B4)",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    {aiLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="truncate">Thinking...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
                        <span className="truncate">AI Suggest</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* To Buy Section */}
        {uncheckedItems.length > 0 && (
          <div className="px-4 py-3 mb-6">
            <h2 className="text-xl font-semibold text-[#333333] mb-3">To Buy</h2>
            <div className="flex flex-col gap-2">
              {uncheckedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl p-4 border border-[#e5e2dc] bg-white hover:border-[#2D5A3D]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-[#2D5A3D] focus:ring-[#2D5A3D] cursor-pointer"
                    />
                    <span className="text-base text-[#333333] font-normal">{item.name}</span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-[#877a64] hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
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
          <div className="px-4 py-3 mb-6">
            <h2 className="text-xl font-semibold text-[#333333] mb-3">In Cart</h2>
            <div className="flex flex-col gap-2">
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl p-4 bg-[#2D5A3D]/5 border border-[#2D5A3D]/20"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-[#2D5A3D] focus:ring-[#2D5A3D] cursor-pointer"
                    />
                    <span className="text-base text-[#877a64] line-through font-normal">{item.name}</span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-[#877a64] hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={clearChecked}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-medium rounded-xl border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
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
