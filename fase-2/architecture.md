# ibe160 - Smart Food & Recipe Platform Architecture

**Generated:** 2025-11-09
**Author:** BIP
**Project Level:** 3
**Workflow Version:** BMad Architecture v1.3.2

---

## Executive Summary

This architecture document defines the technical foundation for the Smart Food & Recipe Platform, a mobile-responsive web application built with Next.js 14 (App Router), Supabase (PostgreSQL), and Prisma ORM. The architecture prioritizes offline-first functionality, sub-2-second performance, and AI agent implementation consistency. All decisions are made to support a 6-week development timeline with student developers while maintaining production-grade quality standards.

---

## Project Initialization

**First Implementation Story:** Initialize Next.js Project

Execute the following command to establish the base architecture:

```bash
npx create-next-app@latest ibe160-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Configuration Options:**
- ✅ TypeScript (type safety for AI agent consistency)
- ✅ Tailwind CSS (rapid UI development)
- ✅ ESLint (code quality enforcement)
- ✅ App Router (modern Next.js architecture)
- ✅ src/ directory (clean project structure)
- ✅ @ import alias (clean import statements)

**Additional Setup Commands:**

```bash
# Navigate to project
cd ibe160-app

# Install additional dependencies
npm install @supabase/supabase-js@2.80.0
npm install @prisma/client@6.19.0
npm install -D prisma@6.19.0
npm install next-auth@beta  # Auth.js v5
npm install date-fns      # Date manipulation
npm install zod           # Runtime validation
npm install react-hook-form @hookform/resolvers  # Form handling
npm install zustand       # State management

# Install shadcn/ui
npx shadcn@latest init

