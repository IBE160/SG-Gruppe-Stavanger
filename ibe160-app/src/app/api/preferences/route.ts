import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

// GET /api/preferences - Fetch user preferences
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user.preferences)
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/preferences - Update user preferences
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const {
      dietaryRestrictions,
      allergies,
      cuisinePreferences,
      dislikedIngredients,
      emailNotifications,
    } = body

    const preferences = await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {
        dietaryRestrictions,
        allergies,
        cuisinePreferences,
        dislikedIngredients,
        emailNotifications,
      },
      create: {
        userId: user.id,
        dietaryRestrictions,
        allergies,
        cuisinePreferences,
        dislikedIngredients,
        emailNotifications,
      },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error updating preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
