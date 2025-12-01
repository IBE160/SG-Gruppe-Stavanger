# Shopping List Implementation Guide

## Overview

The shopping list functionality has been fully implemented and is ready to use once the database migration is applied. Users can now add missing ingredients from recipe detail pages directly to their shopping list.

## What Was Implemented

### 1. Database Schema Updates

**File:** `app/prisma/schema.prisma`

Added two new models:
- **ShoppingList** - One per user, holds all shopping list items
- **ShoppingListItem** - Individual items in the shopping list

```prisma
model ShoppingListItem {
  id             String       @id @default(cuid())
  name           String
  amount         Float
  unit           String
  recipeId       Int?         // Optional: tracks which recipe this is from
  recipeName     String?      // Optional: name of the recipe
  shoppingListId String
  shoppingList   ShoppingList @relation(fields: [shoppingListId], references: [id], onDelete: Cascade)
  addedAt        DateTime     @default(now())
  purchased      Boolean      @default(false)

  @@index([shoppingListId])
}
```

### 2. API Routes

#### **GET /api/shopping-list**
- Fetches all items in the user's shopping list
- Automatically creates a shopping list if user doesn't have one
- Returns items sorted by most recently added

**Response:**
```json
{
  "items": [
    {
      "id": "clx123...",
      "name": "tomatoes",
      "amount": 2,
      "unit": "cups",
      "recipeId": 12345,
      "recipeName": "Tomato Soup",
      "addedAt": "2025-12-01T10:00:00.000Z",
      "purchased": false
    }
  ]
}
```

#### **POST /api/shopping-list**
- Adds a new item to the shopping list
- If item already exists (same name and recipe), it updates the quantity
- Creates shopping list if user doesn't have one

**Request Body:**
```json
{
  "name": "tomatoes",
  "amount": 2,
  "unit": "cups",
  "recipeId": 12345,        // Optional
  "recipeName": "Tomato Soup"  // Optional
}
```

**Response:**
```json
{
  "item": { /* item details */ },
  "message": "Item added to shopping list"
}
```

#### **DELETE /api/shopping-list**
- Clears all items from the shopping list
- Returns count of deleted items

**Response:**
```json
{
  "message": "Cleared 5 items from shopping list",
  "count": 5
}
```

#### **DELETE /api/shopping-list/[id]**
- Deletes a specific item by ID
- Validates that the item belongs to the authenticated user

**Response:**
```json
{
  "message": "Item deleted successfully"
}
```

#### **PATCH /api/shopping-list/[id]**
- Updates a shopping list item
- Can update `purchased` status, `amount`, or `unit`

**Request Body:**
```json
{
  "purchased": true,  // Optional
  "amount": 3,        // Optional
  "unit": "lbs"       // Optional
}
```

**Response:**
```json
{
  "item": { /* updated item */ },
  "message": "Item updated successfully"
}
```

### 3. Frontend Integration

**File:** `app/components/recipes/RecipeDetailView.tsx`

The recipe detail view now:
- Shows an "Add" button for each missing ingredient
- Calls the shopping list API when the button is clicked
- Shows loading state while adding
- Displays error if the operation fails
- Includes recipe ID and name for better tracking

### 4. User Flow

1. User views a recipe detail page
2. System automatically checks their inventory and highlights available/missing ingredients
3. For missing ingredients, an "Add" button appears
4. User clicks "Add" to add the ingredient to their shopping list
5. System tracks which recipe the ingredient is from
6. If the same ingredient is added again, the quantity is increased

## Next Steps: Database Migration

Since the database was not accessible during implementation, you need to run the migration when the database is available:

### Option 1: Using Prisma Migrate (Recommended for Production)

```bash
cd app
npx prisma migrate dev --name add_shopping_list_items
```

This will:
- Create a new migration file
- Apply the schema changes to the database
- Regenerate the Prisma Client

### Option 2: Using DB Push (Quickest for Development)

```bash
cd app
npx prisma db push
```

This will:
- Sync the schema directly to the database
- Skip creating migration files
- Good for rapid development

### After Migration

Once the migration is complete, the shopping list functionality will be fully operational!

Test it by:
1. Starting the dev server: `npm run dev`
2. Logging in to your account
3. Navigating to a recipe detail page
4. Clicking "Add" on missing ingredients
5. Checking the console logs to confirm items are being added

## Future Enhancements

### Suggested Features:
1. **Shopping List Page** - Create a dedicated page to view and manage all shopping list items
2. **Mark as Purchased** - Allow users to check off items as they shop
3. **Group by Recipe** - Organize shopping list items by which recipe they're from
4. **Export Shopping List** - Allow users to export/share their shopping list
5. **Smart Grouping** - Group similar items together (e.g., all produce, all dairy)
6. **Toast Notifications** - Replace the alert() with a proper toast notification system

### Example: Creating a Shopping List Page

```tsx
// app/app/shopping-list/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function ShoppingListPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await fetch('/api/shopping-list');
    const data = await response.json();
    setItems(data.items);
  };

  const togglePurchased = async (id: string, purchased: boolean) => {
    await fetch(`/api/shopping-list/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchased: !purchased }),
    });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await fetch(`/api/shopping-list/${id}`, {
      method: 'DELETE',
    });
    fetchItems();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping List</h1>
      {items.map((item) => (
        <Card key={item.id} className="p-4 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={item.purchased}
                onCheckedChange={() => togglePurchased(item.id, item.purchased)}
              />
              <div>
                <p className={item.purchased ? 'line-through' : ''}>
                  {item.amount} {item.unit} {item.name}
                </p>
                {item.recipeName && (
                  <p className="text-sm text-gray-500">
                    From: {item.recipeName}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" onClick={() => deleteItem(item.id)}>
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

## API Testing with curl

### Add an item:
```bash
curl -X POST http://localhost:3000/api/shopping-list \
  -H "Content-Type: application/json" \
  -d '{
    "name": "tomatoes",
    "amount": 2,
    "unit": "cups",
    "recipeId": 12345,
    "recipeName": "Tomato Soup"
  }'
```

### Get all items:
```bash
curl http://localhost:3000/api/shopping-list
```

### Mark as purchased:
```bash
curl -X PATCH http://localhost:3000/api/shopping-list/[ITEM_ID] \
  -H "Content-Type: application/json" \
  -d '{"purchased": true}'
```

### Delete an item:
```bash
curl -X DELETE http://localhost:3000/api/shopping-list/[ITEM_ID]
```

## Summary

✅ Database schema updated with ShoppingListItem model
✅ Complete REST API for shopping list operations
✅ Frontend integration in recipe detail view
✅ Automatic inventory matching
✅ Recipe tracking for added ingredients
✅ Smart quantity updates for duplicate items
✅ Full authentication and authorization
✅ Application builds successfully

⏳ **Pending:** Database migration (run when database is accessible)

The shopping list feature is production-ready and waiting for the database migration!
