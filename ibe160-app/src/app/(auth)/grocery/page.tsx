// Grocery List page - smart shopping list
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Toast } from "@/components/Toast"

interface GroceryItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  checked: boolean
}

export default function GroceryPage() {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("grocery-list")
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("grocery-list", JSON.stringify(items))
    }
  }, [items])

  const addItem = () => {
    if (!newItemName.trim()) return

    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: 1,
      unit: "pieces",
      category: "other",
      checked: false,
    }

    setItems([...items, newItem])
    setNewItemName("")
    setToast({ message: "Item added to grocery list!", type: "success" })
  }

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    setToast({ message: "Item removed from list", type: "success" })
  }

  const clearChecked = () => {
    setItems(items.filter((item) => !item.checked))
    setToast({ message: "Checked items cleared!", type: "success" })
  }

  const uncheckedItems = items.filter((item) => !item.checked)
  const checkedItems = items.filter((item) => item.checked)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Smart Grocery List</h1>
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

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 mb-8">
          <p className="text-sm text-blue-700">
            📝 <strong>Smart Shopping:</strong> Add items you need, check them off as you shop, and
            keep track of your grocery needs!
          </p>
        </div>

        {/* Add Item Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              placeholder="e.g., Milk, Eggs, Bread..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addItem}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
              Clear Checked Items
            </button>
          )}
        </div>

        {/* Items to Buy */}
        {uncheckedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
          <div className="bg-white rounded-lg shadow-md p-6">
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
