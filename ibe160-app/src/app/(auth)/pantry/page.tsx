// Pantry page - displays user's food inventory
// Stub implementation for sandbox (connects to stub API)

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PantryItemCard } from "@/components/PantryItemCard"
import { AddItemDialog } from "@/components/AddItemDialog"
import { EditItemDialog } from "@/components/EditItemDialog"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Toast } from "@/components/Toast"

interface FoodItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  bestBeforeDate: string
  createdAt: string
}

export default function PantryPage() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<FoodItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/pantry")

        if (!response.ok) {
          throw new Error("Failed to fetch pantry items")
        }

        const data = await response.json()
        setItems(data.items || [])
      } catch (err) {
        console.error("Error fetching pantry items:", err)
        setError("Failed to load your pantry. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    fetch("/api/pantry")
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setError("Failed to load your pantry. Please try again."))
      .finally(() => setIsLoading(false))
  }

  const handleItemAdded = () => {
    // Refresh the list after adding an item
    handleRetry()
    setToast({ message: "Item added successfully!", type: "success" })
  }

  const handleEditClick = (item: FoodItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const handleItemUpdated = () => {
    // Refresh the list after updating an item
    handleRetry()
    setToast({ message: "Item updated successfully!", type: "success" })
  }

  const handleDeleteClick = (item: FoodItem) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/pantry/${deletingItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      // Close dialog and refresh list
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
      handleRetry()
      setToast({ message: "Item deleted successfully!", type: "success" })
    } catch (err) {
      console.error("Error deleting item:", err)
      setToast({ message: "Failed to delete item. Please try again.", type: "error" })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Pantry</h1>
          <div className="flex gap-4">
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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && items.length === 0 && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                Your pantry is empty
              </h2>
              <p className="mt-2 text-gray-600">
                Add your first ingredient to start tracking expiration dates!
              </p>
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && !error && items.length > 0 && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Last synced: {new Date().toLocaleTimeString()}
              </p>
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <PantryItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </>
        )}

        {/* Add Item Dialog */}
        <AddItemDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={handleItemAdded}
        />

        {/* Edit Item Dialog */}
        <EditItemDialog
          isOpen={isEditDialogOpen}
          item={editingItem}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingItem(null)
          }}
          onSuccess={handleItemUpdated}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title="Delete Item"
          message={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={isDeleting}
        />

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
