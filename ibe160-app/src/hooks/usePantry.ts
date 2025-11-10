import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface FoodItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  bestBeforeDate: string
  createdAt: string
}

interface AddItemData {
  name: string
  category: string
  quantity: number
  unit: string
  bestBeforeDate: string
}

// Fetch pantry items
export function usePantryItems() {
  return useQuery({
    queryKey: ["pantry"],
    queryFn: async () => {
      const response = await fetch("/api/pantry")
      if (!response.ok) {
        throw new Error("Failed to fetch pantry items")
      }
      const data = await response.json()
      return data.items as FoodItem[]
    },
  })
}

// Add item mutation
export function useAddItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: AddItemData) => {
      const response = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
      if (!response.ok) {
        throw new Error("Failed to add item")
      }
      return response.json()
    },
    onSuccess: async () => {
      // Wait for the cache to be refreshed before closing dialog
      await queryClient.invalidateQueries({ queryKey: ["pantry"] })
    },
  })
}

// Update item mutation
export function useUpdateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: FoodItem) => {
      const response = await fetch(`/api/pantry/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
      if (!response.ok) {
        throw new Error("Failed to update item")
      }
      return response.json()
    },
    onSuccess: async () => {
      // Wait for the cache to be refreshed before closing dialog
      await queryClient.invalidateQueries({ queryKey: ["pantry"] })
    },
  })
}

// Delete item mutation
export function useDeleteItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/pantry/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete item")
      }
      return response.json()
    },
    onSuccess: async () => {
      // Wait for the cache to be refreshed before closing dialog
      await queryClient.invalidateQueries({ queryKey: ["pantry"] })
    },
  })
}
