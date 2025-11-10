// Google Gemini AI Integration
// Using Gemini 2.0 Flash (experimental) for AI generation

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || ""
const GEMINI_MODEL = "gemini-2.0-flash-exp"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

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
    console.log("🤖 Calling Gemini API:", GEMINI_MODEL)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Gemini API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: GEMINI_API_URL,
      })
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data: GeminiResponse = await response.json()
    const text = data.candidates[0]?.content?.parts[0]?.text || ""
    console.log("✅ Gemini API success, generated", text.length, "characters")
    return text
  } catch (error) {
    console.error("Gemini API error:", error)
    throw error
  }
}

// AI-Enhanced Recipe Search
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
    console.error("AI recipe search failed, using fallback:", error)

    // Fallback message when AI is unavailable
    // Provides helpful guidance to user
    return [
      {
        id: 99991,
        title: `AI Search Temporarily Unavailable`,
        ingredients: ["The Google Gemini AI service is currently unavailable"],
        cookingTime: 0,
        servings: 0,
        instructions: `The AI recipe search is temporarily unavailable due to API quota limits or service issues.

Please try one of these alternatives:
1. Use the "Search by Name" tab to find recipes with Spoonacular
2. Use the "Use My Pantry" tab to find recipes based on your ingredients
3. Wait a few moments and try the AI search again

The AI service will automatically resume when available.`,
        tags: ["system-message"],
        image: "",
        sourceUrl: "",
      },
    ]
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
