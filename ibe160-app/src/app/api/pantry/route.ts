// API route for pantry items
// Now using Prisma + Supabase for persistent storage

import { NextResponse } from "next/server"
import { foodItemSchema } from "@/lib/validation/pantry"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Please sign in" } },
        { status: 401 }
      )
    }

    const items = await prisma.foodItem.findMany({
      where: { userId: session.user.id },
      orderBy: { bestBeforeDate: "asc" }
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching pantry items:", error)
    return NextResponse.json(
      { error: { code: "FETCH_ERROR", message: "Failed to fetch pantry items" } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Please sign in" } },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validation = foodItemSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: firstError.message } },
        { status: 422 }
      )
    }

    // Create item in Supabase database
    const item = await prisma.foodItem.create({
      data: {
        name: validation.data.name,
        category: validation.data.category,
        quantity: validation.data.quantity,
        unit: validation.data.unit,
        bestBeforeDate: new Date(validation.data.bestBeforeDate),
        image: validation.data.image,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error("Error adding pantry item:", error)
    return NextResponse.json(
      { error: { code: "CREATE_ERROR", message: "Failed to add item" } },
      { status: 500 }
    )
  }
}
