import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { analyzeNutrition } from "@/lib/googleai"

// POST /api/ai/nutrition - Analyze recipe nutrition
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recipe = await req.json()

    if (!recipe.title || !recipe.servings) {
      return NextResponse.json({ error: "Invalid recipe data" }, { status: 400 })
    }

    const nutrition = await analyzeNutrition(recipe)

    return NextResponse.json({ nutrition })
  } catch (error) {
    console.error("Nutrition analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze nutrition" }, { status: 500 })
  }
}
