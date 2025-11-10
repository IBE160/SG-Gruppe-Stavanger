// Spoonacular API client
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || ""
const BASE_URL = "https://api.spoonacular.com"

export interface Recipe {
  id: number
  title: string
  image: string
  imageType?: string
  readyInMinutes: number
  servings: number
  sourceUrl?: string
}

export interface RecipeDetails extends Recipe {
  instructions: string
  extendedIngredients: Array<{
    id: number
    name: string
    amount: number
    unit: string
  }>
  summary: string
}

// Search recipes
export async function searchRecipes(query: string, number = 12): Promise<Recipe[]> {
  // Fallback for sandbox/demo if no API key
  if (!API_KEY) {
    console.warn("⚠️ Spoonacular API key missing - using demo data")
    return stubRecipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
  }

  try {
    const url = `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=${number}&addRecipeInformation=true`
    const response = await fetch(url)

    // Check if API key is invalid, access denied, or quota exceeded
    if (response.status === 401 || response.status === 402 || response.status === 403) {
      const reason = response.status === 402 ? "quota exceeded" : "invalid or inactive API key"
      console.error(`🔑 Spoonacular API: ${reason} - using demo data`)
      return stubRecipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    }

    if (!response.ok) {
      console.warn(`⚠️ Spoonacular API error ${response.status} - falling back to demo data`)
      return stubRecipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    }

    const data = await response.json()
    console.log("✅ Spoonacular API call successful")
    return data.results || []
  } catch (error) {
    console.error("Spoonacular API error:", error)
    console.warn("⚠️ Falling back to demo data")
    // Fallback to stub data
    return stubRecipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
  }
}

// Search by ingredients
export async function searchByIngredients(
  ingredients: string[],
  number = 12
): Promise<Recipe[]> {
  if (!API_KEY) {
    console.warn("⚠️ Spoonacular API key missing - using demo data")
    return stubRecipes
  }

  try {
    const ingredientString = ingredients.join(",")
    const url = `${BASE_URL}/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${encodeURIComponent(ingredientString)}&number=${number}`
    const response = await fetch(url)

    // Check if API key is invalid, access denied, or quota exceeded
    if (response.status === 401 || response.status === 402 || response.status === 403) {
      const reason = response.status === 402 ? "quota exceeded" : "invalid or inactive API key"
      console.error(`🔑 Spoonacular API: ${reason} - using demo data`)
      return stubRecipes
    }

    if (!response.ok) {
      console.warn(`⚠️ Spoonacular API error ${response.status} - falling back to demo data`)
      return stubRecipes
    }

    const data = await response.json()
    console.log("✅ Spoonacular API call successful (by ingredients)")
    return data || []
  } catch (error) {
    console.error("Spoonacular API error:", error)
    console.warn("⚠️ Falling back to demo data")
    return stubRecipes
  }
}

// Get recipe details
export async function getRecipeDetails(id: number): Promise<RecipeDetails | null> {
  if (!API_KEY) {
    const stubRecipe = stubRecipes.find((r) => r.id === id)
    if (!stubRecipe) return null

    return {
      ...stubRecipe,
      instructions: "Sample instructions for demo mode. Full recipe details available with Spoonacular API.",
      extendedIngredients: [
        { id: 1, name: "Sample ingredient 1", amount: 2, unit: "cups" },
        { id: 2, name: "Sample ingredient 2", amount: 1, unit: "tbsp" },
      ],
      summary: "This is a demo recipe. Connect Spoonacular API for real recipe data.",
    }
  }

  try {
    const url = `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch recipe details")
    }

    return await response.json()
  } catch (error) {
    console.error("Spoonacular API error:", error)
    return null
  }
}

// Stub recipes for demo/sandbox with real Unsplash images
const stubRecipes: Recipe[] = [
  {
    id: 1,
    title: "Creamy Tomato Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 20,
    servings: 4,
  },
  {
    id: 2,
    title: "Grilled Chicken Salad",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 25,
    servings: 2,
  },
  {
    id: 3,
    title: "Vegetable Stir Fry",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 15,
    servings: 3,
  },
  {
    id: 4,
    title: "Beef Tacos",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 30,
    servings: 4,
  },
  {
    id: 5,
    title: "Mediterranean Quinoa Bowl",
    image: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 25,
    servings: 2,
  },
  {
    id: 6,
    title: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 25,
    servings: 12,
  },
  {
    id: 7,
    title: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 45,
    servings: 4,
  },
  {
    id: 8,
    title: "Chicken Curry",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 40,
    servings: 6,
  },
  {
    id: 9,
    title: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 15,
    servings: 2,
  },
  {
    id: 10,
    title: "Sushi Rolls",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 60,
    servings: 4,
  },
  {
    id: 11,
    title: "Banana Bread",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 75,
    servings: 8,
  },
  {
    id: 12,
    title: "Thai Pad Thai",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop&q=80",
    readyInMinutes: 25,
    servings: 2,
  },
]
