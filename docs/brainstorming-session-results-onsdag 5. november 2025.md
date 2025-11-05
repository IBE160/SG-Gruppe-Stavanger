# Brainstorming Session Results - onsdag 5. november 2025

This document captures the brainstorming and analysis conducted on the "Smart Food & Recipe Platform" proposal, specifically addressing clarifications requested by the Business Analyst.

---

## 1. "Creative Mode" Discrepancy

**Analysis:** The original proposal had a contradiction regarding the "Creative Mode." User Flow 1 suggested a non-AI "Creative Mode" for unregistered users to improve engagement, while the core functionality and AI integration sections explicitly deferred AI-powered features to Phase 2.

**Resolution & Recommendation:**
To resolve this, a **non-AI version of "Creative Mode" has been defined for the MVP**.

*   **Functionality:** An unregistered user can manually enter 2-3 ingredients. The application will then perform a basic API call to Spoonacular to find recipes that include those specific ingredients.
*   **Benefit:** This approach delivers on the user engagement goal mentioned in the user flow without requiring AI, thus preserving the "no AI in MVP" rule and keeping the scope manageable. It acts as a "teaser" for the more advanced AI version to come.

**Changes Made to `proposal.md`:**
*   Added a new bullet point under "Must Have (MVP)":
    `- **Basic Creative Mode:** Users can manually enter 2-3 ingredients and get recipe suggestions from Spoonacular API based on those inputs (no AI).`

---

## 2. "My Shopping List" Feature

**Analysis:** The "Shopping List" feature was integral to User Flows #5 and #14 but was not explicitly listed in the "Core Functionality" section. This represented a scope gap, as users need a way to track missing ingredients for recipes.

**Resolution & Recommendation:**
"**Shopping List Management" has been officially added to the "Must Have (MVP)" feature list.**

*   **MVP Scope:**
    *   Ability to add items to a shopping list (both manually and from a recipe's missing ingredients).
    *   A dedicated page to view and manage the list.
    *   Ability to check off or delete items from the list.
*   **Data Model Impact:** New `ShoppingList` and `ShoppingListItem` models have been added to the Prisma schema, and the `User` model has been updated to include a relation to `ShoppingList`. The "Relationships" section was also updated.

**Changes Made to `proposal.md`:**
*   Added a new bullet point under "Must Have (MVP)":
    `- **Shopping List Management:** Users can add, view, and delete items from a shopping list. Items can be added manually or from missing recipe ingredients.`
*   Added new Prisma models:
    ```prisma
    model ShoppingList {
      id        String         @id @default(cuid())
      userId    String         @unique
      user      User           @relation(fields: [userId], references: [id])
      items     ShoppingListItem[]
      createdAt DateTime       @default(now())
    }

    model ShoppingListItem {
      id            String     @id @default(cuid())
      shoppingListId String
      shoppingList  ShoppingList @relation(fields: [shoppingListId], references: [id])
      name          String
      quantity      Float?
      unit          String?
      isCompleted   Boolean    @default(false)
      createdAt     DateTime   @default(now())
    }
    ```
*   Updated `User` model:
    `shoppingList  ShoppingList?`
*   Updated "Relationships" section to include:
    `- A **User** has one **ShoppingList**.`
    `- A **ShoppingList** has many **ShoppingListItems**.`

---

## 3. Estimation Methodology ("Money & CO₂ Saved")

**Analysis:** User Flows #12 and #13 introduced dashboard features that calculate "money saved" and "CO₂ saved," but the methodology for these calculations was undefined. Accurate methodology is crucial for credibility and user trust.

**Resolution & Recommendation:**
The methodology has been defined, and the implementation of these specific metrics has been **scheduled for a post-MVP phase (Phase 2)**.

*   **Money Saved Methodology:**
    *   **Data:** Requires users to optionally enter the purchase price when adding a food item.
    *   **Calculation:** `Sum of the price of all items that were used within 3 days of their expiration date.` This directly links savings to waste prevention.
*   **CO₂ Saved Methodology:**
    *   **Data:** Requires an internal database mapping food categories to standard "CO₂ equivalent" factors (e.g., from environmental science data).
    *   **Calculation:** `Sum of (item weight in kg * CO₂e factor for that item's category) for items used near expiration.`

**Changes Made to `proposal.md`:**
*   Added to "Nice to Have (Phase 2 and Beyond)":
    `- **Dashboard Summaries with Savings Metrics:** Monthly/Yearly overviews including estimated money saved (based on user-inputted prices for items used before expiration) and CO₂ saved (based on food category multipliers).`
*   Updated User Flows #12 and #13 with notes clarifying that "Estimated money saved" and "CO₂ saved" metrics are planned for Phase 2, requiring additional data and methodology.