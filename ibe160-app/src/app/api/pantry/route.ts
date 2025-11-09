// API route for pantry items
// Stub implementation for sandbox (Prisma engines unavailable)

import { NextResponse } from "next/server"
import { foodItemSchema } from "@/lib/validation/pantry"

// In-memory store for sandbox (replaced by database in production)
let stubItems = [
  {
    id: "1",
    name: "Milk",
    category: "dairy",
    quantity: 1,
    unit: "L",
    bestBeforeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Cherry Tomatoes",
    category: "produce",
    quantity: 500,
    unit: "g",
    bestBeforeDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Chicken Breast",
    category: "meat",
    quantity: 800,
    unit: "g",
    bestBeforeDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // Stub: Return in-memory data for sandbox
    // In production: const session = await auth()
    // In production: const items = await prisma.foodItem.findMany({ where: { userId: session.user.id } })

    return NextResponse.json({ items: stubItems })
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
      createdAt: new Date().toISOString(),
    }

    stubItems.push(newItem)

    return NextResponse.json({ item: newItem }, { status: 201 })
  } catch (error) {
    console.error("Error adding pantry item:", error)
    return NextResponse.json(
      { error: { code: "CREATE_ERROR", message: "Failed to add item" } },
      { status: 500 }
    )
  }
}
