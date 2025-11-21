# Story 1.3: Configure Database and Prisma Schema

**Epic:** 1 - Project Initialization and Foundation
**Story ID:** STORY-1.3
**Status:** Done
**Sprint:** 1
**Points:** 5

---

## Description

Set up Supabase connection, configure Prisma schema with all models (User, FoodItem, Recipe, Notification, UserPreference).

---

## Acceptance Criteria

- [x] Supabase project created
- [x] DATABASE_URL and DIRECT_URL in .env.local
- [x] .env.example created without secrets
- [x] Prisma schema matches architecture.md exactly
- [x] All models defined: User, FoodItem, Recipe, Notification, UserPreference
- [x] All relationships defined correctly
- [x] Indexes on userId, bestBeforeDate as specified
- [x] `npx prisma generate` runs successfully
- [x] `npx prisma migrate dev --name init` creates database

---

## Technical Tasks

1. Create Supabase project at supabase.com
2. Copy connection strings to .env.local
3. Create Prisma schema with all models
4. Run prisma generate
5. Run initial migration
6. Verify tables in Supabase dashboard

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  avatar        String?
  points        Int       @default(0)
  level         Int       @default(1)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  foodItems     FoodItem[]
  notifications Notification[]
  preferences   UserPreference?
  groceryItems  GroceryItem[]
  achievements  UserAchievement[]
  household     Household?        @relation(fields: [householdId], references: [id])
  householdId   String?
}

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

model Notification {
  id           String    @id @default(cuid())
  userId       String
  message      String
  type         String
  isRead       Boolean   @default(false)
  snoozedUntil DateTime?
  foodItemId   String?
  createdAt    DateTime  @default(now())

  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  foodItem     FoodItem? @relation(fields: [foodItemId], references: [id])

  @@index([userId, isRead])
}
```

---

## Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

```env
# .env.example
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

---

## Verification Commands

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# View database
npx prisma studio
```

---

## Code References

- `ibe160-app/prisma/schema.prisma`
- `ibe160-app/src/lib/prisma.ts`
- `ibe160-app/.env.example`

---

## Definition of Done

- [x] All acceptance criteria met
- [x] Database tables created in Supabase
- [x] Prisma client generated
- [x] Migration applied successfully
- [x] No secrets in repository

---

*Completed: Week 1*
