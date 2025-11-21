# Story 3.1: Create Pantry Item API

**Epic:** 3 - Food Inventory Management
**Story ID:** STORY-3.1
**Status:** Done
**Sprint:** 2
**Points:** 5

---

## Description

Implement API routes for CRUD operations on pantry items with proper authentication and validation.

---

## Acceptance Criteria

- [x] GET /api/pantry returns user's items sorted by expiration
- [x] POST /api/pantry creates new item
- [x] PATCH /api/pantry/[id] updates item
- [x] DELETE /api/pantry/[id] removes item
- [x] All routes require authentication
- [x] Zod validation on all inputs
- [x] Proper error responses

---

## API Endpoints

### GET /api/pantry

**Query Parameters:**
- `category` (optional) - Filter by category

**Response:**
```json
[
  {
    "id": "cuid",
    "name": "Milk",
    "category": "Dairy",
    "bestBeforeDate": "2025-11-25T00:00:00.000Z",
    "quantity": 1,
    "unit": "liter",
    "barcode": null,
    "notes": null,
    "createdAt": "2025-11-20T10:00:00.000Z"
  }
]
```

### POST /api/pantry

**Request Body:**
```json
{
  "name": "Milk",
  "category": "Dairy",
  "bestBeforeDate": "2025-11-25",
  "quantity": 1,
  "unit": "liter",
  "barcode": "5901234123457",
  "notes": "Organic"
}
```

**Response:** 201 Created with item

### PATCH /api/pantry/[id]

**Request Body:** Partial item fields

**Response:** 200 OK with updated item

### DELETE /api/pantry/[id]

**Response:** 204 No Content

---

## Implementation

```typescript
// src/app/api/pantry/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const itemSchema = z.object({
  name: z.string().min(1, "Name required"),
  category: z.string(),
  bestBeforeDate: z.string().datetime(),
  quantity: z.number().positive(),
  unit: z.string(),
  barcode: z.string().optional(),
  notes: z.string().optional()
})

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

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
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const data = itemSchema.parse(body)

  const item = await prisma.foodItem.create({
    data: {
      ...data,
      bestBeforeDate: new Date(data.bestBeforeDate),
      userId: session.user.id
    }
  })

  return Response.json(item, { status: 201 })
}
```

---

## Validation Schema

| Field | Type | Validation |
|-------|------|------------|
| name | string | Required, min 1 char |
| category | string | Required |
| bestBeforeDate | datetime | Required, valid ISO date |
| quantity | number | Required, positive |
| unit | string | Required |
| barcode | string | Optional |
| notes | string | Optional |

---

## Error Responses

| Status | Condition |
|--------|-----------|
| 401 | Not authenticated |
| 400 | Invalid input (Zod error) |
| 404 | Item not found |
| 403 | Item belongs to another user |
| 500 | Server error |

---

## Code References

- `ibe160-app/src/app/api/pantry/route.ts`
- `ibe160-app/src/app/api/pantry/[id]/route.ts`

---

## Definition of Done

- [x] All CRUD operations working
- [x] Authentication enforced
- [x] Validation complete
- [x] Error handling robust
- [x] Tested with Postman/Thunder Client

---

*Completed: Week 2*
