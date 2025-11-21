# Technical Specifications: Epics 004-008

**Project:** Smart Food & Recipe Platform
**Version:** 1.0
**Date:** November 2025

---

## Epic 004: Barcode Scanning

### Overview
Camera-based barcode scanning for quick item entry using @zxing/library.

### Key Files
- `src/components/BarcodeScanner.tsx`
- `src/app/api/barcode/route.ts`

### Implementation
```typescript
// BarcodeScanner component using @zxing/library
import { BrowserMultiFormatReader } from "@zxing/library"

// Decodes EAN-13, UPC-A barcodes
// Returns product info via Open Food Facts API fallback
```

### Acceptance Criteria
- [ ] Camera permission requested
- [ ] Live preview displays
- [ ] Barcode decoded automatically
- [ ] Product info auto-fills form
- [ ] Graceful fallback for unknown barcodes

---

## Epic 005: Recipe Discovery

### Overview
Integration with Spoonacular API for recipe search with caching.

### Key Files
- `src/lib/spoonacular.ts`
- `src/app/api/recipes/route.ts`
- `src/app/(auth)/recipes/page.tsx`

### API Integration
```typescript
const SPOONACULAR_BASE = "https://api.spoonacular.com"

export async function searchRecipes(query: string) {
  const cached = await getCache(query)
  if (cached) return cached

  const res = await fetch(
    `${SPOONACULAR_BASE}/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
  )
  const data = await res.json()

  await setCache(query, data, 30 * 60) // 30 min cache
  return data
}
```

### Rate Limiting
- 150 requests/day (free tier)
- Cache results for 30 minutes
- Fallback to local dataset

### Acceptance Criteria
- [ ] Search returns recipes
- [ ] Results cached
- [ ] Recipe details display
- [ ] Rate limiting handled gracefully

---

## Epic 006: Flexible Recipe Matching

### Overview
Match recipes to pantry items, allowing 1-2 missing ingredients.

### Key Files
- `src/hooks/useRecipes.ts`
- `src/lib/recipeMatching.ts`

### Matching Algorithm
```typescript
function calculateMatchPercentage(recipe: Recipe, pantry: FoodItem[]) {
  const pantryNames = pantry.map(p => p.name.toLowerCase())
  const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase())

  const matched = recipeIngredients.filter(ing =>
    pantryNames.some(p => ing.includes(p) || p.includes(ing))
  )

  return {
    percentage: (matched.length / recipeIngredients.length) * 100,
    missing: recipeIngredients.filter(ing => !matched.includes(ing)),
    matched: matched.length
  }
}
```

### Acceptance Criteria
- [ ] Recipes sorted by match %
- [ ] Missing ingredients shown
- [ ] Minimum 60% match threshold
- [ ] Allows 1-2 missing ingredients

---

## Epic 007: Smart Grocery List

### Overview
Generate grocery lists from recipes, excluding items already in pantry.

### Key Files
- `src/app/api/grocery/route.ts`
- `src/app/api/ai/grocery/route.ts`
- `src/app/(auth)/grocery/page.tsx`

### Generation Logic
```typescript
async function generateGroceryList(recipeId: string, userId: string) {
  const recipe = await getRecipe(recipeId)
  const pantry = await getPantryItems(userId)

  const pantryNames = pantry.map(p => p.name.toLowerCase())

  return recipe.ingredients.filter(ing =>
    !pantryNames.some(p => ing.name.toLowerCase().includes(p))
  ).map(ing => ({
    name: ing.name,
    quantity: ing.amount,
    unit: ing.unit,
    section: categorizeIngredient(ing.name)
  }))
}
```

### Features
- Group by store section
- Check/uncheck items
- Add custom items
- Clear completed
- Share list

### Acceptance Criteria
- [ ] List excludes pantry items
- [ ] Grouped by section
- [ ] Items checkable
- [ ] Persists across sessions

---

## Epic 008: Expiration Alerts

### Overview
Notification system for items approaching expiration with email support.

### Key Files
- `src/app/api/notifications/route.ts`
- `src/app/api/cron/expiration-alerts/route.ts`
- `src/app/alerts/page.tsx`

### Cron Job
```typescript
// Runs daily via Vercel Cron or Supabase
export async function GET() {
  const expiringItems = await prisma.foodItem.findMany({
    where: {
      bestBeforeDate: {
        lte: addDays(new Date(), 7),
        gte: new Date()
      }
    },
    include: { user: true }
  })

  for (const item of expiringItems) {
    await prisma.notification.create({
      data: {
        userId: item.userId,
        message: `${item.name} expires in ${getDaysUntil(item.bestBeforeDate)} days`,
        type: "expiration",
        foodItemId: item.id
      }
    })

    // Send email for 1-day items
    if (getDaysUntil(item.bestBeforeDate) <= 1) {
      await sendEmail(item.user.email, "Expiring Tomorrow", ...)
    }
  }
}
```

### Notification Actions
- View recipes using item
- Snooze (1 day, 3 days)
- Dismiss
- Mark as used

### Acceptance Criteria
- [ ] Notifications created for expiring items
- [ ] In-app alerts display
- [ ] Email sent for critical items
- [ ] Snooze postpones alert
- [ ] Dismiss removes alert

---

## Database Models

### Notification
```prisma
model Notification {
  id         String   @id @default(cuid())
  userId     String
  message    String
  type       String   // "expiration", "achievement", "system"
  isRead     Boolean  @default(false)
  snoozedUntil DateTime?
  foodItemId String?
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  foodItem   FoodItem? @relation(fields: [foodItemId], references: [id])

  @@index([userId, isRead])
}

model GroceryItem {
  id         String   @id @default(cuid())
  userId     String
  name       String
  quantity   Float?
  unit       String?
  section    String?
  checked    Boolean  @default(false)
  recipeId   String?
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

---

## Code References

### Epic 004
- `ibe160-app/src/components/BarcodeScanner.tsx`
- `ibe160-app/src/app/api/barcode/route.ts`

### Epic 005
- `ibe160-app/src/lib/spoonacular.ts`
- `ibe160-app/src/app/(auth)/recipes/page.tsx`

### Epic 006
- `ibe160-app/src/hooks/useRecipes.ts`

### Epic 007
- `ibe160-app/src/app/(auth)/grocery/page.tsx`
- `ibe160-app/src/app/api/ai/grocery/route.ts`

### Epic 008
- `ibe160-app/src/app/api/cron/expiration-alerts/route.ts`
- `ibe160-app/src/app/alerts/page.tsx`

---

*This tech spec provides implementation guidance for Epics 004-008.*
