import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { generateShoppingSuggestions } from "@/lib/googleai"

// GET /api/ai/shopping - Generate smart shopping suggestions
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { foodItems: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate expiring items (within 3 days)
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    const expiringItems = user.foodItems
      .filter((item: any) => new Date(item.bestBeforeDate) <= threeDaysFromNow)
      .map((item: any) => ({
        name: item.name,
        daysLeft: Math.ceil(
          (new Date(item.bestBeforeDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
      }))

    const suggestions = await generateShoppingSuggestions(user.foodItems, expiringItems)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Shopping suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate shopping suggestions" }, { status: 500 })
  }
}
