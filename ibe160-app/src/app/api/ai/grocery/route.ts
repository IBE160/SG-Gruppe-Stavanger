import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { generateWithGemini } from "@/lib/googleai"

// POST /api/ai/grocery - AI grocery shopping suggestions
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Fetch user's pantry items
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { foodItems: true },
    })

    const pantryItems = user?.foodItems || []
    const pantryItemNames = pantryItems.map((item) => item.name)

    // Generate AI shopping suggestions
    const aiPrompt = `You are a smart grocery shopping assistant. The user wants to make: "${prompt}"

Current Pantry Items:
${pantryItemNames.length > 0 ? pantryItemNames.join(", ") : "Empty pantry"}

Based on what they want to cook and what they already have, suggest ONLY the missing ingredients they need to buy.

Return ONLY a JSON array of ingredient names (no markdown, no extra text):
["ingredient1", "ingredient2", "ingredient3"]

Keep it simple and practical. Maximum 10 items.`

    const response = await generateWithGemini(aiPrompt)

    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*?\]/)
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response")
    }

    const items = JSON.parse(jsonMatch[0])
    return NextResponse.json({ items })
  } catch (error) {
    console.error("AI grocery search error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate AI suggestions"
    return NextResponse.json({
      error: "Failed to generate AI suggestions",
      details: errorMessage
    }, { status: 500 })
  }
}
