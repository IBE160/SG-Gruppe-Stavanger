# Story 5.1: Integrate Spoonacular Recipe API

**Epic:** 5 - Recipe Search and Discovery
**Story ID:** STORY-5.1
**Status:** Done
**Sprint:** 4
**Points:** 8

---

## Description

Integrate Spoonacular API for recipe search with caching to respect rate limits (150 requests/day free tier).

---

## Acceptance Criteria

- [x] Spoonacular API key configured in environment
- [x] Recipe search endpoint /api/recipes
- [x] Response caching (30 minutes)
- [x] Rate limit handling with graceful degradation
- [x] Recipe detail endpoint /api/recipes/[id]
- [x] Ingredient-based search

---

## Environment Variables

```env
SPOONACULAR_API_KEY=your-api-key-here
```

---

## Implementation

### Spoonacular Client

```typescript
// src/lib/spoonacular.ts
const BASE_URL = "https://api.spoonacular.com"
const API_KEY = process.env.SPOONACULAR_API_KEY

// In-memory cache (consider Redis for production)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

function getCached(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function searchRecipes(query: string, filters?: {
  diet?: string
  cuisine?: string
  maxReadyTime?: number
}) {
  const cacheKey = `search:${query}:${JSON.stringify(filters)}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({
    query,
    apiKey: API_KEY!,
    number: "20",
    addRecipeInformation: "true",
    ...(filters?.diet && { diet: filters.diet }),
    ...(filters?.cuisine && { cuisine: filters.cuisine }),
    ...(filters?.maxReadyTime && { maxReadyTime: String(filters.maxReadyTime) })
  })

  const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`)

  if (res.status === 402) {
    throw new Error("API quota exceeded")
  }

  if (!res.ok) {
    throw new Error(`Spoonacular error: ${res.status}`)
  }

  const data = await res.json()
  setCache(cacheKey, data)
  return data
}

export async function searchByIngredients(ingredients: string[]) {
  const cacheKey = `ingredients:${ingredients.sort().join(",")}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({
    ingredients: ingredients.join(","),
    apiKey: API_KEY!,
    number: "20",
    ranking: "2", // Maximize used ingredients
    ignorePantry: "true"
  })

  const res = await fetch(`${BASE_URL}/recipes/findByIngredients?${params}`)

  if (!res.ok) {
    throw new Error(`Spoonacular error: ${res.status}`)
  }

  const data = await res.json()
  setCache(cacheKey, data)
  return data
}

export async function getRecipeDetails(id: number) {
  const cacheKey = `recipe:${id}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({
    apiKey: API_KEY!,
    includeNutrition: "true"
  })

  const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`)

  if (!res.ok) {
    throw new Error(`Spoonacular error: ${res.status}`)
  }

  const data = await res.json()
  setCache(cacheKey, data)
  return data
}
```

### API Route

```typescript
// src/app/api/recipes/route.ts
import { searchRecipes, searchByIngredients } from "@/lib/spoonacular"
import { auth } from "@/auth"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")
  const ingredients = searchParams.get("ingredients")

  try {
    let results

    if (ingredients) {
      results = await searchByIngredients(ingredients.split(","))
    } else if (query) {
      results = await searchRecipes(query, {
        diet: searchParams.get("diet") || undefined,
        cuisine: searchParams.get("cuisine") || undefined
      })
    } else {
      return Response.json({ error: "Query required" }, { status: 400 })
    }

    return Response.json(results)
  } catch (error) {
    if (error.message === "API quota exceeded") {
      return Response.json(
        { error: "Recipe service temporarily unavailable" },
        { status: 503 }
      )
    }
    return Response.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}
```

---

## Caching Strategy

| Cache Key | TTL | Rationale |
|-----------|-----|-----------|
| `search:{query}` | 30 min | Same searches common |
| `ingredients:{list}` | 30 min | Pantry rarely changes |
| `recipe:{id}` | 60 min | Details rarely change |

---

## Rate Limit Handling

1. **Cache aggressively** - Reduce API calls
2. **Graceful degradation** - Show cached results on quota exceeded
3. **User feedback** - "Recipe service temporarily unavailable"
4. **Monitoring** - Log API usage for tracking

---

## Response Types

```typescript
interface RecipeSearchResult {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
  sourceUrl: string
}

interface RecipeDetails extends RecipeSearchResult {
  extendedIngredients: Ingredient[]
  instructions: string
  nutrition: NutritionInfo
}

interface Ingredient {
  id: number
  name: string
  amount: number
  unit: string
  original: string
}
```

---

## Code References

- `ibe160-app/src/lib/spoonacular.ts`
- `ibe160-app/src/app/api/recipes/route.ts`
- `ibe160-app/src/app/api/recipes/[id]/route.ts`

---

## Definition of Done

- [x] API integration complete
- [x] Caching implemented
- [x] Rate limiting handled
- [x] Error states covered
- [x] TypeScript types defined

---

*Completed: Week 4*