# Initialize Prisma
npx prisma init
```

---

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
|----------|----------|---------|---------------|-----------|
| Framework | Next.js (App Router) | 14.2+ | All | SSR, SSG, API routes, image optimization - all MVP requirements met |
| Language | TypeScript | 5.x | All | Type safety prevents agent conflicts, catches errors at compile time |
| Styling | Tailwind CSS | 3.4+ | All UI | Utility-first, rapid development, shadcn/ui compatibility |
| Component Library | shadcn/ui | Latest | All UI | Accessible, customizable, Radix UI primitives |
| Database | Supabase (PostgreSQL) | Latest | All | Managed PostgreSQL, real-time, auth, storage in one platform |
| ORM | Prisma | 6.19.0 | All | Type-safe queries, migrations, schema management |
| Authentication | Auth.js (NextAuth v5) | 5.x | Auth, Profile | App Router native, simple email/password, session management |
| State Management | Zustand | 5.x | Client UI | Lightweight, simple API, perfect for inventory state |
| Form Handling | React Hook Form + Zod | Latest | All Forms | Performance, validation, TypeScript integration |
| Date Handling | date-fns | 4.x | Expiration, Alerts | Lightweight, tree-shakeable, timezone-aware |
| API Integration | Native fetch + React Query | Latest | Spoonacular | Caching, offline support, data synchronization |
| Testing | Vitest + Testing Library | Latest | All | Fast, modern, compatible with App Router |
| Deployment | Vercel | Latest | Hosting | Native Next.js platform, preview deployments, edge functions |
| Monitoring | Vercel Analytics | Latest | Performance | Built-in, no setup required |

---

## Technology Stack Details

### Core Technologies

**Frontend Stack:**
- **Next.js 14.2+**: React framework with App Router
  - Server Components for performance
  - API Routes for backend logic
  - Image optimization (next/image)
  - Font optimization (next/font)
  - Streaming SSR for instant page loads

**UI/Styling:**
- **Tailwind CSS 3.4+**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library (Radix UI + Tailwind)
- **Lucide React**: Icon library

**State & Data Management:**
- **Zustand**: Client-side state (inventory, UI state)
- **React Hook Form**: Form state and validation
- **Zod**: Runtime type validation and schema definition
- **TanStack Query (React Query)**: Server state, caching, offline support

**Authentication & Database:**
- **Auth.js v5**: Authentication (email/password, sessions)
- **Prisma 6.19.0**: ORM and database schema management
- **Supabase**: PostgreSQL hosting, real-time subscriptions
- **@supabase/supabase-js 2.80.0**: Supabase client library

**External APIs:**
- **Spoonacular API**: Recipe data (150 requests/day free tier)
- **Open Food Facts API**: Barcode lookup (free, open data)
- Fallback: Local seed dataset (20-30 recipes)

### Development Tools

- **TypeScript 5.x**: Type safety
- **ESLint + Prettier**: Code quality and formatting
- **Vitest**: Unit and integration testing
- **Playwright**: E2E testing
- **Husky**: Git hooks for pre-commit checks

---

## Project Structure

```
ibe160-app/
├── .env.local                     # Environment variables (gitignored)
├── .env.example                   # Environment template
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Database migrations
│   └── seed.ts                    # Seed data (fallback recipes)
├── public/
│   ├── images/                    # Static images
│   └── icons/                     # Icons and logos
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth group (requires login)
│   │   │   ├── pantry/            # Pantry management
│   │   │   │   ├── page.tsx       # Pantry list view
│   │   │   │   └── add/page.tsx   # Add food item
│   │   │   ├── recipes/           # Recipe discovery
│   │   │   │   ├── page.tsx       # Recipe search
│   │   │   │   └── [id]/page.tsx  # Recipe detail
│   │   │   ├── profile/           # User profile
│   │   │   │   └── page.tsx
│   │   │   └── notifications/     # Notifications
│   │   │       └── page.tsx
│   │   ├── (unauth)/              # Public routes
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/[...nextauth]/route.ts  # Auth.js handler
│   │   │   ├── barcode/[code]/route.ts  # Barcode lookup
│   │   │   ├── pantry/            # Pantry CRUD endpoints
│   │   │   │   ├── route.ts       # GET/POST pantry items
│   │   │   │   └── [id]/route.ts  # PUT/DELETE item
│   │   │   ├── recipes/           # Recipe endpoints
│   │   │   │   ├── search/route.ts  # Recipe search (Spoonacular)
│   │   │   │   ├── match/route.ts   # Match recipes to pantry
│   │   │   │   └── [id]/route.ts    # Get recipe details
│   │   │   ├── notifications/     # Notification endpoints
│   │   │   │   ├── route.ts       # GET notifications
│   │   │   │   └── [id]/route.ts  # Mark as read
│   │   │   └── grocery-list/route.ts  # Generate grocery list
│   │   ├── layout.tsx             # Root layout
│   │   ├── loading.tsx            # Global loading
│   │   └── error.tsx              # Global error boundary
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── features/              # Feature-specific components
│   │   │   ├── pantry/
│   │   │   │   ├── pantry-item-card.tsx
│   │   │   │   ├── add-item-form.tsx
│   │   │   │   ├── edit-item-dialog.tsx
│   │   │   │   ├── barcode-scanner.tsx
│   │   │   │   └── expiring-items-alert.tsx
│   │   │   ├── recipes/
│   │   │   │   ├── recipe-card.tsx
│   │   │   │   ├── recipe-search-bar.tsx
│   │   │   │   ├── recipe-filters.tsx
│   │   │   │   └── ingredient-match-badge.tsx
│   │   │   ├── notifications/
│   │   │   │   ├── notification-bell.tsx
│   │   │   │   └── notification-item.tsx
│   │   │   └── grocery/
│   │   │       └── grocery-list-generator.tsx
│   │   └── layout/                # Layout components
│   │       ├── header.tsx
│   │       ├── nav.tsx
│   │       ├── footer.tsx
│   │       └── mobile-nav.tsx
│   ├── lib/                       # Utility libraries
│   │   ├── auth.ts                # Auth.js configuration
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── supabase.ts            # Supabase client
│   │   ├── spoonacular.ts         # Spoonacular API client
│   │   ├── utils.ts               # General utilities (cn, etc.)
│   │   └── validation/            # Zod schemas
│   │       ├── food-item.ts
│   │       ├── user.ts
│   │       └── recipe.ts
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-pantry.ts          # Pantry data management
│   │   ├── use-recipes.ts         # Recipe fetching/caching
│   │   ├── use-notifications.ts   # Notification state
│   │   ├── use-offline.ts         # Offline detection
│   │   └── use-debounce.ts        # Debouncing utility
│   ├── store/                     # Zustand stores
│   │   ├── pantry-store.ts        # Pantry state
│   │   ├── ui-store.ts            # UI state (modals, etc.)
│   │   └── offline-store.ts       # Offline queue
│   ├── types/                     # TypeScript types
│   │   ├── food-item.ts
│   │   ├── recipe.ts
│   │   ├── user.ts
│   │   ├── notification.ts
│   │   └── api.ts
│   └── middleware.ts              # Next.js middleware (auth)
├── tests/
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # E2E tests (Playwright)
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

---

## Epic to Architecture Mapping

