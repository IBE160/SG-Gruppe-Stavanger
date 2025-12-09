import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { suggestSubstitutions } from "@/lib/googleai"

// POST /api/ai/substitute - Get ingredient substitution suggestions
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ingredient, reason } = await req.json()

    if (!ingredient) {
      return NextResponse.json({ error: "Ingredient is required" }, { status: 400 })
    }

    const substitutions = await suggestSubstitutions(ingredient, reason)

    return NextResponse.json({ substitutions })
  } catch (error) {
    console.error("Substitution error:", error)
    return NextResponse.json({ error: "Failed to generate substitutions" }, { status: 500 })
  }
}
