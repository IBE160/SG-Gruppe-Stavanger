// Recipes page - browse and search recipes with Spoonacular API
"use client"

import { useState, useEffect } from "react"
import DOMPurify from "dompurify"
import Link from "next/link"
import { useRecipeSearch, useRecipeDetails } from "@/hooks/useRecipes"
import { usePantryItems } from "@/hooks/usePantry"
import { searchByIngredients } from "@/lib/spoonacular"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Search, ChefHat, Sparkles, Clock, Users, Lightbulb, ShoppingBag, UtensilsCrossed, Salad, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"text" | "ingredients" | "ai">("text")
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null)
  const [selectedAIRecipeDetails, setSelectedAIRecipeDetails] = useState<any | null>(null) // State for AI recipe details

  // Fetch pantry items for ingredient-based search
  const { data: pantryItems = [] } = usePantryItems()

  // Fetch full recipe details when a Spoonacular recipe is selected
  const { data: selectedSpoonacularRecipe, isLoading: spoonacularRecipeDetailsLoading } = useRecipeDetails(selectedRecipeId)

  // Fallback image mapping for when Spoonacular images fail
  const getFallbackImage = (title: string): string => {
    const lowerTitle = title.toLowerCase()

    // Map recipe keywords to Unsplash food photos
    if (lowerTitle.includes('pasta') || lowerTitle.includes('spaghetti') || lowerTitle.includes('penne')) {
      return 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('pizza')) {
      return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('salad') || lowerTitle.includes('salat')) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('chicken') || lowerTitle.includes('kylling')) {
      return 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('burger') || lowerTitle.includes('hamburger')) {
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('curry')) {
      return 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('soup') || lowerTitle.includes('suppe')) {
      return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('steak') || lowerTitle.includes('beef')) {
      return 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('fish') || lowerTitle.includes('salmon') || lowerTitle.includes('fisk')) {
      return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('taco')) {
      return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('sushi')) {
      return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('dessert') || lowerTitle.includes('cake') || lowerTitle.includes('cookie')) {
      return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&q=80'
    }
    if (lowerTitle.includes('breakfast') || lowerTitle.includes('pancake') || lowerTitle.includes('waffle')) {
      return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&q=80'
    }

    // Default food fallback
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80'
  }

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

  // Determine which recipe details to show
  const recipeToShow = selectedAIRecipeDetails || selectedSpoonacularRecipe;
  const isRecipeDetailsLoading = selectedAIRecipeDetails ? false : spoonacularRecipeDetailsLoading;


  // Handle recipe card click
  const handleRecipeClick = (recipe: any) => {
    if (typeof recipe.id === 'string' && recipe.id.startsWith('ai-')) {
      // It's an AI recipe, set its full details directly
      setSelectedAIRecipeDetails(recipe);
      setSelectedRecipeId(null); // Clear Spoonacular ID
    } else {
      // It's a Spoonacular recipe, set its ID for fetching details
      setSelectedRecipeId(recipe.id);
      setSelectedAIRecipeDetails(null); // Clear AI recipe details
    }
  };

  // Close modal handler
  const closeDetailsModal = () => {
    setSelectedRecipeId(null);
    setSelectedAIRecipeDetails(null);
  };

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
        {/* Hero Section */}
        <div className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Discover Recipes with What You Have
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Our AI-powered recipe search helps you find delicious meals using ingredients
                already in your pantry. No more food waste!
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <UtensilsCrossed className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">10,000+ Recipes</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Smart Matching</span>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop&q=80"
                alt="Delicious food preparation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">AI analyzing your pantry...</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      Tomatoes ✓
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      Chicken ✓
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      Pasta ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Mode Selection */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How would you like to search?</h2>
        </div>

        {/* Segmented Buttons */}
        <div className="flex px-4 py-3">
          <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-gray-200 p-1">
            <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 ${searchMode === "text" ? "bg-white shadow-sm text-[#2D5A3D]" : "text-[#877a64]"} text-sm font-medium leading-normal`}>
              <span className="truncate">Search by Name</span>
              <input
                className="invisible w-0"
                name="search-mode"
                type="radio"
                value="Search by Name"
                checked={searchMode === "text"}
                onChange={() => setSearchMode("text")}
              />
            </label>
            <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 ${searchMode === "ingredients" ? "bg-white shadow-sm text-[#2D5A3D]" : "text-[#877a64]"} text-sm font-medium leading-normal`}>
              <span className="truncate">Use My Pantry</span>
              <input
                className="invisible w-0"
                name="search-mode"
                type="radio"
                value="Use My Pantry"
                checked={searchMode === "ingredients"}
                onChange={() => setSearchMode("ingredients")}
              />
            </label>
            <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 ${searchMode === "ai" ? "bg-white shadow-sm text-[#2D5A3D]" : "text-[#877a64]"} text-sm font-medium leading-normal`}>
              <span className="truncate">AI Search</span>
              <input
                className="invisible w-0"
                name="search-mode"
                type="radio"
                value="AI Search"
                checked={searchMode === "ai"}
                onChange={() => setSearchMode("ai")}
              />
            </label>
          </div>
        </div>

        {/* AI Search Input */}
        {searchMode === "ai" && (
          <div className="flex flex-col gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#333333] text-base font-medium leading-normal pb-2">
                AI Recipe Prompt
              </p>
              <textarea
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#333333] focus:outline-0 focus:ring-2 focus:ring-[#2D5A3D]/50 border border-[#e5e2dc] bg-white min-h-36 placeholder:text-[#877a64] p-[15px] text-base font-normal leading-normal"
                placeholder="A quick, healthy lunch using leftover rice and eggs..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
              ></textarea>
            </label>
            <button
              onClick={handleAISearch}
              disabled={aiQuery.trim().length === 0}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundImage: "linear-gradient(to right, #8A2BE2, #FF69B4)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
              <span className="truncate">AI Search</span>
            </button>
          </div>
        )}

        {/* Text Search */}
        {searchMode === "text" && (
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Search for recipes (e.g., pasta, chicken, tacos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e2dc] rounded-xl text-[#333333] placeholder:text-[#877a64] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/50 focus:border-transparent transition-all bg-white"
            />
          </div>
        )}

        {/* Ingredient Search Info */}
        {searchMode === "ingredients" && (
          <div className="px-4 py-3">
            <div className="bg-[#A8D5BA]/10 border border-[#A8D5BA] rounded-lg px-4 py-3">
              <p className="text-sm text-[#2D5A3D]">
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
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-3 pb-3 animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-xl"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
            {recipes.map((recipe: any) => (
              <div
                key={recipe.id || recipe.title}
                onClick={() => handleRecipeClick(recipe)}
                className="flex flex-col gap-3 pb-3 transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: recipe.image
                      ? `url("${recipe.image}")`
                      : `url("${getFallbackImage(recipe.title)}")`,
                  }}
                ></div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#333333] text-base font-bold leading-normal line-clamp-2">
                    {recipe.title}
                  </p>
                  <div className="flex items-center gap-3 text-[#877a64]">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">timer</span>
                      <p className="text-sm font-normal leading-normal">
                        {recipe.readyInMinutes || recipe.cookingTime || "N/A"} min
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">restaurant</span>
                      <p className="text-sm font-normal leading-normal">{recipe.servings} Servings</p>
                    </div>
                  </div>
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {recipe.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs font-medium bg-[#A8D5BA]/50 text-[#2D5A3D] py-1 px-2.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipe Details Modal */}
        {(selectedRecipeId !== null || selectedAIRecipeDetails !== null) && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/20 p-4"
            onClick={closeDetailsModal}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {isRecipeDetailsLoading ? (
                <div className="p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : recipeToShow ? (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 pr-8">
                      {recipeToShow.title}
                    </h2>
                    <button
                      onClick={closeDetailsModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                  </div>

                  {recipeToShow.image && (
                    <div className="mb-6 rounded-xl overflow-hidden">
                      <img
                        src={recipeToShow.image}
                        alt={recipeToShow.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-4 text-sm text-gray-600 mb-6">
                    {(recipeToShow.readyInMinutes || recipeToShow.cookingTime) && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {(recipeToShow.readyInMinutes || recipeToShow.cookingTime)} min
                      </span>
                    )}
                    {recipeToShow.servings && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipeToShow.servings} servings
                      </span>
                    )}
                  </div>

                  {recipeToShow.extendedIngredients && recipeToShow.extendedIngredients.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {recipeToShow.extendedIngredients.map((ingredient: any, idx: number) => (
                          <li key={idx} className="text-gray-700">
                            {ingredient.original}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recipeToShow.instructions && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                      <div
                        className="text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recipeToShow.instructions) }}
                      />
                    </div>
                  )}

                  {recipeToShow.dishTypes && recipeToShow.dishTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recipeToShow.dishTypes.map((type: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}