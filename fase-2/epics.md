# ibe160 - Smart Food & Recipe Platform Epics

**Generated:** 2025-11-09
**Project:** ibe160
**Project Level:** 3
**Based on:** PRD.md, architecture.md

---

## Epic 1: Project Initialization and Foundation

**Description:** Set up the Next.js project, database, and development environment according to the architecture specifications.

**Priority:** Critical (Blocks everything else)

**Architecture Reference:** Project Initialization section

### Story 1.1: Initialize Next.js Project

**Description:** Create the Next.js 14 project with TypeScript, Tailwind CSS, and App Router using the exact command specified in architecture.md.

**Acceptance Criteria:**
- [ ] Execute: `npx create-next-app@latest ibe160-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [ ] Project structure matches architecture: src/ directory, app/ router structure
- [ ] TypeScript configured and working
- [ ] Tailwind CSS configured and working
- [ ] ESLint configured and passing
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] .gitignore includes .env.local

**Technical Tasks:**
- Run create-next-app command
- Verify all options applied correctly
- Test dev server
- Commit initial structure

---

### Story 1.2: Install Core Dependencies

**Description:** Install all dependencies specified in architecture: Prisma, Supabase, Auth.js, shadcn/ui, Zustand, React Query, etc.

**Acceptance Criteria:**
- [ ] All dependencies from architecture.md installed with correct versions
- [ ] Prisma 6.19.0 installed and initialized
- [ ] Supabase JS client 2.80.0 installed
- [ ] Auth.js v5 (beta) installed
- [ ] shadcn/ui initialized and configured
- [ ] Zustand and React Query installed
- [ ] date-fns, zod, react-hook-form installed
- [ ] package.json has all dependencies with versions
- [ ] No security vulnerabilities (`npm audit`)

**Technical Tasks:**
- Run all npm install commands from architecture
- Run `npx shadcn@latest init`
- Run `npx prisma init`
- Verify installations
- Commit package.json and package-lock.json

---

### Story 1.3: Configure Database and Prisma Schema

**Description:** Set up Supabase connection, configure Prisma schema with all models (User, FoodItem, Recipe, Notification, UserPreference).

**Acceptance Criteria:**
- [ ] Supabase project created
- [ ] DATABASE_URL and DIRECT_URL in .env.local
- [ ] .env.example created without secrets
- [ ] Prisma schema matches architecture.md exactly
- [ ] All models defined: User, FoodItem, Recipe, Notification, UserPreference
- [ ] All relationships defined correctly
- [ ] Indexes on userId, bestBeforeDate as specified
- [ ] `npx prisma generate` runs successfully
- [ ] `npx prisma migrate dev --name init` creates database

**Technical Tasks:**
- Create Supabase project
- Copy connection strings to .env
- Copy Prisma schema from architecture.md to prisma/schema.prisma
- Run prisma generate
- Run first migration
- Verify tables created in Supabase dashboard

---

### Story 1.4: Setup Auth.js v5 Configuration

**Description:** Configure Auth.js v5 for email/password authentication with 30-day sessions.

**Acceptance Criteria:**
- [ ] src/lib/auth.ts created with Auth.js config
- [ ] Email/password provider configured
- [ ] 30-day session expiration (FR012)
- [ ] AUTH_SECRET generated and in .env.local
- [ ] AUTH_URL configured
- [ ] API route at app/api/auth/[...nextauth]/route.ts
- [ ] Middleware configured for protected routes
- [ ] Test registration works
- [ ] Test login works

**Technical Tasks:**
- Create auth.ts with NextAuth config
- Generate AUTH_SECRET: `openssl rand -base64 32`
- Create catch-all API route
- Create middleware.ts for route protection
- Test auth flow

---

## Epic 2: User Authentication and Profile

**Description:** Implement user registration, login, logout, and basic profile management.

**Priority:** Critical (Required for all protected features)

**Functional Requirements:** FR001

**Architecture Reference:** Epic to Architecture Mapping - User Authentication

### Story 2.1: Build Registration Page

**Description:** Create registration UI with email/password form, validation, and error handling.

**Acceptance Criteria:**
- [ ] Page at app/(unauth)/register/page.tsx
- [ ] Form with email and password fields
- [ ] React Hook Form + Zod validation
- [ ] Password requirements: min 8 chars, uppercase, lowercase, number
- [ ] Email format validation
- [ ] Error messages display correctly (FR016)
- [ ] Loading state during submission
- [ ] Success redirects to pantry
- [ ] Link to login page
- [ ] Mobile responsive

**Technical Tasks:**
- Create register page
- Create Zod schema for registration
- Implement form with React Hook Form
- Create API route POST /api/auth/register
- Hash password with bcrypt
- Insert user into database
- Auto-login after registration
- Add error handling

---

### Story 2.2: Build Login Page

**Description:** Create login UI with email/password, remember me, and forgot password link (Phase 2).

**Acceptance Criteria:**
- [ ] Page at app/(unauth)/login/page.tsx
- [ ] Form with email and password
- [ ] Validation with Zod
- [ ] Clear error messages for wrong credentials
- [ ] Loading state during authentication
- [ ] Success redirects to pantry
- [ ] Link to registration page
- [ ] Mobile responsive
- [ ] Auth.js session created on success

**Technical Tasks:**
- Create login page
- Use Auth.js signIn function
- Handle authentication errors
- Display friendly error messages
- Test session creation
- Verify redirect works

---

### Story 2.3: Implement User Profile Page

**Description:** Create basic user profile page showing email and account creation date.

**Acceptance Criteria:**
- [ ] Page at app/(auth)/profile/page.tsx
- [ ] Protected by middleware (must be logged in)
- [ ] Display user email
- [ ] Display account creation date
- [ ] Logout button
- [ ] Mobile responsive
- [ ] Error handling if session invalid

**Technical Tasks:**
- Create profile page
- Fetch user data from session
- Display user information
- Implement logout button
- Test logout redirects to login

---

## Epic 3: Food Inventory Management

**Description:** Implement full CRUD operations for food items in pantry/fridge with expiration tracking.

**Priority:** Critical (Core MVP feature)

**Functional Requirements:** FR002, FR003, FR004, FR015

**Architecture Reference:** Food Inventory Management module

### Story 3.1: Build Pantry List View

**Description:** Create pantry page displaying all user's food items with categories, quantities, and expiration dates.

**Acceptance Criteria:**
- [ ] Page at app/(auth)/pantry/page.tsx
- [ ] Protected route (auth required)
- [ ] Fetch food items from database (user-specific)
- [ ] Display items in card grid layout
- [ ] Show: name, category, quantity, unit, expiration date
- [ ] Visual indicator for items expiring soon (<3 days)
- [ ] Empty state with helpful message (FR014): "Add your first ingredient"
- [ ] Loading skeleton while fetching
- [ ] Error handling with retry option (FR016)
- [ ] Mobile responsive
- [ ] Last synced indicator (FR013)

**Technical Tasks:**
- Create pantry page
- Create API route GET /api/pantry
- Query Prisma for user's food items
- Create PantryItemCard component
- Implement empty state
- Add loading state
- Add error boundary
- Style with Tailwind + shadcn/ui

---

### Story 3.2: Implement Add Food Item Form

**Description:** Create form to add new food items with validation, categories, and date picker.

**Acceptance Criteria:**
- [ ] Modal/dialog for add item form
- [ ] Fields: name (text), category (dropdown), quantity (number), unit (dropdown), expiration date (date picker)
- [ ] Categories: dairy, produce, meat, grains, other
- [ ] Units: g, kg, ml, L, pieces, etc.
- [ ] Zod validation for all fields
- [ ] Expiration date must be future date
- [ ] React Hook Form for state management
- [ ] Loading state during save
- [ ] Success message after save
- [ ] Form resets after success
- [ ] Mobile responsive
- [ ] Error handling (FR016)

**Technical Tasks:**
- Create AddItemForm component
- Create Zod schema for FoodItem
- Implement form with React Hook Form
- Create API route POST /api/pantry
- Insert into database via Prisma
- Invalidate React Query cache
- Add to pantry list without refresh
- Add success toast notification

---

### Story 3.3: Implement Edit Food Item

**Description:** Allow users to edit existing food items (change quantity, expiration date, etc.).

**Acceptance Criteria:**
- [ ] Edit button on each pantry item card
- [ ] Modal/dialog with pre-filled form
- [ ] All fields editable: name, category, quantity, unit, expiration date
- [ ] Validation same as add form
- [ ] Loading state during update
- [ ] Success message after update
- [ ] UI updates immediately
- [ ] Cancel button closes without saving
- [ ] Mobile responsive
- [ ] Error handling (FR016)

**Technical Tasks:**
- Create EditItemDialog component
- Reuse validation schema from add form
- Create API route PUT /api/pantry/[id]
- Update database via Prisma
- Invalidate React Query cache
- Optimistic update in UI
- Add success toast

---

### Story 3.4: Implement Delete Food Item

**Description:** Allow users to delete food items with confirmation dialog.

**Acceptance Criteria:**
- [ ] Delete button on each pantry item card
- [ ] Confirmation dialog: "Are you sure you want to delete [item name]?"
- [ ] Cancel and Confirm buttons
- [ ] Loading state during delete
- [ ] Success message after delete
- [ ] Item removed from UI immediately
- [ ] Error handling if delete fails (FR016)
- [ ] Mobile responsive

**Technical Tasks:**
- Add delete button to PantryItemCard
- Create confirmation dialog with shadcn/ui
- Create API route DELETE /api/pantry/[id]
- Delete from database via Prisma
- Invalidate React Query cache
- Optimistic removal from UI
- Add success toast

---

### Story 3.5: Implement Pantry Filters and Search

**Description:** Add category filters and fuzzy search (FR015) to help users find items quickly.

**Acceptance Criteria:**
- [ ] Search input at top of pantry page
- [ ] Fuzzy search on item name (FR015)
- [ ] Category filter dropdown (All, Dairy, Produce, Meat, Grains, Other)
- [ ] Sort options: Name A-Z, Expiring Soon, Recently Added
- [ ] Search works with typos (e.g., "tomato" matches "cherry tomatoes")
- [ ] Filters apply in real-time
- [ ] Search and filters work together
- [ ] Clear filters button
- [ ] Show count: "Showing 12 of 45 items"
- [ ] Mobile responsive

**Technical Tasks:**
- Create search input component
- Implement fuzzy matching algorithm (from architecture)
- Create filter dropdown components
- Add query params for filters
- Update GET /api/pantry to support filters
- Debounce search input (300ms)
- Style with Tailwind

---

### Story 3.6: Add Food Item via Barcode Scan

**Description:** Allow users to add a new food item by scanning its barcode, fetching product data from an external API.

**Acceptance Criteria:**
- [ ] "Scan Barcode" button available in the "Add Item" flow.
- [ ] Tapping the button opens the device camera with a scanning overlay.
- [ ] On successful scan, the barcode is sent to `GET /api/barcode/[code]`.
- [ ] The API returns product name and category from Open Food Facts API.
- [ ] The "Add Item" form is pre-filled with the fetched data.
- [ ] User can manually edit the pre-filled data before saving.
- [ ] A loading state is shown while fetching barcode data.
- [ ] Error messages are displayed for invalid barcodes or API failures.
- [ ] Mobile responsive.

**Technical Tasks:**
- Create `BarcodeScanner.tsx` component using a library like `react-zxing`.
- Create API route `GET /api/barcode/[code]` that calls Open Food Facts.
- Integrate the scanner component into the "Add Item" dialog/page.
- Implement logic to pre-fill the form with data from the barcode API response.
- Add error handling for API failures or "not found" responses.
- Add the `barcode` field to the FoodItem Zod validation schema.

---

## Epic 4: Offline-First Infrastructure

**Description:** Implement offline-first architecture to ensure app works in grocery stores with poor connectivity (NFR004).

**Priority:** High (Critical NFR)

**Non-Functional Requirements:** NFR004, NFR008

**Architecture Reference:** Novel Pattern - Offline-First Data Synchronization

### Story 4.1: Setup React Query Offline Configuration

**Description:** Configure React Query for offline-first behavior with aggressive caching.

**Acceptance Criteria:**
- [ ] React Query client configured with offline settings
- [ ] staleTime: 5 minutes
- [ ] cacheTime: 30 minutes
- [ ] networkMode: 'offlineFirst'
- [ ] Retry logic with exponential backoff
- [ ] Cache persists across browser refreshes (optional: persistQueryClient)
- [ ] Works without network connection
- [ ] Data served from cache when offline
- [ ] Background refetch when back online

**Technical Tasks:**
- Create src/lib/query-client.ts
- Configure QueryClient with offline options
- Wrap app with QueryClientProvider
- Add devtools (development only)
- Test offline behavior
- Verify cache persistence

---

### Story 4.2: Implement Offline Detection and UI Indicators

**Description:** Create useOffline hook and UI components to show online/offline status and last synced time (FR013).

**Acceptance Criteria:**
- [ ] useOffline hook detects network status
- [ ] Hook tracks last synced timestamp
- [ ] Banner shows when offline: "You're offline. Changes will sync when connected."
- [ ] Last synced indicator: "Last synced: 2 minutes ago" (FR013)
- [ ] Online indicator: small green dot + "Connected"
- [ ] Updates in real-time when status changes
- [ ] Works on all pages
- [ ] Mobile responsive
- [ ] Uses date-fns for friendly timestamps

**Technical Tasks:**
- Create hooks/use-offline.ts
- Listen to window online/offline events
- Track last sync time in localStorage
- Create OfflineIndicator component
- Add to layout.tsx
- Style with Tailwind
- Test online/offline switching

---

### Story 4.3: Implement Offline Mutation Queue

**Description:** Create Zustand store to queue mutations (add/edit/delete) when offline and replay when online.

**Acceptance Criteria:**
- [ ] Zustand store for offline queue
- [ ] Add operation queued when offline
- [ ] Edit operation queued when offline
- [ ] Delete operation queued when offline
- [ ] Queue persists in localStorage
- [ ] Auto-replay queue when back online
- [ ] Show sync status: "Syncing 3 changes..."
- [ ] Handle sync errors gracefully
- [ ] Prevent duplicate operations
- [ ] UI shows optimistic updates

**Technical Tasks:**
- Create store/offline-store.ts
- Define QueuedMutation interface
- Implement addToQueue, removeFromQueue
- Persist queue to localStorage
- Implement processSyncQueue function
- Add retry logic with exponential backoff
- Integrate with pantry mutations
- Add sync status UI
- Test offline scenarios

---

## Epic 5: Recipe Search and Discovery

**Description:** Integrate Spoonacular API for recipe search, browsing, and viewing.

**Priority:** Critical (Core MVP feature)

**Functional Requirements:** FR006

**Architecture Reference:** Recipe Discovery module, Spoonacular integration

### Story 5.1: Setup Spoonacular API Client

**Description:** Create API client wrapper for Spoonacular with caching and error handling.

**Acceptance Criteria:**
- [ ] SPOONACULAR_API_KEY in .env.local
- [ ] src/lib/spoonacular.ts client created
- [ ] Wrapper functions for search, get recipe details
- [ ] Rate limit tracking (150/day max)
- [ ] Error handling for API failures (FR016)
- [ ] Caching in PostgreSQL (Recipe model)
- [ ] Fallback to cached recipes if API down (NFR002)
- [ ] TypeScript types for API responses

**Technical Tasks:**
- Create Spoonacular client
- Implement searchRecipes function
- Implement getRecipeDetails function
- Add rate limit counter
- Implement caching strategy
- Handle API errors gracefully
- Create TypeScript interfaces
- Test with mock data

---

### Story 5.2: Build Recipe Search Page

**Description:** Create recipe search UI with filters, search bar, and results grid.

**Acceptance Criteria:**
- [ ] Page at app/(auth)/recipes/page.tsx
- [ ] Search input at top
- [ ] Filters: cuisine, cooking time, diet (optional)
- [ ] Recipe cards in grid layout
- [ ] Show: image, title, cooking time, servings
- [ ] Pagination or infinite scroll
- [ ] Loading state with skeletons
- [ ] Empty state: "No recipes found. Try different keywords."
- [ ] Error handling with retry (FR016)
- [ ] Results load < 2 seconds (NFR002)
- [ ] Mobile responsive

**Technical Tasks:**
- Create recipes page
- Create RecipeSearchBar component
- Create RecipeFilters component
- Create RecipeCard component
- Create API route GET /api/recipes/search
- Integrate Spoonacular API
- Implement pagination
- Add loading and error states
- Style with Tailwind + shadcn/ui

---

### Story 5.3: Build Recipe Detail Page

**Description:** Create detailed recipe view with ingredients, instructions, nutrition, and cooking info.

**Acceptance Criteria:**
- [ ] Page at app/(auth)/recipes/[id]/page.tsx
- [ ] Hero image at top
- [ ] Recipe title and metadata (time, servings, difficulty)
- [ ] Ingredients list with checkboxes
- [ ] Step-by-step instructions
- [ ] Nutrition facts (if available)
- [ ] "Cook This Recipe" button (for later: ingredient deduction)
- [ ] "Add to Grocery List" button (for Epic 7)
- [ ] Back button to search
- [ ] Loading state
- [ ] Error handling (FR016)
- [ ] Mobile responsive

**Technical Tasks:**
- Create recipe detail page
- Create API route GET /api/recipes/[id]
- Fetch from Spoonacular or cache
- Parse ingredients and instructions
- Create ingredient list component
- Create instructions component
- Style with Tailwind
- Add share functionality (optional)

---

### Story 5.4: Implement Recipe Caching

**Description:** Cache Spoonacular recipes in PostgreSQL to reduce API calls and enable offline access.

**Acceptance Criteria:**
- [ ] Recipe fetched from Spoonacular saved to database
- [ ] Check database cache before API call
- [ ] Cache expires after 7 days (configurable)
- [ ] Store: title, image, ingredients (JSON), instructions, cookingTime, servings, spoonacularId
- [ ] Update cache if recipe changed
- [ ] Serve cached recipes when API unavailable
- [ ] Cache hit rate tracked (optional: logging)

**Technical Tasks:**
- Update GET /api/recipes/[id] to check cache
- Save to Prisma Recipe model
- Parse Spoonacular response to database schema
- Implement cache expiration logic
- Test cache hit/miss scenarios
- Verify offline recipe access

---

## Epic 6: Flexible Recipe Matching

**Description:** Implement smart recipe matching algorithm that suggests recipes even when user is missing 1-2 ingredients (FR007).

**Priority:** Critical (Core differentiator)

**Functional Requirements:** FR007, FR015

**Architecture Reference:** Novel Pattern - Flexible Recipe Matching Algorithm

### Story 6.1: Implement Ingredient Normalization

**Description:** Create fuzzy matching algorithm for ingredient name variations (e.g., "tomato" matches "cherry tomatoes").

**Acceptance Criteria:**
- [ ] Function normalizeIngredientName in lib/recipe-matching.ts
- [ ] Handles plurals: "tomato" = "tomatoes"
- [ ] Handles variations: "cherry tomatoes", "canned tomatoes", "diced tomatoes"
- [ ] Levenshtein distance < 2 for typos
- [ ] Database table for ingredient mappings (optional optimization)
- [ ] Case insensitive matching
- [ ] Performance < 100ms for 50 ingredients

**Technical Tasks:**
- Create lib/recipe-matching.ts
- Implement normalizeIngredientName
- Implement fuzzyMatch function
- Implement Levenshtein distance
- Test with common ingredient variations
- Benchmark performance

---

### Story 6.2: Build Recipe Matching API Endpoint

**Description:** Create API endpoint that matches pantry items to recipes, allowing 0-2 missing ingredients.

**Acceptance Criteria:**
- [ ] API route GET /api/recipes/match
- [ ] Query param: ?missingMax=2 (default)
- [ ] Fetch user's pantry items
- [ ] Normalize all pantry ingredient names
- [ ] Search Spoonacular by ingredients
- [ ] Calculate match for each recipe
- [ ] Return: recipe, matchedIngredients[], missingIngredients[], matchPercentage
- [ ] Sort by match percentage (desc)
- [ ] Filter recipes with > missingMax
- [ ] Response time < 2 seconds (NFR002)
- [ ] Cache results for 5 minutes

**Technical Tasks:**
- Create API route /api/recipes/match
- Fetch pantry items for user
- Call Spoonacular complexSearch with ingredients
- Implement matchRecipesToPantry function
- Calculate matches and missing ingredients
- Sort and filter results
- Add caching with React Query
- Test with various pantry sizes

---

### Story 6.3: Build "What Can I Cook?" Page

**Description:** Create UI page showing matched recipes based on pantry contents.

**Acceptance Criteria:**
- [ ] Page at app/(auth)/recipes/match/page.tsx (or similar)
- [ ] Link from main nav: "What Can I Cook?"
- [ ] Auto-load matched recipes on page load
- [ ] Recipe cards show match percentage badge
- [ ] Highlight matched ingredients in green
- [ ] Show missing ingredients in yellow/orange
- [ ] Filter by max missing ingredients (0, 1, 2)
- [ ] Sort by match percentage
- [ ] Empty state: "Add ingredients to your pantry to see recipe matches"
- [ ] Loading state
- [ ] Error handling (FR016)
- [ ] Mobile responsive

**Technical Tasks:**
- Create match page
- Fetch from /api/recipes/match
- Create MatchedRecipeCard component
- Add match percentage badge
- Style matched vs missing ingredients
- Add filter controls
- Test with empty pantry
- Test with full pantry

---

## Epic 7: Smart Grocery List Generation

**Description:** Generate shopping lists for recipes, excluding items already in pantry (FR005).

**Priority:** High

**Functional Requirements:** FR005

**Architecture Reference:** Smart Grocery List module

### Story 7.1: Build Grocery List API Endpoint

**Description:** Create API that compares recipe ingredients to pantry and generates needed items list.

**Acceptance Criteria:**
- [ ] API route POST /api/grocery-list
- [ ] Body: { recipeId: string }
- [ ] Fetch recipe ingredients
- [ ] Fetch user's pantry items
- [ ] Compare using fuzzy matching
- [ ] Return: { needed: Ingredient[], have: Ingredient[] }
- [ ] Needed list includes quantities
- [ ] Performance < 1 second
- [ ] Error handling (FR016)

**Technical Tasks:**
- Create API route
- Fetch recipe from database or Spoonacular
- Parse recipe ingredients
- Fetch pantry items
- Implement ingredient comparison with fuzzy matching
- Generate needed list
- Format response
- Test with various recipes

---

### Story 7.2: Build Grocery List UI Component

**Description:** Create UI component that shows grocery list for a recipe with checkboxes.

**Acceptance Criteria:**
- [ ] Component: GroceryListModal (dialog/modal)
- [ ] Triggered from recipe detail page
- [ ] Two sections: "You Have" (green) and "You Need" (red/orange)
- [ ] Checkboxes for each needed item
- [ ] Quantities and units shown
- [ ] "Add to List" button (future: save list)
- [ ] "Print" button
- [ ] "Share" button (optional)
- [ ] Mobile responsive
- [ ] Loading state while generating

**Technical Tasks:**
- Create GroceryListModal component
- Add button on recipe detail page
- Fetch from /api/grocery-list
- Display needed and have items
- Style with Tailwind + shadcn/ui
- Add print functionality (window.print)
- Test with various recipes

---

## Epic 8: Expiration Alerts and Notifications

**Description:** Notify users 2-3 days before food expires and suggest recipes using expiring ingredients (FR009, FR010).

**Priority:** High (Key value proposition)

**Functional Requirements:** FR009, FR010

**Architecture Reference:** Expiration Alert System (Novel Pattern)

### Story 8.1: Setup Vercel Cron Job for Expiration Checking

**Description:** Create scheduled function that runs daily to check for expiring items.

**Acceptance Criteria:**
- [ ] API route: app/api/cron/check-expirations/route.ts
- [ ] Protected by CRON_SECRET (Authorization header)
- [ ] Runs daily at 9 AM UTC
- [ ] Query items expiring in next 3 days
- [ ] Create notification for each user with expiring items
- [ ] Message: "{count} items expiring soon"
- [ ] Log execution (successful runs, items found)
- [ ] Error handling and logging

**Technical Tasks:**
- Create cron API route
- Add CRON_SECRET to .env
- Generate secret: `openssl rand -base64 32`
- Query items with bestBeforeDate <= now + 3 days
- Group by userId
- Create notifications in database
- Add to vercel.json cron config
- Test with Vercel CLI: `vercel dev`
- Deploy and test cron execution

---

### Story 8.2: Implement Notification Data Model and API

**Description:** Create API routes to fetch and mark notifications as read.

**Acceptance Criteria:**
- [ ] Notification model already in Prisma schema (from Story 1.3)
- [ ] API route GET /api/notifications (user-specific)
- [ ] Query param: ?unreadOnly=true
- [ ] API route PUT /api/notifications/[id] (mark as read)
- [ ] Response includes foodItemId for context
- [ ] Performance < 500ms
- [ ] Error handling (FR016)

**Technical Tasks:**
- Create GET /api/notifications
- Query Prisma with userId filter
- Order by createdAt desc
- Create PUT /api/notifications/[id]
- Update isRead = true
- Test API routes
- Add indexes if needed

---

### Story 8.3: Build Notification Bell UI Component

**Description:** Create notification bell icon in header with badge count and dropdown list.

**Acceptance Criteria:**
- [ ] Bell icon in app header (all pages)
- [ ] Badge shows unread count (red dot or number)
- [ ] Click opens dropdown with notifications
- [ ] Each notification shows: message, time ago, type icon
- [ ] Click notification marks as read
- [ ] Click notification navigates to context (e.g., pantry item)
- [ ] "Mark all as read" button
- [ ] "View all" link to notifications page
- [ ] Empty state: "No new notifications"
- [ ] Real-time updates (poll every 60s)
- [ ] Mobile responsive

**Technical Tasks:**
- Create NotificationBell component
- Use shadcn/ui DropdownMenu
- Fetch from /api/notifications?unreadOnly=true
- Poll with React Query (refetchInterval: 60000)
- Create NotificationItem component
- Implement mark as read on click
- Add navigation on click
- Style with Tailwind
- Test notification flow

---

### Story 8.4: Add Recipe Suggestions for Expiring Items

**Description:** Enhance cron job to find recipes using expiring ingredients and create recipe suggestion notifications.

**Acceptance Criteria:**
- [ ] Cron job calls recipe matching for expiring items
- [ ] Use matchRecipesToPantry with maxMissing=1
- [ ] Create notification type 'recipe_suggestion'
- [ ] Message: "Try '{recipe title}' using your expiring items"
- [ ] Link to recipe detail page
- [ ] Maximum 1 recipe suggestion per day per user
- [ ] No suggestion if no matches found

**Technical Tasks:**
- Update cron route
- Call matchRecipesToPantry for expiring items
- Take top recipe (highest match %)
- Create recipe_suggestion notification
- Store recipe URL or ID in notification
- Test with expiring items
- Verify notification appears in UI

---

## Epic 9: Landing Page and Public Routes

**Description:** Create landing page for unauthenticated users with project information and call-to-action.

**Priority:** Medium (Can be simple for MVP)

**Architecture Reference:** (unauth) route group

### Story 9.1: Build Landing Page

**Description:** Create simple landing page explaining the app with login/register CTAs.

**Acceptance Criteria:**
- [ ] Page at app/(unauth)/page.tsx
- [ ] Hero section: Title, tagline, hero image
- [ ] Value proposition: "Reduce food waste, inspire cooking"
- [ ] Key features listed (3-5 bullets)
- [ ] Screenshots or mockups (optional)
- [ ] "Get Started" button → register page
- [ ] "Login" button → login page
- [ ] Footer with links
- [ ] Mobile responsive
- [ ] Loads < 1 second

**Technical Tasks:**
- Create landing page
- Write copy highlighting value
- Add call-to-action buttons
- Add simple graphics (icons or stock images)
- Style with Tailwind
- Test on mobile and desktop
- Optimize images with next/image

---

### Story 9.2: Build Public Recipe Browser

**Description:** Allow unauthenticated users to browse today's featured recipes (limited functionality).

**Acceptance Criteria:**
- [ ] Section on landing page: "Today's Recipes"
- [ ] Show 6-12 featured recipes (random or curated)
- [ ] Recipe cards: image, title, cooking time
- [ ] Click shows recipe detail (public)
- [ ] No "Cook This" or grocery list features (requires login)
- [ ] CTA: "Sign up to save to your pantry"
- [ ] Mobile responsive

**Technical Tasks:**
- Add featured recipes section to landing page
- Fetch recipes from cache or Spoonacular
- Reuse RecipeCard component
- Create public recipe detail route (optional)
- Add login prompts on protected features
- Test unauthenticated access

---

## Epic 10: Testing and Quality Assurance

**Description:** Implement unit, integration, and E2E tests to ensure quality and prevent regressions.

**Priority:** Medium (Best practice, recommended)

**Architecture Reference:** Testing strategy

### Story 10.1: Setup Testing Infrastructure

**Description:** Configure Vitest for unit/integration tests and Playwright for E2E tests.

**Acceptance Criteria:**
- [ ] Vitest installed and configured
- [ ] Testing Library installed (React, User Event)
- [ ] vitest.config.ts configured
- [ ] Test scripts in package.json: `npm run test`, `npm run test:watch`
- [ ] Playwright installed and configured
- [ ] playwright.config.ts configured
- [ ] E2E script: `npm run test:e2e`
- [ ] Test file conventions: *.test.ts, *.integration.test.ts, *.e2e.test.ts
- [ ] All tests pass

**Technical Tasks:**
- Install Vitest and dependencies
- Install Playwright
- Create vitest.config.ts
- Create playwright.config.ts
- Setup test scripts in package.json
- Create example test files
- Verify tests run in CI/CD

---

### Story 10.2: Write Unit Tests for Critical Functions

**Description:** Add unit tests for recipe matching, fuzzy search, and utility functions.

**Acceptance Criteria:**
- [ ] Tests for normalizeIngredientName
- [ ] Tests for fuzzyMatch
- [ ] Tests for matchRecipesToPantry
- [ ] Tests for date utilities
- [ ] Tests for validation schemas (Zod)
- [ ] All tests pass
- [ ] Coverage > 70% for tested files

**Technical Tasks:**
- Create lib/recipe-matching.test.ts
- Create lib/validation/*.test.ts
- Write test cases for edge cases
- Mock Prisma for database tests
- Run tests and verify passing

---

### Story 10.3: Write Integration Tests for API Routes

**Description:** Add integration tests for critical API endpoints (pantry, recipes, notifications).

**Acceptance Criteria:**
- [ ] Tests for GET /api/pantry
- [ ] Tests for POST /api/pantry
- [ ] Tests for GET /api/recipes/match
- [ ] Tests for GET /api/notifications
- [ ] Mock database with in-memory SQLite or test database
- [ ] Mock Spoonacular API
- [ ] All tests pass
- [ ] Test authenticated and unauthenticated requests

**Technical Tasks:**
- Create app/api/pantry/route.integration.test.ts
- Create app/api/recipes/match/route.integration.test.ts
- Setup test database
- Mock Auth.js sessions
- Mock Spoonacular responses
- Write test cases
- Run tests and verify

---

### Story 10.4: Write E2E Tests for Critical User Flows

**Description:** Add Playwright E2E tests for registration, login, add item, and recipe search flows.

**Acceptance Criteria:**
- [ ] E2E test: User registration and login
- [ ] E2E test: Add food item to pantry
- [ ] E2E test: Search recipes and view details
- [ ] E2E test: Generate grocery list
- [ ] E2E test: View notifications
- [ ] Tests run in headless mode
- [ ] Screenshots on failure
- [ ] All tests pass

**Technical Tasks:**
- Create tests/e2e/auth.e2e.test.ts
- Create tests/e2e/pantry.e2e.test.ts
- Create tests/e2e/recipes.e2e.test.ts
- Setup test user credentials
- Run tests locally
- Add to CI/CD pipeline

---

## Epic 11: Deployment and Monitoring

**Description:** Deploy to Vercel, configure production environment, and setup monitoring.

**Priority:** High (Required for MVP launch)

**Architecture Reference:** Deployment Architecture

### Story 11.1: Deploy to Vercel Production

**Description:** Connect GitHub repo to Vercel and deploy production environment.

**Acceptance Criteria:**
- [ ] GitHub repository connected to Vercel
- [ ] Production deployment successful
- [ ] Production URL: https://ibe160-app.vercel.app (or custom domain)
- [ ] Automatic deployments on main branch
- [ ] Preview deployments on PRs
- [ ] Build completes without errors
- [ ] All pages load correctly in production

**Technical Tasks:**
- Connect repo to Vercel
- Configure project settings
- Add environment variables in Vercel dashboard
- Deploy to production
- Test production deployment
- Verify all features work

---

### Story 11.2: Configure Production Environment Variables

**Description:** Add all required environment variables to Vercel for production.

**Acceptance Criteria:**
- [ ] DATABASE_URL (production Supabase)
- [ ] DIRECT_URL (production Supabase)
- [ ] AUTH_SECRET (new secret for production)
- [ ] AUTH_URL (production URL)
- [ ] SPOONACULAR_API_KEY (production key)
- [ ] CRON_SECRET (for Vercel cron auth)
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] All secrets unique from development
- [ ] Environment variables saved in Vercel

**Technical Tasks:**
- Create production Supabase project
- Generate new AUTH_SECRET for production
- Generate new CRON_SECRET
- Add all env vars to Vercel dashboard
- Verify no secrets committed to Git
- Test production build

---

### Story 11.3: Run Production Database Migrations

**Description:** Apply Prisma migrations to production Supabase database.

**Acceptance Criteria:**
- [ ] Production DATABASE_URL configured
- [ ] Prisma migrations applied: `npx prisma migrate deploy`
- [ ] All tables created correctly
- [ ] Indexes applied
- [ ] Verify schema in Supabase dashboard
- [ ] No data loss (should be empty for new project)

**Technical Tasks:**
- Set DATABASE_URL to production
- Run `npx prisma migrate deploy`
- Verify migrations in Supabase
- Run `npx prisma generate`
- Test database connection
- Seed fallback recipes (optional)

---

### Story 11.4: Setup Vercel Analytics and Monitoring

**Description:** Enable Vercel Analytics for performance monitoring and error tracking.

**Acceptance Criteria:**
- [ ] Vercel Analytics enabled
- [ ] Speed Insights active
- [ ] Web Vitals tracked (LCP, FID, CLS, TTFB, INP)
- [ ] Dashboard shows page performance
- [ ] Error tracking enabled (optional: Sentry)
- [ ] Alerts configured for critical issues
- [ ] Lighthouse score > 90 verified (NFR005)

**Technical Tasks:**
- Enable Analytics in Vercel dashboard
- Add analytics script to app (if needed)
- Deploy and generate traffic
- Verify metrics appearing in dashboard
- Run Lighthouse audit on production
- Fix any performance issues

---

## Epic 12: Polish and User Experience

**Description:** Final polish, responsive design, accessibility, and user experience improvements.

**Priority:** Medium (Quality improvements)

**Non-Functional Requirements:** NFR001, NFR003, NFR006

### Story 12.1: Responsive Design Audit and Fixes

**Description:** Test and fix responsive design on mobile, tablet, and desktop breakpoints.

**Acceptance Criteria:**
- [ ] All pages work on mobile (320px - 768px)
- [ ] All pages work on tablet (768px - 1024px)
- [ ] All pages work on desktop (1024px+)
- [ ] Navigation works on mobile (hamburger menu)
- [ ] Forms usable on mobile (no zoom required)
- [ ] Modals/dialogs work on all sizes
- [ ] No horizontal scroll
- [ ] Touch targets > 44px (mobile)
- [ ] Tested on iOS Safari and Chrome Android

**Technical Tasks:**
- Test all pages on different screen sizes
- Fix layout issues
- Implement mobile navigation
- Adjust font sizes and spacing
- Test touch interactions
- Use Chrome DevTools responsive mode
- Test on real devices

---

### Story 12.2: Accessibility Improvements

**Description:** Ensure WCAG 2.1 AA compliance with keyboard navigation, ARIA labels, and color contrast (NFR006).

**Acceptance Criteria:**
- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] ARIA labels on all buttons and links
- [ ] Form labels properly associated
- [ ] Color contrast > 4.5:1 (AA standard)
- [ ] Alt text on all images
- [ ] Skip to main content link
- [ ] Screen reader tested (optional: NVDA, JAWS)
- [ ] Lighthouse accessibility score > 90

**Technical Tasks:**
- Run Lighthouse accessibility audit
- Add ARIA labels where missing
- Test keyboard navigation
- Check color contrast with tools
- Add alt text to images
- Test with screen reader
- Fix all accessibility issues

---

### Story 12.3: Loading States and Animations

**Description:** Add skeleton loaders, smooth transitions, and loading animations for better UX.

**Acceptance Criteria:**
- [ ] Skeleton loaders on all async content
- [ ] Smooth page transitions
- [ ] Button loading states with spinners
- [ ] Form submission feedback
- [ ] Success animations (checkmark, toast)
- [ ] Error animations (shake, alert)
- [ ] No jarring layout shifts
- [ ] Animations respect prefers-reduced-motion
- [ ] Performance not impacted

**Technical Tasks:**
- Add skeleton components from shadcn/ui
- Implement loading states on all pages
- Add transitions with Tailwind
- Use Lucide React for spinners and icons
- Test animations
- Verify accessibility

---

### Story 12.4: Error Messages and Empty States

**Description:** Ensure all error messages are helpful (FR016) and empty states guide users (FR014).

**Acceptance Criteria:**
- [ ] All errors have friendly messages (FR016)
- [ ] Errors include retry options
- [ ] Empty states provide guidance (FR014)
- [ ] 404 page with helpful links
- [ ] 500 page with error reporting
- [ ] Offline errors explain connectivity issue
- [ ] Form validation errors specific and helpful
- [ ] No technical jargon in user-facing messages

**Technical Tasks:**
- Audit all error messages
- Rewrite technical errors as user-friendly
- Add retry buttons
- Create helpful empty states
- Design 404 and 500 pages
- Test all error scenarios
- Verify user experience

---

## Implementation Notes

### Epic Sequencing

**Phase 1: Foundation (Epics 1-2)**
- Epic 1: Project Initialization (Stories 1.1 - 1.4)
- Epic 2: User Authentication (Stories 2.1 - 2.3)

**Phase 2: Core Features (Epics 3-6)**
- Epic 3: Food Inventory Management (Stories 3.1 - 3.5)
- Epic 4: Offline-First Infrastructure (Stories 4.1 - 4.3)
- Epic 5: Recipe Search and Discovery (Stories 5.1 - 5.4)
- Epic 6: Flexible Recipe Matching (Stories 6.1 - 6.3)

**Phase 3: Value-Add Features (Epics 7-8)**
- Epic 7: Smart Grocery List (Stories 7.1 - 7.2)
- Epic 8: Expiration Alerts (Stories 8.1 - 8.4)

**Phase 4: Polish (Epics 9-12)**
- Epic 9: Landing Page (Stories 9.1 - 9.2)
- Epic 10: Testing (Stories 10.1 - 10.4)
- Epic 11: Deployment (Stories 11.1 - 11.4)
- Epic 12: Polish and UX (Stories 12.1 - 12.4)

### Success Criteria

**MVP Complete When:**
- All Epic 1-8 stories completed
- All FR001-FR016 implemented
- All NFR001-NFR009 met
- Deployed to production
- Basic testing complete
- Lighthouse score > 90

### Timeline Estimate

- **Week 1:** Epics 1-2 (Foundation + Auth)
- **Week 2:** Epic 3 (Inventory Management)
- **Week 3:** Epic 4 (Offline) + Epic 5 start (Recipes)
- **Week 4:** Epic 5 complete + Epic 6 (Recipe Matching)
- **Week 5:** Epic 7-8 (Grocery List + Alerts)
- **Week 6:** Epics 9-12 (Landing, Testing, Deploy, Polish)

---

**Total:** 12 Epics, 48 Stories

**Generated:** 2025-11-09
**Based on:** docs/PRD.md, docs/architecture.md
