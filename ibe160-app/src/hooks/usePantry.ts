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

// Add item mutation with optimistic update
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
    // Optimistic update - update UI immediately before API call completes
    onMutate: async (newItem) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["pantry"] })

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<FoodItem[]>(["pantry"])

      // Optimistically update to the new value
      queryClient.setQueryData<FoodItem[]>(["pantry"], (old) => {
        const optimisticItem: FoodItem = {
          id: `temp-${Date.now()}`, // Temporary ID
          ...newItem,
          bestBeforeDate: new Date(newItem.bestBeforeDate).toISOString(),
          createdAt: new Date().toISOString(),
        }
        return [...(old || []), optimisticItem]
      })

      // Return context with the previous value
      return { previousItems }
    },
    // If mutation fails, roll back to previous value
    onError: (err, newItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["pantry"], context.previousItems)
      }
    },
    // Always refetch after error or success to ensure we have the latest data
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pantry"] })
    },
  })
}

// Update item mutation with optimistic update
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
    // Optimistic update
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: ["pantry"] })
      const previousItems = queryClient.getQueryData<FoodItem[]>(["pantry"])

      queryClient.setQueryData<FoodItem[]>(["pantry"], (old) => {
        if (!old) return []
        return old.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      })

      return { previousItems }
    },
    onError: (err, updatedItem, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["pantry"], context.previousItems)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pantry"] })
    },
  })
}

// Delete item mutation with optimistic update
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
    // Optimistic update
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["pantry"] })
      const previousItems = queryClient.getQueryData<FoodItem[]>(["pantry"])

      queryClient.setQueryData<FoodItem[]>(["pantry"], (old) => {
        if (!old) return []
        return old.filter((item) => item.id !== deletedId)
      })

      return { previousItems }
    },
    onError: (err, deletedId, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["pantry"], context.previousItems)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pantry"] })
    },
  })
}
