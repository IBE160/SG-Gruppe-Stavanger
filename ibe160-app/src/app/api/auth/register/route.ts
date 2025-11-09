// Registration API route (stub for sandbox)
// POST /api/auth/register
// TODO: Replace with real implementation when Prisma engines available

import { NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/validation/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: firstError.message } },
        { status: 422 }
      )
    }

    // Stub response for sandbox
    // In production, this will hash password and create user in database
    return NextResponse.json(
      {
        data: {
          id: "stub-user-id",
          email: validation.data.email,
          name: validation.data.name || null,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API:register] Error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    )
  }
}
