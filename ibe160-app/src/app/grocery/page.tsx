"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Salad, LogOut } from "lucide-react"
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
        {/* Action Panel */}
        <div className="p-4">
          <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-[#e0e0e0] bg-[#F7F7F7] p-5 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold leading-tight text-[#484848]">
                Let AI Plan Your Shopping Trip!
              </p>
              <p className="text-sm font-normal leading-normal text-[#484848]/80">
                Get the smartest route and never forget an item again.
              </p>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#228B22] text-white text-sm font-medium leading-normal hover:bg-[#228B22]/90 transition-colors">
              <span className="truncate">Try Smart Shopping</span>
            </button>
          </div>
        </div>

        {/* Add Item */}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-base font-medium leading-normal pb-2 text-[#484848]">Add Item</p>
            <div className="flex w-full flex-1 items-stretch rounded-xl">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                placeholder="e.g., Organic milk"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#484848] focus:outline-0 focus:ring-2 focus:ring-[#228B22]/50 border border-[#e0e0e0] bg-white h-14 placeholder:text-[#484848]/60 p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
              />
              <button
                onClick={addItem}
                className="flex items-center justify-center px-4 rounded-r-xl border border-l-0 border-[#e0e0e0] bg-[#228B22] text-white transition-colors hover:bg-[#228B22]/90"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
          </label>
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
          <div className="px-4">
            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 text-[#484848]">
              To Buy
            </h2>
            <div className="flex flex-col gap-2">
              {uncheckedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg p-3 border border-[#e0e0e0] bg-white"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="form-checkbox h-6 w-6 rounded-md border-[#e0e0e0] text-[#228B22] focus:ring-[#228B22]/50"
                    />
                    <span className="text-base text-[#484848]">{item.name}</span>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-[#D9534F]">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In Cart Section */}
        {checkedItems.length > 0 && (
          <div className="px-4 mt-6">
            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 text-[#484848]">
              In Cart
            </h2>
            <div className="flex flex-col gap-2">
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg p-3 bg-[#228B22]/20 border border-[#228B22]/30"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="form-checkbox h-6 w-6 rounded-md border-[#e0e0e0] text-[#228B22] focus:ring-[#228B22]/50"
                    />
                    <span className="text-base text-[#484848] line-through">{item.name}</span>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-[#D9534F]">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear Button */}
        {checkedItems.length > 0 && (
          <div className="p-4 mt-4 pb-8">
            <button
              onClick={clearChecked}
              className="w-full flex min-w-[84px] max-w-[480px] mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-transparent text-[#D9534F] text-base font-medium leading-normal border-2 border-[#D9534F] hover:bg-[#D9534F]/10 transition-colors"
            >
              <span className="truncate">Clear Checked Items</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="mx-4 mb-6 rounded-xl border border-[#e0e0e0] bg-white p-12 text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-[#228B22]/30">
              shopping_cart
            </span>
            <h2 className="mb-2 text-2xl font-bold text-[#484848]">Your list is empty</h2>
            <p className="mb-6 text-[#484848]/70">
              Add items you need to buy to get started!
            </p>
            <Link
              href="/pantry"
              className="inline-block rounded-lg bg-green-600 px-6 py-3 font-bold text-white rounded-xl transition-colors hover:bg-green-700"
            >
              Go to Pantry
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