| Epic | Module/Directory | Database Tables | API Routes | External APIs |
|------|------------------|-----------------|------------|---------------|
| **User Authentication** | `app/(unauth)`, `lib/auth.ts` | User | `/api/auth/[...nextauth]` | Auth.js |
| **Food Inventory Management** | `app/(auth)/pantry`, `components/features/pantry` | FoodItem | `/api/pantry/*` | - |
| **Barcode Scanning** | `components/features/pantry/barcode-scanner.tsx` | FoodItem | `/api/barcode/*` | Open Food Facts |
| **Recipe Discovery** | `app/(auth)/recipes`, `components/features/recipes` | Recipe (cached) | `/api/recipes/*` | Spoonacular |
| **Flexible Recipe Matching** | `lib/recipe-matching.ts` | FoodItem, Recipe | `/api/recipes/match` | Spoonacular |
| **Expiration Alerts** | `components/features/notifications` | Notification, FoodItem | `/api/notifications/*` | - |
| **Smart Grocery List** | `components/features/grocery` | FoodItem, Recipe | `/api/grocery-list` | - |
| **User Profile** | `app/(auth)/profile` | User, UserPreference | `/api/profile` | - |
| **Offline Support** | `hooks/use-offline.ts`, `store/offline-store.ts` | - | - | Service Worker |

---

## Data Architecture

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String          @id @default(cuid())
  email         String          @unique
  passwordHash  String
  name          String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  foodItems     FoodItem[]
  notifications Notification[]
  preferences   UserPreference?

  @@map("users")
}

model FoodItem {
  id              String   @id @default(cuid())
  name            String
  barcode         String?  @unique
  category        String
  bestBeforeDate  DateTime
  quantity        Float
  unit            String
  userId          String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([bestBeforeDate])
  @@map("food_items")
}

model Recipe {
  id             String   @id @default(cuid())
  spoonacularId  Int?     @unique
  title          String
  image          String?
  ingredients    String   // JSON string
  instructions   String
  cookingTime    Int
  servings       Int
  tags           String?
  sourceUrl      String?
  createdAt      DateTime @default(now())

  @@index([spoonacularId])
  @@map("recipes")
}

model Notification {
  id         String   @id @default(cuid())
  userId     String
  message    String
  type       String   // 'expiration', 'recipe_suggestion'
  isRead     Boolean  @default(false)
  foodItemId String?
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@map("notifications")
}

model UserPreference {
  id           String   @id @default(cuid())
  userId       String   @unique
  dietaryRestr String?  // JSON array
  cuisines     String?  // JSON array
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_preferences")
}
```

### Database Relationships

```
User (1) ─── (N) FoodItem
User (1) ─── (N) Notification
User (1) ─── (1) UserPreference
```

### Data Flow Patterns

**Write Pattern:**
1. Client submits form → React Hook Form validation
2. Zod schema validates input
3. POST to API route
4. API route validates auth (Auth.js)
5. Prisma writes to Supabase PostgreSQL
6. Response to client
7. React Query invalidates cache
8. UI updates automatically

**Read Pattern (Online):**
1. Component mounts → useQuery hook triggers
2. Check React Query cache
3. If stale/missing → GET from API route
4. API route queries Prisma
5. Response cached by React Query
6. UI renders with data

**Read Pattern (Offline):**
1. Component mounts → useQuery hook triggers
2. React Query serves stale cache
3. UI shows "Last synced: [timestamp]"
4. User can view but not modify
5. On reconnect → background sync

---

## API Contracts

### Standard Response Format

All API routes follow this structure:

```typescript
// Success Response
{
  data: T,
  meta?: {
    total?: number,
    page?: number,
    lastSynced?: string
  }
}

