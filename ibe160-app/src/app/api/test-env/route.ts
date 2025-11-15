import { NextResponse } from "next/server"

// Simple test endpoint to check environment variables
export async function GET() {
  return NextResponse.json({
    hasGoogleKey: !!process.env.GOOGLE_AI_API_KEY,
    hasPublicGoogleKey: !!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY,
    hasSpoonacularKey: !!process.env.SPOONACULAR_API_KEY,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDirectUrl: !!process.env.DIRECT_URL,
    nodeEnv: process.env.NODE_ENV,
    // Don't log actual keys/URLs for security, just lengths
    googleKeyLength: process.env.GOOGLE_AI_API_KEY?.length || 0,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    // Show first 20 chars of DATABASE_URL to verify it's correct
    databaseUrlPreview: process.env.DATABASE_URL?.substring(0, 30) + "..." || "not set",
  })
}
