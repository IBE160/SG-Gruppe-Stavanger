// Web Push Notifications
import webpush from "web-push"

// VAPID keys (generate with: npx web-push generate-vapid-keys)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ""
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@ibe160.com"

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: {
    title: string
    body: string
    icon?: string
    data?: any
  }
) {
  try {
    await webpush.sendNotification(
      subscription as any,
      JSON.stringify(payload)
    )
    return { success: true }
  } catch (error) {
    console.error("Push notification error:", error)
    return { success: false, error }
  }
}

export async function sendBulkPushNotifications(
  subscriptions: PushSubscription[],
  payload: {
    title: string
    body: string
    icon?: string
    data?: any
  }
) {
  const results = await Promise.allSettled(
    subscriptions.map((sub) => sendPushNotification(sub, payload))
  )

  return {
    successful: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
  }
}
