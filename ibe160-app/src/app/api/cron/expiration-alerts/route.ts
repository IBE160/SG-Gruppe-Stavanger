import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendExpirationAlert } from "@/lib/email"
import { sendPushNotification } from "@/lib/push"

// GET /api/cron/expiration-alerts - Send daily expiration alerts
// This should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    // Find all users with email notifications enabled
    const usersWithNotifications = await prisma.user.findMany({
      where: {
        preferences: {
          emailNotifications: true,
        },
      },
      include: {
        foodItems: true,
        preferences: true,
      },
    })

    let emailsSent = 0
    let pushNotificationsSent = 0

    for (const user of usersWithNotifications) {
      // Find expiring items (within 3 days)
      const expiringItems = user.foodItems.filter(
        (item: any) => new Date(item.bestBeforeDate) <= threeDaysFromNow
      )

      if (expiringItems.length === 0) continue

      const itemsForAlert = expiringItems.map((item: any) => ({
        name: item.name,
        daysLeft: Math.ceil(
          (new Date(item.bestBeforeDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
        quantity: item.quantity,
        unit: item.unit,
      }))

      // Send email alert
      if (user.preferences?.emailNotifications && user.email) {
        const result = await sendExpirationAlert(user.email, user.name || "there", itemsForAlert)
        if (result.success) {
          emailsSent++

          // Log email alert in database
          for (const item of expiringItems) {
            await prisma.emailAlert.create({
              data: {
                userId: user.id,
                foodItemId: item.id,
                emailType: item.daysLeft < 0 ? "expired" : "expiring_soon",
              },
            })
          }
        }
      }

      // Send push notification
      if (user.preferences?.pushNotifications && user.preferences.pushSubscription) {
        try {
          const subscription = JSON.parse(user.preferences.pushSubscription)
          await sendPushNotification(subscription, {
            title: "🔔 Food Expiration Alert",
            body: `${expiringItems.length} items in your pantry need attention!`,
            icon: "/icon-192x192.png",
            data: {
              url: "/alerts",
            },
          })
          pushNotificationsSent++
        } catch (error) {
          console.error("Push notification error for user", user.id, error)
        }
      }
    }

    return NextResponse.json({
      success: true,
      usersProcessed: usersWithNotifications.length,
      emailsSent,
      pushNotificationsSent,
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