// Error Response
{
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### API Endpoints

#### Barcode Lookup

**GET /api/barcode/[code]**
- Description: Get product information from a barcode
- Auth: Required
- Path Params: `code` (the barcode number)
- Response: `{ data: { name, category, image } }` from Open Food Facts

#### Pantry Management

**GET /api/pantry**
- Description: Get all pantry items for authenticated user
- Auth: Required
- Query Params: `?category=dairy&sortBy=bestBeforeDate`
- Response: `{ data: FoodItem[] }`

**POST /api/pantry**
- Description: Add new food item
- Auth: Required
- Body: `{ name, category, bestBeforeDate, quantity, unit, barcode? }`
- Response: `{ data: FoodItem }`

**PUT /api/pantry/[id]**
- Description: Update food item
- Auth: Required
- Body: Partial FoodItem
- Response: `{ data: FoodItem }`

**DELETE /api/pantry/[id]**
- Description: Delete food item
- Auth: Required
- Response: `{ data: { id: string } }`

#### Recipe Management

**GET /api/recipes/search**
- Description: Search recipes (Spoonacular)
- Auth: Optional (better results when authenticated)
- Query Params: `?query=pasta&cuisine=italian&maxReadyTime=30`
- Response: `{ data: Recipe[], meta: { total } }`

**GET /api/recipes/match**
- Description: Find recipes matching pantry items
- Auth: Required
- Query Params: `?missingMax=2`
- Response: `{ data: RecipeMatch[] }` where RecipeMatch includes `{ recipe, matchedIngredients, missingIngredients }`

**GET /api/recipes/[id]**
- Description: Get recipe details
- Auth: Optional
- Response: `{ data: Recipe }`

#### Notifications

**GET /api/notifications**
- Description: Get user notifications
- Auth: Required
- Query Params: `?unreadOnly=true`
- Response: `{ data: Notification[] }`

**PUT /api/notifications/[id]**
- Description: Mark notification as read
- Auth: Required
- Response: `{ data: Notification }`

#### Grocery List

**POST /api/grocery-list**
- Description: Generate grocery list for recipe
- Auth: Required
- Body: `{ recipeId: string }`
- Response: `{ data: { needed: Ingredient[], have: Ingredient[] } }`

---

## Implementation Patterns

### Naming Conventions

**Files & Directories:**
- Components: `kebab-case.tsx` (e.g., `pantry-item-card.tsx`)
- Pages: `kebab-case/page.tsx` (Next.js App Router convention)
- API routes: `kebab-case/route.ts`
- Utilities: `kebab-case.ts`
- Types: `kebab-case.ts`

**React Components:**
- PascalCase for component names (e.g., `PantryItemCard`)
- Export as named export: `export function PantryItemCard() {}`

**Database:**
- Tables: `snake_case` plural (e.g., `food_items`, `users`)
- Columns: `camelCase` in Prisma, auto-mapped to `snake_case` in PostgreSQL
- Foreign keys: `userId` (Prisma) → `user_id` (PostgreSQL)

**API Routes:**
- Endpoint paths: `kebab-case` (e.g., `/api/grocery-list`)
- Route handlers: Named exports (`GET`, `POST`, `PUT`, `DELETE`)

**TypeScript:**
- Interfaces: PascalCase with `I` prefix (e.g., `IFoodItem`)
- Types: PascalCase (e.g., `ApiResponse<T>`)
- Enums: PascalCase (e.g., `FoodCategory`)

### Error Handling

**Client-Side:**
```typescript
// Use React Query error boundaries
<ErrorBoundary fallback={<ErrorState />}>
  <SuspenseComponent />
</ErrorBoundary>

// Toast notifications for user-facing errors
toast.error("Failed to add item. Please try again.")
```

**API Routes:**
```typescript
// Standard error response
try {
  // ... operation
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: { code: 'DUPLICATE', message: 'Item already exists' } },
        { status: 409 }
      )
    }
  }

  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
    { status: 500 }
  )
}
```

**Error Codes:**
- `AUTH_REQUIRED`: 401
- `FORBIDDEN`: 403
- `NOT_FOUND`: 404
- `DUPLICATE`: 409
- `VALIDATION_ERROR`: 422
- `INTERNAL_ERROR`: 500
- `SERVICE_UNAVAILABLE`: 503 (Spoonacular down)

### Logging Strategy

**Development:**
- Console logs with prefixes: `[API:pantry]`, `[DB]`, `[AUTH]`
- Detailed error stack traces

**Production:**
- Vercel Analytics automatic logging
- Error tracking via Vercel
- No sensitive data in logs (passwords, tokens)

**Log Levels:**
```typescript
// Use structured logging
logger.info('[API:recipes] Fetching from Spoonacular', { userId, query })
logger.error('[DB] Failed to insert', { error, userId })
```

### Date Handling

**Storage:**
- All dates in PostgreSQL as `TIMESTAMP WITH TIME ZONE`
- Prisma `DateTime` type

**API:**
- ISO 8601 format in JSON: `"2025-11-09T12:00:00Z"`
- Use `date-fns` for parsing/formatting

**Display:**
- User-friendly formats: `formatDistanceToNow()` from date-fns
- Example: "Expires in 2 days" instead of "2025-11-11"

**Timezone:**
- Store in UTC
- Display in user's local timezone (browser automatic)

### Form Validation

**All forms use React Hook Form + Zod:**

```typescript
// Define schema
const foodItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().positive("Must be positive"),
  bestBeforeDate: z.date().min(new Date(), "Must be future date"),
  category: z.enum(["dairy", "produce", "meat", "grains", "other"])
})

// Use in component
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(foodItemSchema)
})
```

**Validation Timing:**
- Client-side: On blur and on submit
- Server-side: Always validate in API route (never trust client)

### Loading States

**Consistent loading UI:**
- Skeleton loaders (shadcn/ui Skeleton component)
- Show immediately, no delay
- Match layout of loaded content

**Loading Indicators:**
- Full page: Loading component from Next.js
- Inline: Spinner from lucide-react
- Forms: Disable button + spinner

### Offline Behavior

**Detection:**
```typescript
// Use custom hook
const { isOnline, lastSynced } = useOffline()
```

**UI Indicators:**
- Banner: "You're offline. Changes will sync when connected."
- Timestamp: "Last synced: 2 minutes ago"
- Disabled actions: "Cannot add items while offline"

**Offline Queue:**
- Store mutations in Zustand
- Replay on reconnect
- Show sync status

---

## Security Architecture

### Authentication Flow

**Email/Password with Auth.js v5:**

1. User registers → POST `/api/auth/register`
2. Hash password with bcrypt (10 rounds)
3. Store in PostgreSQL via Prisma
4. Auto-login with session cookie

**Session Management:**
- JWT stored in HTTP-only cookie
- 30-day expiration (FR012)
- Refresh on activity
- Secure flag in production

**Middleware Protection:**
```typescript
// src/middleware.ts
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/pantry')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})
```

### Authorization

**API Route Protection:**
```typescript
// All protected routes check session
const session = await auth()
if (!session?.user) {
  return NextResponse.json(
    { error: { code: 'AUTH_REQUIRED', message: 'Login required' } },
    { status: 401 }
  )
}
```

**Row-Level Security (RLS):**
- Users can only access their own food items
- Enforced at Prisma query level:
  ```typescript
  const items = await prisma.foodItem.findMany({
    where: { userId: session.user.id }
  })
  ```

### Data Protection

**Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth
AUTH_SECRET="..." # Generated with: openssl rand -base64 32
AUTH_URL="http://localhost:3000"

# Spoonacular
SPOONACULAR_API_KEY="..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..." # Never expose to client
```

**Never Commit:**
- `.env.local` in `.gitignore`
- Provide `.env.example` template
- Use Vercel environment variables in production

### Input Sanitization

**All user input sanitized:**
- Zod validates types and formats
- Prisma parameterized queries (prevents SQL injection)
- No `eval()` or `dangerouslySetInnerHTML` without sanitization

**XSS Prevention:**
- React auto-escapes by default
- Use `DOMPurify` if rendering HTML from API

### CSRF Protection

- Auth.js handles CSRF automatically
- Use `sameSite: 'lax'` for cookies

---

## Performance Considerations

### Target Metrics (NFR002, NFR005)

- **Recipe Search:** < 2 seconds
- **Page Load (Lighthouse):** > 90 score
- **Offline Data Access:** < 500ms
- **Inventory Operations:** < 1 second

### Optimization Strategies

**1. Image Optimization**
```typescript
// Use Next.js Image component
<Image
  src="/food-image.jpg"
  alt="Food item"
  width={400}
  height={300}
  priority={false}
  placeholder="blur"
/>
```

**2. API Caching**
```typescript
// React Query with stale-while-revalidate
const { data } = useQuery({
  queryKey: ['pantry', userId],
  queryFn: fetchPantry,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
})
```

**3. Database Optimization**
- Indexes on `userId`, `bestBeforeDate` (Prisma schema)
- Limit query results (pagination)
- Select only needed fields

**4. Spoonacular API Optimization**
- Aggressive caching (store in PostgreSQL)
- Batch requests when possible
- Fallback to local recipes
- Rate limit handling

**5. Code Splitting**
- Next.js automatic code splitting
- Dynamic imports for heavy components:
  ```typescript
  const RecipeModal = dynamic(() => import('./recipe-modal'))
  ```

**6. Prefetching**
- Prefetch recipe details on hover
- Prefetch next page in pagination

---

## Deployment Architecture

### Hosting

**Vercel (Frontend + API):**
- Automatic deployments from Git
- Preview deployments for PRs
- Edge functions for Auth
- CDN for static assets

**Supabase (Database):**
- Managed PostgreSQL
- Automatic backups
- Connection pooling via Prisma

### Environments

**Development:**
- Local PostgreSQL or Supabase dev instance
- `.env.local` configuration
- Hot reload with Next.js dev server

**Staging:**
- Vercel preview deployments
- Separate Supabase project
- Test Spoonacular API with mock data

**Production:**
- Vercel production deployment
- Supabase production project
- Real Spoonacular API (150 req/day limit)

### CI/CD Pipeline

```yaml
# GitHub Actions
on: [push, pull_request]

jobs:
  test:
    - npm install
    - npm run lint
    - npm run type-check
    - npm run test
    - npx prisma validate

  deploy:
    - Vercel automatic deployment
```

### Monitoring

**Vercel Analytics:**
- Page load times
- API response times
- Error rates

**Supabase Dashboard:**
- Database performance
- Query analytics
- Connection pool usage

**Manual Checks:**
- Lighthouse CI on PRs
- Weekly Spoonacular API usage check

---

## Development Environment

### Prerequisites

- **Node.js**: 20.x LTS or higher (v18 EOL)
- **npm**: 10.x or higher
- **PostgreSQL**: 14+ (via Supabase or local)
- **Git**: Latest version

### Setup Commands

```bash
# 1. Clone repository
git clone <repo-url>
cd ibe160-app

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Initialize database
npx prisma migrate dev --name init
npx prisma generate

# 5. Seed database (optional)
npx prisma db seed

# 6. Run development server
npm run dev

# 7. Open browser
# http://localhost:3000
```

### Environment Variables Template

```env
# .env.example

# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres"

# Auth.js v5
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Spoonacular API
SPOONACULAR_API_KEY="your-api-key-here"

# Supabase (for direct client usage if needed)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## Novel Architectural Patterns

### 1. Flexible Recipe Matching Algorithm (FR007)

**Challenge:** Suggest recipes even when user is missing 1-2 ingredients, preventing "no results" dead ends.

**Solution Architecture:**

```typescript
// lib/recipe-matching.ts

interface RecipeMatch {
  recipe: Recipe
  matchedIngredients: string[]
  missingIngredients: string[]
  matchPercentage: number
}

async function matchRecipesToPantry(
  pantryItems: FoodItem[],
  maxMissing: number = 2
): Promise<RecipeMatch[]> {
  // 1. Normalize pantry ingredient names (fuzzy matching)
  const normalizedPantry = pantryItems.map(item =>
    normalizeIngredientName(item.name)
  )

  // 2. Fetch recipes from Spoonacular with broad search
  const recipes = await fetchRecipesByIngredients(normalizedPantry)

  // 3. For each recipe, calculate match
  const matches = recipes.map(recipe => {
    const recipeIngredients = parseIngredients(recipe.ingredients)
    const normalized = recipeIngredients.map(normalizeIngredientName)

    const matched = normalized.filter(ing =>
      fuzzyMatch(ing, normalizedPantry)
    )
    const missing = normalized.filter(ing =>
      !fuzzyMatch(ing, normalizedPantry)
    )

    return {
      recipe,
      matchedIngredients: matched,
      missingIngredients: missing,
      matchPercentage: (matched.length / normalized.length) * 100
    }
  })

  // 4. Filter by maxMissing and sort by match percentage
  return matches
    .filter(m => m.missingIngredients.length <= maxMissing)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
}

// Fuzzy matching for ingredient variations (FR015)
function fuzzyMatch(ingredient: string, pantryList: string[]): boolean {
  return pantryList.some(pantryItem => {
    // Exact match
    if (ingredient === pantryItem) return true

    // Partial match (e.g., "tomato" matches "cherry tomatoes")
    if (pantryItem.includes(ingredient) || ingredient.includes(pantryItem)) {
      return true
    }

    // Levenshtein distance < 2 for typos
    return levenshteinDistance(ingredient, pantryItem) <= 2
  })
}
```

**Affects Epics:**
- Recipe Discovery
- Smart Grocery List Generation

**Implementation Notes:**
- Cache normalized ingredient mappings in database
- Update mapping table when new ingredients appear
- Agents MUST use this algorithm, not implement their own

### 2. Offline-First Data Synchronization (NFR004)

**Challenge:** App must work in grocery stores with poor connectivity.

**Solution Architecture:**

```typescript
// hooks/use-offline.ts

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [syncQueue, setSyncQueue] = useOfflineStore(state => [
    state.queue,
    state.addToQueue
  ])

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      processSyncQueue()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Process queued mutations when back online
  async function processSyncQueue() {
    for (const mutation of syncQueue) {
      try {
        await mutation.execute()
        removeFromQueue(mutation.id)
      } catch (error) {
        // Retry with exponential backoff
      }
    }
    setLastSynced(new Date())
  }

  return { isOnline, lastSynced, syncQueue }
}

// store/offline-store.ts (Zustand)

interface OfflineStore {
  queue: QueuedMutation[]
  addToQueue: (mutation: QueuedMutation) => void
  removeFromQueue: (id: string) => void
}

export const useOfflineStore = create<OfflineStore>((set) => ({
  queue: [],
  addToQueue: (mutation) => set(state => ({
    queue: [...state.queue, mutation]
  })),
  removeFromQueue: (id) => set(state => ({
    queue: state.queue.filter(m => m.id !== id)
  }))
}))
```

**React Query Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // CRITICAL: Allow stale data when offline
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst'
    }
  }
})
```

**UI Pattern:**
```typescript
// Always show last synced timestamp (FR013)
<div className="text-sm text-muted-foreground">
  {isOnline ? (
    "Connected"
  ) : (
    `Offline • Last synced: ${formatDistanceToNow(lastSynced)} ago`
  )}
