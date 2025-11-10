import { useQuery } from "@tanstack/react-query"
import { searchRecipes, searchByIngredients, getRecipeDetails } from "@/lib/spoonacular"

export function useRecipeSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ["recipes", "search", query],
    queryFn: () => searchRecipes(query),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRecipesByIngredients(ingredients: string[], enabled = true) {
  return useQuery({
    queryKey: ["recipes", "by-ingredients", ingredients],
    queryFn: () => searchByIngredients(ingredients),
    enabled: enabled && ingredients.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecipeDetails(id: number | null) {
  return useQuery({
    queryKey: ["recipe", "details", id],
    queryFn: () => getRecipeDetails(id!),
    enabled: id !== null,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
