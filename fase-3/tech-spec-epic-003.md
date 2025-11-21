# Technical Specification: Epic 003 - Pantry Management

**Epic ID:** EPIC-003
**Title:** Food Inventory Management
**Version:** 1.0
**Date:** November 2025

---

## Overview

Complete CRUD operations for pantry items including categories, quantities, expiration dates, and filtering/sorting capabilities.

---

## Technical Requirements

### Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "date-fns": "^2.30.0",
    "zod": "^3.22.0"
  }
}
```

---

## Implementation Tasks

### Task 1: Database Schema

```prisma
model FoodItem {
  id             String    @id @default(cuid())
  name           String
  category       String
  bestBeforeDate DateTime
  quantity       Float
  unit           String
  barcode        String?
  notes          String?
  userId         String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  notifications  Notification[]

  @@index([userId])
  @@index([bestBeforeDate])
  @@index([category])
}
```

### Task 2: API Routes

**File:** `src/app/api/pantry/route.ts`

```typescript
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const itemSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  bestBeforeDate: z.string().datetime(),
  quantity: z.number().positive(),
  unit: z.string(),
  barcode: z.string().optional(),
  notes: z.string().optional()
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")

  const items = await prisma.foodItem.findMany({
    where: {
      userId: session.user.id,
      ...(category && { category })
    },
    orderBy: { bestBeforeDate: "asc" }
  })

  return Response.json(items)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const data = itemSchema.parse(body)

  const item = await prisma.foodItem.create({
    data: {
      ...data,
      userId: session.user.id
    }
  })

  return Response.json(item, { status: 201 })
}
```

**File:** `src/app/api/pantry/[id]/route.ts`

- GET: Single item
- PATCH: Update item
- DELETE: Remove item

### Task 3: React Query Hooks

**File:** `src/hooks/usePantry.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function usePantryItems(category?: string) {
  return useQuery({
    queryKey: ["pantry", category],
    queryFn: () => fetch(`/api/pantry${category ? `?category=${category}` : ""}`)
      .then(res => res.json())
  })
}

export function useAddItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item) => fetch("/api/pantry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantry"] })
    }
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => fetch(`/api/pantry/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pantry"] })
    }
  })
}
```

### Task 4: Pantry Page

**File:** `src/app/(auth)/pantry/page.tsx`

- Grid of item cards
- Search input
- Category filter chips
- Sort dropdown
- Add item FAB/button

### Task 5: Add Item Dialog

**File:** `src/components/AddItemDialog.tsx`

- Modal with form
- Category dropdown with icons
- Date picker
- Quantity + unit inputs
- Save/Cancel buttons

### Task 6: Item Card Component

**File:** `src/components/PantryItemCard.tsx`

- Item name and image/icon
- Expiration badge (color-coded)
- Quantity display
- Edit/Delete actions
- Swipe gestures (mobile)

---

## Categories

```typescript
const CATEGORIES = [
  { id: "dairy", name: "Dairy", icon: "🥛" },
  { id: "meat", name: "Meat & Fish", icon: "🥩" },
  { id: "produce", name: "Produce", icon: "🥬" },
  { id: "grains", name: "Grains & Bread", icon: "🍞" },
  { id: "frozen", name: "Frozen", icon: "🧊" },
  { id: "canned", name: "Canned Goods", icon: "🥫" },
  { id: "condiments", name: "Condiments", icon: "🫙" },
  { id: "beverages", name: "Beverages", icon: "🥤" },
  { id: "snacks", name: "Snacks", icon: "🍪" },
  { id: "other", name: "Other", icon: "📦" }
]
```

---

## Expiration Status Logic

```typescript
function getExpirationStatus(date: Date) {
  const days = differenceInDays(date, new Date())

  if (days < 0) return { status: "expired", color: "red" }
  if (days <= 3) return { status: "critical", color: "red" }
  if (days <= 7) return { status: "warning", color: "amber" }
  return { status: "ok", color: "green" }
}
```

---

## Acceptance Criteria

- [ ] User can add items with all fields
- [ ] Items display in grid sorted by expiration
- [ ] Category filtering works
- [ ] Search filters by name
- [ ] Edit updates item correctly
- [ ] Delete removes item with undo
- [ ] Expiration badges color-coded

---

## Code References

- `ibe160-app/src/app/api/pantry/route.ts`
- `ibe160-app/src/app/(auth)/pantry/page.tsx`
- `ibe160-app/src/components/AddItemDialog.tsx`
- `ibe160-app/src/hooks/usePantry.ts`

---

*This tech spec provides implementation guidance for Epic 003.*
