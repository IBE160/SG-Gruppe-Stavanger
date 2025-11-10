// API route for pantry items
// Stub implementation for sandbox (Prisma engines unavailable)

import { NextResponse } from "next/server"
import { foodItemSchema } from "@/lib/validation/pantry"
import { getStubItems, addStubItem } from "@/lib/stubData"

export async function GET() {
  try {
    // Stub: Return in-memory data for sandbox
    // In production: const session = await auth()
    // In production: const items = await prisma.foodItem.findMany({ where: { userId: session.user.id } })

    const items = getStubItems()
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

    // Stub: Add to in-memory store
    // In production: const session = await auth()
    // In production: const item = await prisma.foodItem.create({ data: { ...validation.data, userId: session.user.id } })

    const newItem = {
      id: `item-${Date.now()}`,
      ...validation.data,
      bestBeforeDate: new Date(validation.data.bestBeforeDate).toISOString(),
      createdAt: new Date().toISOString(),
    }

    addStubItem(newItem)

    return NextResponse.json({ item: newItem }, { status: 201 })
  } catch (error) {
    console.error("Error adding pantry item:", error)
    return NextResponse.json(
      { error: { code: "CREATE_ERROR", message: "Failed to add item" } },
      { status: 500 }
    )
  }
}