</div>
```

**Affects Epics:**
- Food Inventory Management
- Recipe Discovery
- All authenticated features

**Implementation Notes:**
- Agents MUST check `isOnline` before write operations
- Show clear UI indicators (FR013)
- Never show errors without retry options (FR016)

### 3. Expiration Alert System (FR009, FR010)

**Challenge:** Proactive notifications 2-3 days before expiration + recipe suggestions

**Solution Architecture:**

```typescript
// API route: /api/cron/check-expirations (Vercel Cron)

export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

  // Find items expiring soon
  const expiringItems = await prisma.foodItem.findMany({
    where: {
      bestBeforeDate: {
        lte: threeDaysFromNow,
        gte: new Date()
      }
    },
    include: { user: true }
  })

  // Group by user
  const byUser = groupBy(expiringItems, 'userId')

  // For each user, create notification + find recipes
  for (const [userId, items] of Object.entries(byUser)) {
    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'expiration',
        message: `${items.length} items expiring soon`,
        foodItemId: items[0].id
      }
    })

    // Find recipes using these ingredients
    const recipes = await matchRecipesToPantry(items, 1)

    if (recipes.length > 0) {
      await prisma.notification.create({
        data: {
          userId,
          type: 'recipe_suggestion',
          message: `Try "${recipes[0].recipe.title}" using your expiring items`,
          foodItemId: items[0].id
        }
      })
    }
  }

  return NextResponse.json({ processed: expiringItems.length })
}
```

**Vercel Cron Configuration:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/check-expirations",
    "schedule": "0 9 * * *"  // Daily at 9 AM UTC
  }]
}
```

