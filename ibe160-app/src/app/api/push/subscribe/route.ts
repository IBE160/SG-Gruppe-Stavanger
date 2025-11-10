import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/push/subscribe - Save push subscription
export async function POST(req: NextRequest) {
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

    const { subscription } = await req.json()

    // Save subscription to user preferences
    await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {
        pushNotifications: true,
        pushSubscription: JSON.stringify(subscription),
      },
      create: {
        userId: user.id,
        pushNotifications: true,
        pushSubscription: JSON.stringify(subscription),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}

// DELETE /api/push/subscribe - Remove push subscription
export async function DELETE(req: NextRequest) {
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

    await prisma.userPreference.update({
      where: { userId: user.id },
      data: {
        pushNotifications: false,
        pushSubscription: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json({ error: "Failed to remove subscription" }, { status: 500 })
  }
}
