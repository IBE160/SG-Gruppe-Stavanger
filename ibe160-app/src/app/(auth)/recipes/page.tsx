// Recipes page - browse and search recipes with Spoonacular API
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRecipeSearch } from "@/hooks/useRecipes"
import { usePantryItems } from "@/hooks/usePantry"
import { searchByIngredients } from "@/lib/spoonacular"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Search, ChefHat, Sparkles, Clock, Users, Lightbulb, ShoppingBag, UtensilsCrossed, Salad, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"text" | "ingredients" | "ai">("text")
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)

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
    isPending: aiLoading,
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
      const data = await res.json()
      return data.recipes || []
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
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Pantry
              </Link>
              <Link
                href="/recipes"
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg"
              >
                Recipes
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
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-2">Recipe Browser</h1>
          <p className="text-gray-600">Discover recipes with AI, search by name, or use your pantry</p>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <ChefHat className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-800">
              <strong>Powered by Spoonacular & Google Gemini AI:</strong> Search recipes by name,
              use your pantry ingredients, or ask AI for personalized suggestions!
            </p>
          </div>
        </div>

        {/* Search Mode Toggle */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setSearchMode("text")}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${
                searchMode === "text"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Search className="w-5 h-5" />
              Search by Name
            </button>
            <button
              onClick={() => setSearchMode("ingredients")}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${
                searchMode === "ingredients"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Use My Pantry ({pantryItems.length})
            </button>
            <button
              onClick={() => setSearchMode("ai")}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${
                searchMode === "ai"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Sparkles className="w-5 h-5" />
              AI Search
            </button>
          </div>

          {/* Text Search */}
          {searchMode === "text" && (
            <input
              type="text"
              placeholder="Search for recipes (e.g., pasta, chicken, tacos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
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
                  className="airbnb-input pr-28"
                />
                <button
                  onClick={handleAISearch}
                  disabled={aiQuery.trim().length === 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  Search
                </button>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-purple-800">
                    <strong>AI Tips:</strong> Ask for recipes based on dietary preferences, cuisine
                    styles, cooking time, or specific ingredients. The AI respects your user
                    preferences automatically!
                  </p>
                </div>
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
            <div className="flex justify-center mb-4">
              {searchMode === "ai" ? (
                <Sparkles className="w-16 h-16 text-gray-300" />
              ) : (
                <Search className="w-16 h-16 text-gray-300" />
              )}
            </div>
            <p className="text-gray-600 text-lg">
              {searchMode === "text"
                ? "Enter a search term to find recipes"
                : searchMode === "ai"
                  ? "Ask AI for recipe suggestions"
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
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Hide image and show fallback icon on error
                          e.currentTarget.style.display = 'none'
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            parent.innerHTML = '<svg class="w-20 h-20 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
                          }
                        }}
                      />
                    ) : (
                      <UtensilsCrossed className="w-20 h-20 text-orange-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
                      {recipe.title}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.readyInMinutes || recipe.cookingTime || "N/A"} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} servings
                      </span>
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
                      <button
                        onClick={() => setSelectedRecipe(recipe)}
                        className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recipe Details Modal */}
        {selectedRecipe && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 pr-8">
                    {selectedRecipe.title}
                  </h2>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="flex gap-4 text-sm text-gray-600 mb-6">
                  {selectedRecipe.cookingTime > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedRecipe.cookingTime} min
                    </span>
                  )}
                  {selectedRecipe.servings > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedRecipe.servings} servings
                    </span>
                  )}
                </div>

                {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedRecipe.ingredients.map((ingredient: string, idx: number) => (
                        <li key={idx} className="text-gray-700">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedRecipe.instructions && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                    <div className="text-gray-700 whitespace-pre-line">
                      {selectedRecipe.instructions}
                    </div>
                  </div>
                )}

                {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
