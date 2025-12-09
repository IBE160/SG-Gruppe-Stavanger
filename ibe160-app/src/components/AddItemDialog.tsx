"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { foodItemSchema, type FoodItemInput } from "@/lib/validation/pantry"
import { useAddItem } from "@/hooks/usePantry"
import { Calendar } from "lucide-react"

interface AddItemDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  scannedProduct?: {
    name: string
    brand?: string
    category?: string
    quantity?: string
    image?: string
  } | null
}

export function AddItemDialog({ isOpen, onClose, onSuccess, scannedProduct }: AddItemDialogProps) {
  const [error, setError] = useState<string>("")
  const addItemMutation = useAddItem()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FoodItemInput>({
    resolver: zodResolver(foodItemSchema),
  })

  // Pre-fill form with scanned product data
  useEffect(() => {
    if (scannedProduct && isOpen) {
      if (scannedProduct.name) {
        setValue("name", scannedProduct.name)
      }
      if (scannedProduct.category) {
        // Map category from API to our categories
        const categoryMap: Record<string, string> = {
          "dairy": "dairy",
          "produce": "produce",
          "vegetables": "produce",
          "fruits": "produce",
          "meat": "meat",
          "meats": "meat",
          "fish": "meat",
          "grains": "grains",
          "cereals": "grains",
        }
        const mappedCategory = categoryMap[scannedProduct.category.toLowerCase()] || "other"
        setValue("category", mappedCategory as "dairy" | "produce" | "meat" | "grains" | "other")
      }
      if (scannedProduct.image) {
        setValue("image", scannedProduct.image)
      }
      // Set default quantity and unit
      setValue("quantity", 1)
      setValue("unit", "pieces")
      // Set default expiry to 7 days from now
      const defaultExpiry = new Date()
      defaultExpiry.setDate(defaultExpiry.getDate() + 7)
      setValue("bestBeforeDate", defaultExpiry.toISOString().split("T")[0])
    }
  }, [scannedProduct, isOpen, setValue])

  const onSubmit = async (data: FoodItemInput) => {
    setError("")

    try {
      await addItemMutation.mutateAsync(data)
      reset()
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Add Item</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={addItemMutation.isPending}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {scannedProduct && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex gap-4">
                {scannedProduct.image && (
                  <img
                    src={scannedProduct.image}
                    alt={scannedProduct.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <strong>Product found:</strong> {scannedProduct.name}
                    {scannedProduct.brand && <span> by {scannedProduct.brand}</span>}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Form pre-filled - adjust details as needed
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                Item Name
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
                placeholder="e.g., Milk, Tomatoes, Chicken"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                Category
              </label>
              <select
                {...register("category")}
                id="category"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
              >
                <option value="">Select a category</option>
                <option value="dairy">Dairy</option>
                <option value="produce">Produce (Fruit & Vegetables)</option>
                <option value="meat">Meat & Fish</option>
                <option value="grains">Pantry & Grains</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1.5 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 mb-2">
                  Quantity
                </label>
                <input
                  {...register("quantity", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="quantity"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
                  placeholder="e.g., 1"
                />
                {errors.quantity && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-900 mb-2">
                  Unit
                </label>
                <select
                  {...register("unit")}
                  id="unit"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
                >
                  <option value="">Select unit</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                  <option value="pieces">item</option>
                </select>
                {errors.unit && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="bestBeforeDate"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Best Before
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  {...register("bestBeforeDate")}
                  type="date"
                  id="bestBeforeDate"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-900"
                />
              </div>
              {errors.bestBeforeDate && (
                <p className="mt-1.5 text-sm text-red-600">{errors.bestBeforeDate.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={addItemMutation.isPending}
                className="flex-1 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addItemMutation.isPending}
                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {addItemMutation.isPending ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
