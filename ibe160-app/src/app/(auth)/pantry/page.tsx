// Pantry page - displays user's food inventory
// Now with React Query for offline-first experience

"use client"

import { useState } from "react"
import Link from "next/link"
import { Camera, Plus } from "lucide-react"
import { PantryItemCard } from "@/components/PantryItemCard"
import { AddItemDialog } from "@/components/AddItemDialog"
import { EditItemDialog } from "@/components/EditItemDialog"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Toast } from "@/components/Toast"
import BarcodeScanner from "@/components/BarcodeScanner"
import { usePantryItems, useDeleteItem, type FoodItem } from "@/hooks/usePantry"

export default function PantryPage() {
  const { data: items = [], isLoading, error, refetch } = usePantryItems()
  const deleteItemMutation = useDeleteItem()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<FoodItem | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [scannedProduct, setScannedProduct] = useState<any>(null)

  const handleItemAdded = () => {
    setToast({ message: "Item added successfully!", type: "success" })
  }

  const handleEditClick = (item: FoodItem) => {
    setEditingItem(item)
    setIsEditDialogOpen(true)
  }

  const handleItemUpdated = () => {
    setToast({ message: "Item updated successfully!", type: "success" })
  }

  const handleDeleteClick = (item: FoodItem) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return

    try {
      await deleteItemMutation.mutateAsync(deletingItem.id)
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
      setToast({ message: "Item deleted successfully!", type: "success" })
    } catch (err) {
      console.error("Error deleting item:", err)
      setToast({ message: "Failed to delete item. Please try again.", type: "error" })
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  const handleBarcodeScan = async (barcode: string) => {
    setIsScannerOpen(false)
    setToast({ message: `Barcode detected: ${barcode}. Looking up product...`, type: "success" })

    try {
      const res = await fetch(`/api/barcode/${barcode}`)
      if (res.ok) {
        const product = await res.json()
        setScannedProduct(product)
        setIsAddDialogOpen(true)
      } else {
        setToast({
          message: "Product not found. Please add manually.",
          type: "error",
        })
        setIsAddDialogOpen(true)
      }
    } catch (error) {
      console.error("Barcode lookup error:", error)
      setToast({
        message: "Failed to lookup product. Please add manually.",
        type: "error",
      })
      setIsAddDialogOpen(true)
    }
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

        {/* Offline-First Indicator */}
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <p className="text-sm text-green-700">
            ✓ <strong>Offline-First:</strong> React Query enabled - changes sync automatically!
          </p>
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
            <p className="text-red-600 mb-4">Failed to load your pantry. Please try again.</p>
            <button
              onClick={() => refetch()}
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
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">Your pantry is empty</h2>
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
                {items.length} item{items.length !== 1 ? "s" : ""} in pantry
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Scan Barcode
                </button>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
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
          isLoading={deleteItemMutation.isPending}
        />

        {/* Barcode Scanner */}
        {isScannerOpen && (
          <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setIsScannerOpen(false)} />
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