**Affects Epics:**
- Expiration Alerts
- Recipe Recommendations
- Notifications

**Implementation Notes:**
- Agents MUST NOT implement polling (use cron)
- Notifications are in-app only for MVP
- Email alerts in Phase 2

---

## Consistency Rules

### Code Organization

**Feature-Based Structure:**
- Group related components in `components/features/[feature-name]`
- Co-locate types with components when feature-specific
- Shared types in `src/types/`

**Import Order:**
```typescript
// 1. External libraries
import { useState } from 'react'
import { useForm } from 'react-hook-form'

// 2. Internal libraries
import { cn } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

// 3. Components
import { Button } from '@/components/ui/button'
import { PantryItemCard } from '@/components/features/pantry/pantry-item-card'

// 4. Types
import type { FoodItem } from '@/types/food-item'

// 5. Relative imports
import { helper } from './helper'
```

### Testing Patterns

**File Naming:**
- Unit tests: `component-name.test.tsx`
- Integration tests: `feature-name.integration.test.ts`
- E2E tests: `user-flow.e2e.test.ts`

**Test Structure:**
```typescript
describe('PantryItemCard', () => {
  it('displays item name and expiration date', () => {
    // Arrange
    const item = mockFoodItem()

    // Act
    render(<PantryItemCard item={item} />)

    // Assert
    expect(screen.getByText(item.name)).toBeInTheDocument()
  })
})
```

