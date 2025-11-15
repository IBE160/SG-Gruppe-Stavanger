import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
// import prisma from "@/lib/prisma"  // Temporarily disabled - Prisma client not generated yet
import { generateWithGemini } from "@/lib/googleai"

// POST /api/ai/grocery - AI grocery shopping suggestions
export async function POST(req: NextRequest) {
  try {
    console.log("🛒 AI Grocery API called")
    console.log("Environment check - GOOGLE_AI_API_KEY exists:", !!process.env.GOOGLE_AI_API_KEY)
    console.log("Environment check - NEXT_PUBLIC_GOOGLE_AI_API_KEY exists:", !!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY)

    const session = await auth()
    if (!session?.user?.email) {
      console.log("❌ Unauthorized - no session")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("✅ User authenticated:", session.user.email)

    const { prompt } = await req.json()
    console.log("📝 User prompt:", prompt)

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // NOTE: Pantry checking temporarily disabled
    // Waiting for Prisma client generation (run: npx prisma generate)
    console.log("📦 Skipping pantry check (Prisma client not available)")

    // Generate AI shopping suggestions
    const aiPrompt = `You are a smart grocery shopping assistant. The user wants to make: "${prompt}"

Suggest the key ingredients they need to buy for this meal.

Return ONLY a JSON array of ingredient names (no markdown, no extra text):
["ingredient1", "ingredient2", "ingredient3"]

Keep it simple and practical. Maximum 10 essential items.`

    console.log("🤖 Calling Gemini API...")
    const response = await generateWithGemini(aiPrompt)
    console.log("✅ Gemini API response received:", response.substring(0, 200) + "...")

    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*?\]/)
    if (!jsonMatch) {
      console.error("❌ No JSON found in AI response. Full response:", response)
      throw new Error("No JSON found in AI response")
    }

    console.log("📋 Extracted JSON:", jsonMatch[0])
    const items = JSON.parse(jsonMatch[0])
    console.log("✅ Successfully parsed", items.length, "items:", items)

    return NextResponse.json({ items })
  } catch (error) {
    console.error("❌ AI grocery search error - FULL DETAILS:", error)
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")

    const errorMessage = error instanceof Error ? error.message : "Failed to generate AI suggestions"
    return NextResponse.json({
      error: "Failed to generate AI suggestions",
      details: errorMessage
    }, { status: 500 })
  }
}
