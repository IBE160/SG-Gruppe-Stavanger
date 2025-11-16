// Auth.js API route handler
// Using real authentication with Prisma + Supabase

import { handlers } from "@/lib/auth"

// Force Node.js runtime for Prisma compatibility on Vercel
export const runtime = 'nodejs'

export const { GET, POST } = handlers
