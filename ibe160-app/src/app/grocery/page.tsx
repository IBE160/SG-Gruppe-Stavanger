"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Salad, LogOut, ShoppingCart } from "lucide-react"
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

  const uncheckedItems = items.filter((item) => !item.checked)
  const checkedItems = items.filter((item) => item.checked)

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
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-2 flex items-center gap-3">
              <ShoppingCart className="w-10 h-10" />
              Smart Grocery List
            </h1>
            <p className="text-gray-600">Add items, check them off as you shop, and track your needs</p>
          </div>

          {/* Info Banner */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8">
            <p className="text-sm text-green-700">
              ✓ <strong>Smart Shopping:</strong> Add items you need, check them off as you shop,
              and keep track of your grocery needs!
            </p>
          </div>

          {/* Add Item Form */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                placeholder="e.g., Milk, Eggs, Bread..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              <button
                onClick={addItem}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Add
              </button>
            </div>
          </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{uncheckedItems.length}</p>
              <p className="text-sm text-gray-600">To Buy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{checkedItems.length}</p>
              <p className="text-sm text-gray-600">In Cart</p>
            </div>
          </div>
          {checkedItems.length > 0 && (
            <button
              onClick={clearChecked}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
            >
              Clear Checked Items ({checkedItems.length})
            </button>
          )}
        </div>

        {/* Items to Buy */}
        {uncheckedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">To Buy</h2>
            <div className="space-y-2">
              {uncheckedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 border-2 border-gray-300 rounded-md hover:border-blue-500 flex items-center justify-center"
                  >
                    {item.checked && <span className="text-blue-600">✓</span>}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checked Items */}
        {checkedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">In Cart</h2>
            <div className="space-y-2">
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-green-50"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 border-2 border-green-500 bg-green-500 rounded-md flex items-center justify-center"
                  >
                    <span className="text-white font-bold">✓</span>
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-gray-500 line-through">{item.name}</p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your list is empty</h2>
            <p className="text-gray-600">Add items you need to buy to get started!</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