### Component Patterns

**Server vs Client Components:**
- Default to Server Components
- Use `'use client'` only when needed:
  - useState, useEffect, event handlers
  - Browser APIs
  - Third-party libraries requiring client

**Data Fetching:**
```typescript
// Server Component (preferred)
async function PantryPage() {
  const session = await auth()
  const items = await prisma.foodItem.findMany({
    where: { userId: session.user.id }
  })

  return <PantryList items={items} />
}

// Client Component (when interactivity needed)
'use client'
function PantryList({ items: initialItems }) {
  const { data: items } = useQuery({
    queryKey: ['pantry'],
    queryFn: fetchPantry,
    initialData: initialItems
  })

  return items.map(item => <PantryItemCard key={item.id} item={item} />)
}
```

---

## Architecture Decision Records (ADRs)

### ADR-001: Use App Router over Pages Router

**Decision:** Use Next.js 14 App Router instead of Pages Router

**Context:** Next.js offers two routing systems. App Router is newer with better features but less mature.

**Rationale:**
- Server Components improve performance (NFR002)
- Better streaming SSR for loading states
- Native support for layouts
- Auth.js v5 is App Router-first
- Industry trend toward App Router

**Consequences:**
- Smaller ecosystem/tutorials
- Learning curve for team
- Better long-term maintainability

### ADR-002: Use Prisma over Raw SQL

**Decision:** Use Prisma ORM instead of raw SQL queries

**Context:** Need to interact with PostgreSQL database

