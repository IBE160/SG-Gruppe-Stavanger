import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { aiRecipeSearch } from "@/lib/googleai"

// POST /api/ai/search - AI-enhanced recipe search
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Fetch user preferences
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true },
    })

    let preferences = null
    if (user?.preferences) {
      preferences = {
        dietaryRestrictions: JSON.parse(user.preferences.dietaryRestrictions || "[]"),
        allergies: JSON.parse(user.preferences.allergies || "[]"),
        cuisinePreferences: JSON.parse(user.preferences.cuisinePreferences || "[]"),
        dislikedIngredients: JSON.parse(user.preferences.dislikedIngredients || "[]"),
      }
    }

    // Generate AI recipe suggestions
    const recipes = await aiRecipeSearch(query, preferences)

    return NextResponse.json({ recipes })
  } catch (error) {
    console.error("AI search error:", error)
    return NextResponse.json({ error: "Failed to generate AI search results" }, { status: 500 })
  }
}
