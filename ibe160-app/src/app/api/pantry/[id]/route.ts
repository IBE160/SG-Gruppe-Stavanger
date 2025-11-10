// API route for individual pantry item operations
// Stub implementation for sandbox (Prisma engines unavailable)

import { NextResponse } from "next/server"
import { foodItemSchema } from "@/lib/validation/pantry"
import { updateStubItem, deleteStubItem } from "@/lib/stubData"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Stub: Update in-memory store
    // In production: const session = await auth()
    // In production: const item = await prisma.foodItem.update({ where: { id, userId: session.user.id }, data: validation.data })

    const updatedItem = updateStubItem(id, {
      ...validation.data,
      bestBeforeDate: new Date(validation.data.bestBeforeDate).toISOString(),
    })

    if (!updatedItem) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Item not found" } },
        { status: 404 }
      )
    }

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
    const { id } = await params

    // Stub: Delete from in-memory store
    // In production: const session = await auth()
    // In production: await prisma.foodItem.delete({ where: { id, userId: session.user.id } })

    const deleted = deleteStubItem(id)

    if (!deleted) {
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