**Rationale:**
- Type safety prevents bugs
- Migration system tracks schema changes
- Generated client is AI-agent friendly
- Prevents SQL injection by default
- Better DX for student team

**Consequences:**
- Slight performance overhead
- Abstraction layer limits advanced SQL
- Worth it for safety and consistency

### ADR-003: Use Zustand over Redux for Client State

**Decision:** Use Zustand for client-side state management

**Context:** Need to manage UI state (modals, offline queue, filters)

**Rationale:**
- Minimal boilerplate
- Simple API for beginners
- TypeScript-friendly
- No context re-render issues
- Perfect for small-medium apps

**Consequences:**
- Less ecosystem than Redux
- No Redux DevTools (but Zustand has own devtools)
- Team can learn quickly

### ADR-004: Offline-First Architecture

**Decision:** Implement aggressive caching and offline queue

**Context:** NFR004 requires app to work in grocery stores with poor connectivity

**Rationale:**
- Critical user journey happens at store
- React Query provides caching
- Zustand stores offline queue
- Better UX than constant errors

**Consequences:**
- More complex state management
- Sync conflicts possible (rare for single-user app)
- Essential for product success

### ADR-005: Flexible Matching Algorithm (Non-AI)

**Decision:** Use algorithmic fuzzy matching, not AI/ML

**Context:** FR007 requires suggesting recipes with missing ingredients

**Rationale:**
- Scope management (6-week timeline)
- Predictable behavior
- No training data needed
- Can upgrade to AI in Phase 2
- Meets MVP requirements

**Consequences:**
- Less "smart" than AI
- Requires manual ingredient normalization table
- Good enough for MVP validation

### ADR-006: Monolithic Architecture (Not Microservices)

**Decision:** Single Next.js application, not separate services

**Context:** Could split into API + frontend or microservices

**Rationale:**
- Simpler deployment (Vercel)
- Easier for student team
- Fewer moving parts
- API Routes co-located with frontend
- Can refactor later if needed

**Consequences:**
- Tight coupling
- Harder to scale individual services
- Not a problem at MVP scale

---

## Implementation Guidelines for AI Agents

### CRITICAL Rules for All Agents

1. **ALWAYS** use TypeScript - no `any` types
2. **ALWAYS** validate user input with Zod before Prisma operations
3. **ALWAYS** check authentication in API routes
4. **ALWAYS** use Prisma for database access (no raw SQL unless approved)
5. **ALWAYS** use the flexible matching algorithm from `lib/recipe-matching.ts` (never implement your own)
6. **ALWAYS** handle errors with standard error response format
7. **ALWAYS** use `date-fns` for date operations (no moment.js)
8. **ALWAYS** follow naming conventions (kebab-case files, PascalCase components)
9. **ALWAYS** use React Query for server state
10. **ALWAYS** use Zustand for client state
11. **ALWAYS** show loading states (no blank screens)
12. **ALWAYS** provide helpful error messages (FR016)
13. **ALWAYS** check `isOnline` before write operations
14. **NEVER** commit `.env.local` or expose secrets
15. **NEVER** use `dangerouslySetInnerHTML` without sanitization

### When Implementing a Story

1. Read this architecture document FIRST
2. Check which Epic the story belongs to
3. Find the module/directory mapping
4. Follow file naming conventions
5. Use existing patterns (check similar features)
6. Add tests for new functionality
7. Update types if data structures change
8. Run `npm run type-check` and `npm run lint` before committing

### Decision Checklist

Before making ANY architectural decision not covered here:
1. Is it consistent with existing patterns?
2. Does it align with a NFR (performance, accessibility)?
3. Can other agents follow the same pattern?
4. Is it documented for future agents?

If unsure: ASK before implementing.

---

## Next Steps

This architecture is ready for implementation. The recommended sequence is:

1. **Initialize Project** (Story 1): Run create-next-app command
2. **Setup Database** (Story 2): Configure Prisma + Supabase
3. **Implement Auth** (Epic 1): Auth.js v5 setup
4. **Build Pantry CRUD** (Epic 2): Core inventory management
5. **Integrate Spoonacular** (Epic 3): Recipe API
6. **Implement Matching Algorithm** (Epic 4): Flexible recipe matching
7. **Add Notifications** (Epic 5): Expiration alerts
8. **Build Grocery List** (Epic 6): Shopping list feature

For questions or clarifications, refer to:
- PRD: `docs/PRD.md`
- Proposal: `proposal.md`
- Workflow Status: `docs/bmm-workflow-status.yaml`

---

**Generated by BMad Architecture Workflow v1.3.2**
**Date:** 2025-11-09
**For:** BIP
**Project:** ibe160 - Smart Food & Recipe Platform
