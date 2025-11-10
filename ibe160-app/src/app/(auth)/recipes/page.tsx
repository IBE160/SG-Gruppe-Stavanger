// Recipes page - browse and search recipes with Spoonacular API
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRecipeSearch } from "@/hooks/useRecipes"
import { usePantryItems } from "@/hooks/usePantry"
import { searchByIngredients } from "@/lib/spoonacular"
import { useQuery, useMutation } from "@tanstack/react-query"

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"text" | "ingredients" | "ai">("text")

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

  // AI-enhanced search with Google Gemini
  const {
    data: aiResults = [],
    isLoading: aiLoading,
    error: aiError,
    mutate: searchAI,
  } = useMutation({
    mutationFn: async (query: string) => {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      if (!res.ok) {
        throw new Error("AI search failed")
      }
      return res.json()
    },
  })

  // Handle AI search on query change
  const handleAISearch = () => {
    if (aiQuery.trim().length > 0) {
      searchAI(aiQuery)
    }
  }

  const recipes =
    searchMode === "text"
      ? textResults
      : searchMode === "ingredients"
        ? ingredientResults
        : aiResults
  const isLoading =
    searchMode === "text"
      ? textLoading
      : searchMode === "ingredients"
        ? ingredientLoading
        : aiLoading
  const error =
    searchMode === "text"
      ? textError
      : searchMode === "ingredients"
        ? ingredientError
        : aiError

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
        <div className="airbnb-card p-6 mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <p className="text-sm text-gray-800">
            🍳 <strong>Powered by Spoonacular & Google Gemini AI:</strong> Search recipes by name,
            use your pantry ingredients, or ask AI for personalized suggestions!
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="airbnb-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <button
              onClick={() => setSearchMode("text")}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                searchMode === "text"
                  ? "airbnb-button-primary"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🔍 Search by Name
            </button>
            <button
              onClick={() => setSearchMode("ingredients")}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                searchMode === "ingredients"
                  ? "airbnb-button-primary"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🥘 Use My Pantry ({pantryItems.length})
            </button>
            <button
              onClick={() => setSearchMode("ai")}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                searchMode === "ai"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🤖 AI Search
            </button>
          </div>

          {/* Text Search */}
          {searchMode === "text" && (
            <input
              type="text"
              placeholder="Search for recipes (e.g., pasta, chicken, tacos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="airbnb-input"
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

          {/* AI Search */}
          {searchMode === "ai" && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask AI anything... (e.g., 'healthy vegetarian dinner with chickpeas')"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                  className="airbnb-input pr-24"
                />
                <button
                  onClick={handleAISearch}
                  disabled={aiQuery.trim().length === 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🤖 Search
                </button>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                <p className="text-sm text-purple-800">
                  <strong>💡 AI Tips:</strong> Ask for recipes based on dietary preferences, cuisine
                  styles, cooking time, or specific ingredients. The AI respects your user
                  preferences automatically!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="airbnb-card overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-56"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-100 rounded mt-4"></div>
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
              {recipes.map((recipe: any) => (
                <div
                  key={recipe.id || recipe.title}
                  className="airbnb-card overflow-hidden hover-lift group cursor-pointer"
                >
                  <div className="h-56 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center overflow-hidden">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-7xl">🍽️</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
                      {recipe.title}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span>⏱️ {recipe.readyInMinutes || recipe.cookingTime || "N/A"} min</span>
                      <span>👥 {recipe.servings} servings</span>
                    </div>
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {recipe.sourceUrl ? (
                      <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="airbnb-button-primary text-center block"
                      >
                        View Recipe
                      </a>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        AI-generated recipe (expand for details)
                      </div>
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
