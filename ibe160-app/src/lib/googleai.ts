// Google Gemini AI Integration
// Using Gemini 1.5 Flash for AI generation

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || ""
const GEMINI_MODEL = "gemini-2.0-flash"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
console.log("Using API key:", GOOGLE_AI_API_KEY?.substring(0, 10) + "...")

interface GeminiRequest {
  contents: {
    parts: {
      text: string
    }[]
  }[]
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string
      }[]
    }
  }[]
}

export async function generateWithGemini(prompt: string): Promise<string> {
  try {
    if (!GOOGLE_AI_API_KEY) {
      throw new Error("Google AI API key is missing")
    }

    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }

    const url = `${GEMINI_API_URL}?key=${GOOGLE_AI_API_KEY}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error:", response.status, errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data: GeminiResponse = await response.json()
    const text = data.candidates[0]?.content?.parts[0]?.text || ""
    return text
  } catch (error) {
    console.error("Gemini API error:", error)
    throw error
  }
}

// AI-Enhanced Recipe Search with Spoonacular Fallback
export async function aiRecipeSearch(query: string, userPreferences?: any) {
  try {
    const prompt = `You are a recipe recommendation AI. Given the user's query and preferences, suggest 5 relevant recipes.

User Query: "${query}"

${userPreferences ? `
User Preferences:
- Dietary Restrictions: ${userPreferences.dietaryRestrictions?.join(", ") || "None"}
- Allergies: ${userPreferences.allergies?.join(", ") || "None"}
- Favorite Cuisines: ${userPreferences.cuisinePreferences?.join(", ") || "None"}
- Disliked Ingredients: ${userPreferences.dislikedIngredients?.join(", ") || "None"}
` : ""}

Return ONLY a JSON array of 5 recipes in this format (no markdown, no extra text):
[
  {
    "title": "Recipe Name",
    "ingredients": ["ingredient1", "ingredient2"],
    "cookingTime": 30,
    "servings": 4,
    "instructions": "Step-by-step instructions",
    "tags": ["vegetarian", "quick", "easy"]
  }
]`

    const response = await generateWithGemini(prompt)

    // Extract JSON from response (remove markdown code blocks if present)
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("AI recipe search failed:", error)

    // Fallback: Use Spoonacular API
    try {
      const { searchRecipes } = await import('./spoonacular')
      const recipes = await searchRecipes(query, 5)

      if (recipes && recipes.length > 0) {
        return recipes.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings,
          sourceUrl: recipe.sourceUrl,
        }))
      }
    } catch (spoonacularError) {
      console.error("Spoonacular fallback failed:", spoonacularError)
    }

    return []
  }
}

// Ingredient Substitution AI
export async function suggestSubstitutions(ingredient: string, reason?: string) {
  const prompt = `Suggest 3-5 ingredient substitutions for "${ingredient}" in cooking.
${reason ? `Reason for substitution: ${reason}` : ""}

Return ONLY a JSON array (no markdown, no extra text):
[
  {
    "substitute": "ingredient name",
    "ratio": "1:1",
    "notes": "how it affects the dish"
  }
]`

  const response = await generateWithGemini(prompt)

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("Failed to parse substitution response:", error)
    return []
  }
}

// Smart Shopping Suggestions
export async function generateShoppingSuggestions(pantryItems: any[], expiringItems: any[]) {
  const prompt = `Based on the user's pantry and expiring items, suggest smart shopping items to buy.

Current Pantry Items:
${pantryItems.map((item) => `- ${item.name} (${item.quantity} ${item.unit})`).join("\n")}

Items Expiring Soon:
${expiringItems.map((item) => `- ${item.name} (expires in ${item.daysLeft} days)`).join("\n")}

Suggest 5-10 items to buy that would:
1. Complement expiring ingredients (to use them in recipes)
2. Replenish low-stock staples
3. Enable new recipe possibilities

Return ONLY a JSON array (no markdown):
[
  {
    "item": "item name",
    "category": "category",
    "reason": "why to buy this",
    "priority": "high|medium|low"
  }
]`

  const response = await generateWithGemini(prompt)

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("Failed to parse shopping suggestions:", error)
    return []
  }
}

// Recipe Nutrition Analysis
export async function analyzeNutrition(recipe: any) {
  const prompt = `Analyze the nutritional content of this recipe:

Title: ${recipe.title}
Servings: ${recipe.servings}
Ingredients:
${recipe.ingredients?.join("\n") || "No ingredients listed"}

Estimate nutritional values PER SERVING. Return ONLY a JSON object (no markdown):
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "sodium": number,
  "sugar": number,
  "healthScore": number (1-100),
  "notes": "brief nutritional highlights"
}`

  const response = await generateWithGemini(prompt)

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("Failed to parse nutrition analysis:", error)
    return null
  }
}
