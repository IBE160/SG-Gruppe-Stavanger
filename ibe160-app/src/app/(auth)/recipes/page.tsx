// Recipes page - browse and search recipes
// Stub implementation for sandbox (Spoonacular API unavailable)

"use client"

import { useState } from "react"
import Link from "next/link"

interface Recipe {
  id: string
  title: string
  image: string
  cookingTime: number
  servings: number
  tags: string[]
}

// Stub recipes for demonstration
const stubRecipes: Recipe[] = [
  {
    id: "1",
    title: "Creamy Tomato Pasta",
    image: "🍝",
    cookingTime: 20,
    servings: 4,
    tags: ["Italian", "Vegetarian", "Quick"],
  },
  {
    id: "2",
    title: "Grilled Chicken Salad",
    image: "🥗",
    cookingTime: 25,
    servings: 2,
    tags: ["Healthy", "Protein", "Salad"],
  },
  {
    id: "3",
    title: "Vegetable Stir Fry",
    image: "🍲",
    cookingTime: 15,
    servings: 3,
    tags: ["Asian", "Vegan", "Quick"],
  },
  {
    id: "4",
    title: "Beef Tacos",
    image: "🌮",
    cookingTime: 30,
    servings: 4,
    tags: ["Mexican", "Comfort Food"],
  },
  {
    id: "5",
    title: "Mediterranean Quinoa Bowl",
    image: "🥙",
    cookingTime: 25,
    servings: 2,
    tags: ["Healthy", "Vegetarian", "Bowl"],
  },
  {
    id: "6",
    title: "Chocolate Chip Cookies",
    image: "🍪",
    cookingTime: 25,
    servings: 12,
    tags: ["Dessert", "Baking", "Sweet"],
  },
]

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("")

  // Filter recipes
  const filteredRecipes = stubRecipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || recipe.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  // Get all unique tags
  const allTags = Array.from(new Set(stubRecipes.flatMap((r) => r.tags)))

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

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 mb-8">
          <p className="text-sm text-blue-700">
            🚧 <strong>Demo Mode:</strong> Full recipe search with Spoonacular API will be available in
            production. Currently showing sample recipes.
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-48 flex items-center justify-center">
                <div className="text-8xl">{recipe.image}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <span>⏱️ {recipe.cookingTime} min</span>
                  <span>👥 {recipe.servings} servings</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  disabled
                >
                  View Recipe (Coming Soon)
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No recipes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
