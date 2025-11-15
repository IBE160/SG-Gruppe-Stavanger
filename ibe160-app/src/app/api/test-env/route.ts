import { NextResponse } from "next/server"

// Simple test endpoint to check environment variables
export async function GET() {
  return NextResponse.json({
    hasGoogleKey: !!process.env.GOOGLE_AI_API_KEY,
    hasPublicGoogleKey: !!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY,
    hasSpoonacularKey: !!process.env.SPOONACULAR_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    // Don't log actual keys for security
    googleKeyLength: process.env.GOOGLE_AI_API_KEY?.length || 0,
  })
}
