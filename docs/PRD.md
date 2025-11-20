# ibe160 Product Requirements Document (PRD)

**Author:** BIP
**Date:** 2025-11-06
**Project Level:** 3

---

## Goals and Background Context

### Goals

**Primary Goals (MVP Success Criteria):**
*   Achieve 100 beta users.
*   Ensure 80% of test users can add food and get recipe suggestions within their first session without a tutorial.
*   Recipe search loads within 2 seconds.
*   The app is intuitive and requires no tutorial.

**Secondary Goals (Key Performance Indicators):**
*   Number of food items added to inventory.
*   Number of recipes cooked.
*   User retention rate.

### Background Context

Globally, households waste over 1 billion meals per day, and in the United States, the average family of four throws out $1,600 worth of produce annually. Our target users—busy individuals and families—experience this problem through three primary pain points:
1.  They forget what ingredients they have, leading to expired food and unnecessary purchases.
2.  Finding recipes that match their available ingredients is a time-consuming and frustrating process.
3.  A lack of meal inspiration results in repetitive meals and underutilized ingredients.

Current market solutions are fragmented; they typically focus on either meal planning or inventory management, but rarely integrate both intelligently. Our application will bridge this gap by providing a single, smart platform that directly addresses all three pain points.

---

## Technical Stack, Dependencies, and Considerations

*   **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui
*   **Backend:** Next.js API Routes
*   **Database:** Supabase (PostgreSQL)
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js
*   **Hosting:** Vercel, Supabase
*   **Third-party APIs:** Spoonacular API (free tier: 150 requests/day)
*   **Fallback Strategy:** To mitigate API limitations and potential outages, a local fallback dataset of 20-30 curated recipes will be implemented.
*   **Smart Matching Algorithm:** The MVP's flexible recipe matching will be algorithm-based. It is not an AI/ML feature at this stage.

---

## Constraints

*   **Timeline:** 9 weeks
*   **Budget:** <$100/month
*   **API Limits:** Spoonacular API free tier (150 requests/day)
*   **Team Size/Skills:** Student project team with skills in full-stack web development.

---

## Long-term Vision

To evolve the platform into a comprehensive kitchen assistant that not only reduces food waste but also helps users make healthier and more sustainable food choices. This includes:
*   **Creative recipe generation (GPT):** Allow users to generate unique recipes from prompts.
*   **Intelligent ingredient substitution:** Suggest smart substitutions for missing ingredients.
*   **Semantic recipe search (embeddings):** Implement advanced search that understands the user's intent (e.g., "healthy chicken dishes").
*   Provide a valuable service that users are willing to pay for in the future.

---

## Requirements

### Functional Requirements

*   **FR001:** Users must be able to register and log in securely using an email and password.
*   **FR002:** Users must be able to add food items to their inventory, including name, quantity, and expiration date.
*   **FR003:** Users must be able to view, edit, and delete items from their inventory.
*   **FR004:** The system must provide an overview of the user's pantry and fridge.
*   **FR005:** The system must generate a grocery list for a selected recipe, excluding items the user already has in their inventory.
*   **FR006:** The system must allow users to browse, search, and view recipes from the Spoonacular API.
*   **FR007:** The system must suggest recipes even if the user is missing one or two ingredients.
*   **FR008:** The system must require user confirmation before deducting ingredients from the inventory after a meal is cooked.
*   **FR009:** The system must display in-app notifications for food items nearing their expiration date (2-3 days before).
*   **FR010:** The system must recommend recipes that use ingredients close to their expiration date.
*   **FR012:** System must maintain long session persistence (30+ days) to prevent frustrating re-logins, especially for mobile users.
*   **FR013:** System must display "Last synced: [timestamp]" indicator to communicate data freshness, especially in offline scenarios.
*   **FR014:** System must provide helpful empty states with clear guidance for new users (e.g., "Add your first ingredient to get started").
*   **FR015:** System must implement fuzzy search for ingredient name variations to improve matching accuracy (e.g., "tomato" matches "canned tomatoes", "cherry tomatoes").
*   **FR016:** System must display clear loading states and user-friendly error messages with retry options when operations fail.

### Non-Functional Requirements

*   **NFR001:** The application must be mobile-responsive.
*   **NFR002:** Recipe search results must load within 2 seconds.
*   **NFR003:** The application should be intuitive and easy to use without a tutorial.
*   **NFR004:** The application must have an offline-first caching architecture to ensure functionality in low-connectivity scenarios.
*   **NFR005:** Application must achieve a Lighthouse performance score >90.
*   **NFR006:** Application must comply with WCAG 2.1 AA accessibility standards (keyboard navigation, ARIA labels, color contrast).
*   **NFR007:** System must achieve ≥99% uptime on Vercel + Supabase infrastructure.
*   **NFR008:** Offline cached data must be available to users within 500ms.
*   **NFR009:** Inventory operations (add/edit/delete) must complete within 1 second to ensure responsive user experience.

---

## User Journeys

*   **Journey 1: Adding groceries to the pantry.** A user comes home from shopping, logs in, and quickly adds their new groceries to the pantry using a simple form, including names, quantities, and expiration dates.
*   **Journey 2: Finding a recipe for dinner.** A hungry user logs in and browses recipes. The app's flexible matching algorithm suggests meals even if they are missing one or two ingredients, preventing "no results" dead ends. After selecting a recipe, a confirmation dialog asks them to confirm the ingredients used before they are deducted from the inventory.
*   **Journey 3: Checking pantry while at the store.** A user at the grocery store with poor connectivity opens the app. The offline cache instantly loads their pantry, and a "Last synced" timestamp gives them confidence in the data's freshness, allowing them to check what they have before buying more.
*   **Journey 4: Getting dinner inspiration at the store.** A user at the store browses recipes for inspiration. When they select a recipe, the app clearly indicates which ingredients they already have and which they need to buy.
*   **Journey 5: Using expiring food.** A user receives an in-app notification about items nearing their expiration date. They are then presented with a list of recipes that use those specific ingredients, helping them to cook a meal and prevent food waste.
*   **Journey 6: First-time user onboarding.** A new user logs in for the first time and is greeted with a helpful empty state that guides them to add their first ingredient. The intuitive interface allows them to successfully add an item and get a recipe suggestion within their first session, without needing a tutorial.

---

## Out of Scope

The following features are explicitly out of scope for the MVP and are planned for future phases:

*   Integration with grocery delivery services
*   Push notifications (browser API)
*   Recipe import from external URLs

---

## Implemented Beyond MVP

The following features were originally planned for future phases but have been implemented:

### Phase 2 Features (Implemented)
*   **Barcode Scanning** - Camera-based barcode scanning for quick item entry (`src/components/BarcodeScanner.tsx`)
*   **User Preferences & Dietary Profiles** - Save dietary restrictions, allergies, cuisine preferences (`src/app/(auth)/preferences/`)
*   **AI-Enhanced Search** - Semantic recipe search using AI (`src/app/api/ai/search/`)
*   **Ingredient Substitution** - AI-powered substitution suggestions (`src/app/api/ai/substitute/`)
*   **Nutritional Analysis** - Display nutrition facts for recipes (`src/app/api/ai/nutrition/`)
*   **Email alerts** - Email notifications for expiring items (`src/app/api/cron/expiration-alerts/`)

### Phase 3 Features (Implemented)
*   **Multi-user household accounts** - Shared pantry access with invite codes (`Household` model)
*   **User-generated content** - Recipe ratings and reviews (`RecipeReview` model)
*   **Gamification** - Points, levels, and achievements system (`Achievement`, `UserAchievement` models)

---
