// Pantry page - displays user's food inventory
// Now with React Query for offline-first experience

"use client"

import { useState } from "react"
import Link from "next/link"
import { Camera, Plus, Salad, LogOut } from "lucide-react"
import { PantryItemCard } from "@/components/PantryItemCard"
import { AddItemDialog } from "@/components/AddItemDialog"
import { EditItemDialog } from "@/components/EditItemDialog"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Toast } from "@/components/Toast"
import BarcodeScanner from "@/components/BarcodeScanner"
import { usePantryItems, useDeleteItem, type FoodItem } from "@/hooks/usePantry"
import { signOut } from "next-auth/react"

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
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg"
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
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">My Pantry</h1>
          <p className="text-gray-600">Track your ingredients and reduce food waste</p>
        </div>

        {/* Offline-First Indicator */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
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
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 mb-4 font-medium">Failed to load your pantry. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && items.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Salad className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">Your pantry is empty</h2>
              <p className="text-gray-600 mb-8">
                Add your first ingredient to start tracking expiration dates!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Scan Barcode
                </button>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && !error && items.length > 0 && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-sm font-medium text-gray-600">
                {items.length} item{items.length !== 1 ? "s" : ""} in pantry
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Scan Barcode
                </button>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
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
          onClose={() => {
            setIsAddDialogOpen(false)
            setScannedProduct(null)
          }}
          onSuccess={handleItemAdded}
          scannedProduct={scannedProduct}
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
