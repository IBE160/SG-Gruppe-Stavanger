import { NextRequest, NextResponse } from "next/server"

// GET /api/barcode/[code] - Lookup product info by barcode
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    // Use Open Food Facts API (free, no API key required)
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`)
    const data = await response.json()

    if (data.status === 0 || !data.product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = data.product

    // Extract relevant information
    const productInfo = {
      name: product.product_name || "Unknown Product",
      brand: product.brands || "",
      category: product.categories_tags?.[0]?.replace("en:", "") || "other",
      image: product.image_url || "",
      quantity: product.quantity || "",
      nutrition: {
        calories: product.nutriments?.["energy-kcal_100g"] || 0,
        protein: product.nutriments?.proteins_100g || 0,
        carbs: product.nutriments?.carbohydrates_100g || 0,
        fat: product.nutriments?.fat_100g || 0,
        fiber: product.nutriments?.fiber_100g || 0,
        sodium: product.nutriments?.sodium_100g || 0,
      },
      allergens: product.allergens_tags || [],
      ingredients: product.ingredients_text || "",
    }

    return NextResponse.json(productInfo)
  } catch (error) {
    console.error("Barcode lookup error:", error)
    return NextResponse.json({ error: "Failed to lookup product" }, { status: 500 })
  }
}
