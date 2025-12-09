// Pantry page - displays user's food inventory
// Now with React Query for offline-first experience

"use client"

import { useState } from "react"
import Link from "next/link"
import { Camera, Plus, Salad, LogOut, Settings } from "lucide-react"
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
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">My Pantry</h1>
          <p className="text-gray-600">Track your ingredients and reduce food waste</p>
        </div>

        {/* Loading State: Skeleton Placeholders */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col gap-3 rounded-xl border border-[#EAEAEA] bg-white p-4"
              >
                <div className="aspect-square w-full rounded-lg bg-gray-200"></div>
                <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="h-6 w-1/3 rounded-full bg-gray-200"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-[#E54D4D]/10 border border-[#E54D4D]/30 rounded-xl p-8 text-center mt-6">
            <p className="text-[#E54D4D] mb-4 font-medium">
              Failed to load your pantry. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-[#E54D4D] text-white font-medium rounded-lg hover:bg-[#E54D4D]/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && items.length === 0 && (
          <div className="mt-12 w-full">
            <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-xl bg-white border border-[#EAEAEA] p-8 text-center">
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-[#2BAF74]/10">
                <span className="material-symbols-outlined text-4xl text-[#2BAF74]">kitchen</span>
              </div>
              <h2 className="text-xl font-bold text-[#333333]">Let's fill your pantry!</h2>
              <p className="mt-1 mb-6 text-[#333333]/70">
                Add your first item to start tracking and get smart recipe suggestions.
              </p>
              <div className="flex w-full gap-2">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-4 bg-[#333333]/10 text-[#333333] text-base font-medium leading-normal"
                >
                  <span className="material-symbols-outlined">barcode_scanner</span>
                  <span className="truncate">Scan</span>
                </button>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-4 bg-[#2BAF74] text-white text-base font-medium leading-normal shadow-sm"
                >
                  <span className="truncate">Add Your First Item</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && !error && items.length > 0 && (
          <>
            {/* Action Bar */}
            <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[#333333]/80 text-base font-normal leading-normal">
                You have {items.length} item{items.length !== 1 ? "s" : ""} in your pantry
              </p>
              <div className="flex w-full sm:w-auto items-stretch gap-2">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-4 bg-[#2BAF74] text-white text-base font-medium leading-normal shadow-sm"
                >
                  <span className="material-symbols-outlined">barcode_scanner</span>
                  <span className="truncate">Scan</span>
                </button>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-[#333333]/10 text-[#333333] text-base font-medium leading-normal"
                >
                  <span className="truncate">Add Item</span>
                </button>
              </div>
            </div>

            {/* Pantry Items Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
