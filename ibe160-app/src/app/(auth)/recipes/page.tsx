// Recipes page - browse and search recipes with Spoonacular API
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRecipeSearch } from "@/hooks/useRecipes"
import { usePantryItems } from "@/hooks/usePantry"
import { searchByIngredients } from "@/lib/spoonacular"
import { useQuery } from "@tanstack/react-query"

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"text" | "ingredients">("text")

  // Fetch pantry items for ingredient-based search
  const { data: pantryItems = [] } = usePantryItems()

  // Text-based search
  const {
    data: textResults = [],
    isLoading: textLoading,
    error: textError,
  } = useRecipeSearch(searchQuery, searchMode === "text" && searchQuery.length > 0)

  // Ingredient-based search
  const {
    data: ingredientResults = [],
    isLoading: ingredientLoading,
    error: ingredientError,
  } = useQuery({
    queryKey: ["recipes", "ingredients", pantryItems],
    queryFn: () => {
      const ingredients = pantryItems.map((item) => item.name)
      return searchByIngredients(ingredients)
    },
    enabled: searchMode === "ingredients" && pantryItems.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  const recipes = searchMode === "text" ? textResults : ingredientResults
  const isLoading = searchMode === "text" ? textLoading : ingredientLoading
  const error = searchMode === "text" ? textError : ingredientError

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Browser</h1>
          <div className="flex gap-4">
            <Link
              href="/pantry"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Pantry
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 mb-8">
          <p className="text-sm text-blue-700">
            🍳 <strong>Powered by Spoonacular:</strong> Search thousands of recipes or find meals
            based on your pantry ingredients!
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSearchMode("text")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                searchMode === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔍 Search by Name
            </button>
            <button
              onClick={() => setSearchMode("ingredients")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                searchMode === "ingredients"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🥘 Use My Pantry ({pantryItems.length} items)
            </button>
          </div>

          {/* Text Search */}
          {searchMode === "text" && (
            <input
              type="text"
              placeholder="Search for recipes (e.g., pasta, chicken, tacos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {/* Ingredient Search Info */}
          {searchMode === "ingredients" && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <p className="text-sm text-green-700">
                {pantryItems.length > 0 ? (
                  <>
                    Finding recipes with: <strong>{pantryItems.map((i) => i.name).join(", ")}</strong>
                  </>
                ) : (
                  <>
                    No pantry items yet.{" "}
                    <Link href="/pantry" className="underline font-medium">
                      Add some ingredients
                    </Link>{" "}
                    to get personalized recipe suggestions!
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="bg-gray-300 h-48"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Failed to load recipes. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && recipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">
              {searchMode === "text"
                ? "Enter a search term to find recipes"
                : "Add items to your pantry to get recipe suggestions"}
            </p>
          </div>
        )}

        {/* Recipe Grid */}
        {!isLoading && !error && recipes.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">🍽️</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span>⏱️ {recipe.readyInMinutes} min</span>
                      <span>👥 {recipe.servings} servings</span>
                    </div>
                    {recipe.sourceUrl && (
                      <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-2 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Recipe
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
