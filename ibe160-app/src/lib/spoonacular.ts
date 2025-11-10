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
    return stubRecipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
  }

  try {
    const url = `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=${number}&addRecipeInformation=true`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch recipes")
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("Spoonacular API error:", error)
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
    return stubRecipes
  }

  try {
    const ingredientString = ingredients.join(",")
    const url = `${BASE_URL}/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${encodeURIComponent(ingredientString)}&number=${number}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch recipes by ingredients")
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error("Spoonacular API error:", error)
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

// Stub recipes for demo/sandbox
const stubRecipes: Recipe[] = [
  {
    id: 1,
    title: "Creamy Tomato Pasta",
    image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Pasta",
    readyInMinutes: 20,
    servings: 4,
  },
  {
    id: 2,
    title: "Grilled Chicken Salad",
    image: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Salad",
    readyInMinutes: 25,
    servings: 2,
  },
  {
    id: 3,
    title: "Vegetable Stir Fry",
    image: "https://via.placeholder.com/300x200/95e1d3/ffffff?text=Stir+Fry",
    readyInMinutes: 15,
    servings: 3,
  },
  {
    id: 4,
    title: "Beef Tacos",
    image: "https://via.placeholder.com/300x200/f38181/ffffff?text=Tacos",
    readyInMinutes: 30,
    servings: 4,
  },
  {
    id: 5,
    title: "Mediterranean Quinoa Bowl",
    image: "https://via.placeholder.com/300x200/aa96da/ffffff?text=Quinoa",
    readyInMinutes: 25,
    servings: 2,
  },
  {
    id: 6,
    title: "Chocolate Chip Cookies",
    image: "https://via.placeholder.com/300x200/fcbad3/ffffff?text=Cookies",
    readyInMinutes: 25,
    servings: 12,
  },
  {
    id: 7,
    title: "Margherita Pizza",
    image: "https://via.placeholder.com/300x200/eeac99/ffffff?text=Pizza",
    readyInMinutes: 45,
    servings: 4,
  },
  {
    id: 8,
    title: "Chicken Curry",
    image: "https://via.placeholder.com/300x200/e06377/ffffff?text=Curry",
    readyInMinutes: 40,
    servings: 6,
  },
  {
    id: 9,
    title: "Caesar Salad",
    image: "https://via.placeholder.com/300x200/c83e4d/ffffff?text=Caesar",
    readyInMinutes: 15,
    servings: 2,
  },
  {
    id: 10,
    title: "Sushi Rolls",
    image: "https://via.placeholder.com/300x200/5f939a/ffffff?text=Sushi",
    readyInMinutes: 60,
    servings: 4,
  },
  {
    id: 11,
    title: "Banana Bread",
    image: "https://via.placeholder.com/300x200/f0b67f/ffffff?text=Bread",
    readyInMinutes: 75,
    servings: 8,
  },
  {
    id: 12,
    title: "Thai Pad Thai",
    image: "https://via.placeholder.com/300x200/d6a2e8/ffffff?text=Pad+Thai",
    readyInMinutes: 25,
    servings: 2,
  },
]
