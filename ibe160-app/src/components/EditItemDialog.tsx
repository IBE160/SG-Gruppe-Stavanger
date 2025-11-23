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
        image: item.image || undefined,
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
      const errorMessage = err instanceof Error ? err.message : "Something went wrong"
      setError(errorMessage)
    }
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Edit Food Item</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Item Name
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Category
              </label>
              <select
                {...register("category")}
                id="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select a category</option>
                <option value="dairy">Dairy</option>
                <option value="produce">Produce</option>
                <option value="meat">Meat</option>
                <option value="grains">Grains</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1.5 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Quantity
                </label>
                <input
                  {...register("quantity", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="quantity"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
                {errors.quantity && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Unit
                </label>
                <select
                  {...register("unit")}
                  id="unit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
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
                  <p className="mt-1.5 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="bestBeforeDate"
                className="block text-sm font-semibold text-gray-900 mb-1.5"
              >
                Best Before Date
              </label>
              <input
                {...register("bestBeforeDate")}
                type="date"
                id="bestBeforeDate"
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              {errors.bestBeforeDate && (
                <p className="mt-1.5 text-sm text-red-600">{errors.bestBeforeDate.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={updateItemMutation.isPending}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateItemMutation.isPending}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {updateItemMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
