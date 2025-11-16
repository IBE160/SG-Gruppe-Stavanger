// API route for individual pantry item operations
// Now using Prisma + Supabase for persistent storage

import { NextResponse } from "next/server"
import { foodItemSchema } from "@/lib/validation/pantry"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Please sign in" } },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    console.log("[PUT] Updating item:", id, "with data:", body)

    // Validate input
    const validation = foodItemSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      console.error("[PUT] Validation error:", firstError)
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: firstError.message } },
        { status: 422 }
      )
    }

    // Update in Supabase database (only if item belongs to user)
    const item = await prisma.foodItem.updateMany({
      where: {
        id: id,
        userId: session.user.id // Security: only update own items
      },
      data: {
        name: validation.data.name,
        category: validation.data.category,
        quantity: validation.data.quantity,
        unit: validation.data.unit,
        bestBeforeDate: new Date(validation.data.bestBeforeDate),
        image: validation.data.image,
      }
    })

    if (item.count === 0) {
      console.error("[PUT] Item not found or unauthorized:", id)
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Item not found" } },
        { status: 404 }
      )
    }

    // Fetch and return updated item
    const updatedItem = await prisma.foodItem.findUnique({
      where: { id }
    })

    console.log("[PUT] Successfully updated item:", updatedItem)
    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error("Error updating pantry item:", error)
    return NextResponse.json(
      { error: { code: "UPDATE_ERROR", message: "Failed to update item" } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Please sign in" } },
        { status: 401 }
      )
    }

    const { id } = await params

    // Delete from Supabase database (only if item belongs to user)
    const deleted = await prisma.foodItem.deleteMany({
      where: {
        id: id,
        userId: session.user.id // Security: only delete own items
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Item not found" } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" })
  } catch (error) {
    console.error("Error deleting pantry item:", error)
    return NextResponse.json(
      { error: { code: "DELETE_ERROR", message: "Failed to delete item" } },
      { status: 500 }
    )
  }
}
