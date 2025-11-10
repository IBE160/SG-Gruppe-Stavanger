"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { foodItemSchema, type FoodItemInput } from "@/lib/validation/pantry"
import { useUpdateItem, type FoodItem } from "@/hooks/usePantry"

interface EditItemDialogProps {
  isOpen: boolean
  item: FoodItem | null
  onClose: () => void
  onSuccess: () => void
}

export function EditItemDialog({ isOpen, item, onClose, onSuccess }: EditItemDialogProps) {
  const [error, setError] = useState<string>("")
  const updateItemMutation = useUpdateItem()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FoodItemInput>({
    resolver: zodResolver(foodItemSchema),
  })

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        category: item.category as any,
        quantity: item.quantity,
        unit: item.unit as any,
        bestBeforeDate: item.bestBeforeDate.split("T")[0], // Convert ISO to YYYY-MM-DD
      })
    }
  }, [item, reset])

  const onSubmit = async (data: FoodItemInput) => {
    if (!item) return

    setError("")

    try {
      await updateItemMutation.mutateAsync({ ...data, id: item.id, createdAt: item.createdAt })
      reset()
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Edit Food Item</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={updateItemMutation.isPending}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register("category")}
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                <option value="dairy">🥛 Dairy</option>
                <option value="produce">🥗 Produce</option>
                <option value="meat">🍗 Meat</option>
                <option value="grains">🌾 Grains</option>
                <option value="other">📦 Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  {...register("quantity", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  {...register("unit")}
                  id="unit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select unit</option>
                  <option value="g">g (grams)</option>
                  <option value="kg">kg (kilograms)</option>
                  <option value="ml">ml (milliliters)</option>
                  <option value="L">L (liters)</option>
                  <option value="pieces">pieces</option>
                  <option value="oz">oz (ounces)</option>
                  <option value="lbs">lbs (pounds)</option>
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="bestBeforeDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Best Before Date *
              </label>
              <input
                {...register("bestBeforeDate")}
                type="date"
                id="bestBeforeDate"
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.bestBeforeDate && (
                <p className="mt-1 text-sm text-red-600">{errors.bestBeforeDate.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={updateItemMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateItemMutation.isPending}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {updateItemMutation.isPending ? "Updating..." : "Update Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
