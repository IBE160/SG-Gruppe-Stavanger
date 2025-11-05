# Smart Food & Recipe Platform – Reduce Food Waste, Inspire Cooking

## Background
Households waste significant amounts of food due to poor inventory tracking and lack of meal inspiration. People often forget what ingredients they have, leading to expired food and unnecessary purchases. Additionally, finding recipes that match available ingredients is time-consuming and fragmented across multiple platforms.

## Purpose
Develop a **mobile-responsive web application** that helps users **reduce food waste** and **discover meal inspiration** by intelligently managing their kitchen inventory. Users can register food items (with expiration dates), receive alerts when items are nearing expiration, and get **personalized recipe suggestions** using available ingredients and dietary preferences.

## Target Users
- **Primary:** Busy individuals and families who want to reduce waste and plan meals efficiently.  
- **Secondary:** Students and young professionals on tight budgets who want to maximize grocery use.  
- **Tertiary:** Environmentally conscious consumers interested in sustainable cooking practices.

## Core Functionality

### Must Have (MVP)
- **User Authentication:** Secure registration and login using NextAuth.js (email/password).  
- **Food Inventory Management:** Users manually add food items with quantities and expiration dates.  
- **Inventory Overview:** Users can view, edit, and delete items from their pantry or fridge.  
- **Recipe Database (Spoonacular API):** Browse, search, and view recipes from Spoonacular’s API.  
- **Smart Recipe Suggestions:** Suggest recipes based on the user’s current inventory.  
- **Automatic Inventory Update:** When a recipe is used, ingredients are automatically deducted.  
- **Expiration Alerts:** In-app notifications for food nearing expiration (2–3 days before).  
    - **Recipe Recommendations for Expiring Items:** Suggest meals using ingredients close to expiration.
    - **Basic Creative Mode:** Users can manually enter 2-3 ingredients and get recipe suggestions from Spoonacular API based on those inputs (no AI).
    - **Shopping List Management:** Users can add, view, and delete items from a shopping list. Items can be added manually or from missing recipe ingredients.
### Nice to Have (Phase 2 and Beyond)
- **User Preferences & Dietary Profiles:** Save dietary restrictions and preferred cuisines.  
- **Recipe Tagging & Advanced Filters:** Filter recipes by nutrition, difficulty, or dietary type.  
- **Creative Mode – Ingredient Substitution:** Simple AI-powered substitutions using GPT for common ingredient swaps.  
- **AI-Enhanced Search:** Use embeddings for smarter, semantic recipe matching (e.g., “healthy chicken” finds similar dishes).  
- **Smart Shopping Suggestions:** Recommend items based on cooking history and consumption patterns.  
- **Nutritional Analysis:** Display nutrition facts and healthier recipe alternatives.  
    - **Picture of receipt or Food Items:** Add food items to inventory by taking a picture of either the food itself or the receipt. se research report in @docs\reseach-missing-user-flows.md
    - **Dashboard Summaries with Savings Metrics:** Monthly/Yearly overviews including estimated money saved (based on user-inputted prices for items used before expiration) and CO₂ saved (based on food category multipliers).

    - **Eco-Facts & Food Stories:** A personalized content feed with educational, bite-sized information about the environmental impact of food waste.
    - **Upcycle Your Scraps:** Provides creative and practical tips for what to do with food that is no longer edible or with food scraps (e.g., composting, growing new plants).

## Data Requirements

### Core Entities
Using **Prisma schema** with the following models:

\`\`\`prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  createdAt     DateTime @default(now())
  foodItems     FoodItem[]
  preferences   UserPreference?
  shoppingList  ShoppingList?
}

model FoodItem {
  id              String   @id @default(cuid())
  name            String
  category        String
  bestBeforeDate  DateTime
  quantity        Float
  unit            String
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  createdAt       DateTime @default(now())
}

model Recipe {
  id             String   @id @default(cuid())
  title          String
  ingredients    String
  instructions   String
  cookingTime    Int
  servings       Int
  tags           String?
  createdAt      DateTime @default(now())
}

model Notification {
  id              String   @id @default(cuid())
  userId          String
  message         String
  type            String
  isRead          Boolean  @default(false)
  createdAt       DateTime @default(now())
  foodItemId      String?
}

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
\`\`\`

### Relationships
- A **User** has many **FoodItems**.  
- A **User** has one **ShoppingList**.
- A **ShoppingList** has many **ShoppingListItems**.
- A **Recipe** uses many **FoodItems**.  
- A **User** can receive many **Notifications**.  
- **User Preferences** influence recipe recommendations.

# User Flows – Smart Food & Recipe Platform

## 1. User Comes Home from Grocery Shopping
- Opens the website and lands on the **Landing Page**  
  *(Unregistered users can see “Today’s Recipes”, “Daily Inspiration”, or try a “Creative Mode” without saving results.  
  This improves engagement before login — an important UX element.)*
- Logs in  
- Selects **“My Pantry”**  
- Enters the **My Pantry** page  
- Clicks **“Add Food Item”** and fills in:
  - Name  
  - Quantity and unit  
  - Category (e.g., fruit, dairy)  
  - Expiration date  
- Repeats until all items are added  
- Logs out  

---

## 2. User Is Hungry and Wants to Know What to Cook for Dinner
- Opens the website and lands on the **Landing Page**  
- Logs in  
- Selects **“What Can I Cook for Dinner”**  
- Arrives at a page with recipes available based on the items in **“My Pantry”**  
- Can search, filter, or categorize recipes  
- Finds a recipe and clicks **“I’ll Make This One”**  
- The ingredients used in the recipe are deducted from **My Pantry**  
  - After selecting a recipe, show a confirmation message:  
    “Do you want to use the ingredients from your pantry?”  
    *(This avoids accidental deletion and could allow manual adjustments — e.g., “I didn’t use these ingredients…”)*  
- Receives confirmation:  
  “Recipe completed! Ingredients have been updated. Would you like to rate this recipe?”  
- Logs out  

---

## 3. User Is at the Store and Wants to Check What They Need to Buy
- Opens the website and lands on the **Landing Page**  
- Logs in  
- Selects **“See What’s in My Pantry”**  
- Logs out  

---

## 4. User Is at the Store and Wants Dinner Inspiration
- Opens the website and lands on the **Landing Page**  
- Clicks **“Recipes & Inspiration”**  
- Can filter by:
  - Price  
  - Cooking time  
  - Type of meal (dinner, lunch, dessert)  

---

## 5. User Is at the Store and Logged In, Looking for Dinner Ideas
- Opens the website and lands on the **Landing Page**  
- Logs in  
- Clicks **“Recipes & Inspiration”**  
- Clicks on a recipe  
- Receives message:  
  “You only need 2 more ingredients for this dish.”
- Adds the 2 ingredients to **My Shopping List**
- Logs out  

---

## 6. User Wants to Create a Profile for Preferences and Tips
- Opens the website and lands on the **Landing Page**  
- Logs in  
- Selects **“My Profile”**  
- Enters preferences, goals, and needs (e.g., eat healthier, more protein, vegan, allergies, more indulgent foods, etc.)  
- Clicks **“Update Profile”**  
- Reads **tips and tricks** on the profile page based on their preferences  
- Clicks on a direct link to recipes that match their chosen preferences  
- Logs out  

---

## 7. User Wants to View “My Liked Recipes” in Profile
- Opens the website and lands on the **Landing Page**  
- Logs in  
- Selects **“My Profile”**  
- Scrolls to the section **“My Liked Recipes ❤️”**  
- Sees a list/grid of previously liked recipes with thumbnails, titles, and quick links  
- Can:
  - Click a recipe to view full details  
  - Filter by meal type (Breakfast, Lunch, Dinner, Dessert)  
  - Remove recipes from the liked list  
- The system uses this data to generate personalized suggestions in the “Tips & Recommendations” section  
- Logs out  

---

## 8. User Wants to View and Use Soon-to-Expire Food Items
- Opens the website and lands on the **Landing Page**  
- Logs in  
- Sees a **notification badge** (e.g., “3 items expiring soon”)  
- Clicks **“Expiring Soon”** or navigates to **My Pantry → Expiring Items**  
- Views a list of items nearing expiration (sorted by date)  
- Selects an item → sees **recipe suggestions** that use it  
- Clicks on a recipe → can view, cook, and confirm usage  
- The ingredients used are automatically deducted from the pantry  
- Receives confirmation:  
  “Nice work! You just saved 2 items from going to waste.”  
- Logs out  

---

## 9. User Wants to Report a Bug or Suggest an Improvement
- Opens the website and lands on the **Landing Page**  
- Clicks **“Report a Bug or Suggest Improvement”**  
- A text box appears (limited to a set number of characters)  
- User selects a category (e.g., **Bug** or **Improvement**)  
- The message is sent to the **Smart Food support email**  
- A contact email address is displayed for direct follow-up  

---

## 10. User Wants to Generate a Creative Recipe (AI Mode)
- Opens the website and lands on the **Landing Page**  
- Logs in  
- Clicks **“Creative Mode”** (visible on landing page or recipe dashboard)  
- Enters a short prompt, such as:  
  - “Make something Italian with tomatoes and chicken”  
  - “Create a vegan breakfast that uses oats”  
- The app automatically includes **My Pantry items** to personalize the generation  
- The **AI engine (e.g., GPT or embedding model)** generates:  
  - Recipe title  
  - Ingredient list (highlighting which ones the user already has)  
  - Instructions  
  - Optional nutrition info or tips  
- The recipe appears in a “Creative Recipe Preview” view  
- User can:  
  - Save it to **My Recipes**  
  - Like it ❤️  
  - Mark ingredients as “used” (deduct from pantry)  
- Confirmation message appears:  
  “Your creative recipe has been saved! Ingredients updated in your pantry.”  
- Logs out  
 
---

## 11. User Wants to Delete Account and Data
- Opens the website and lands on the **Landing Page** 
- Logs in
- clicks on **“Account Settings.”**  
- Selects **“Delete My Account.”**  
- A warning message explains data will be permanently deleted (pantry, recipes, preferences, and statistics).  
- User confirms deletion with password re-entry.  
- App deletes all data via Supabase API and confirms: “Your account and data have been deleted.”  
- User receives optional exit survey or feedback link.  

---

## 12. User Wants to View Monthly Dashboard Summary
- Opens the website and lands on the **Landing Page**  
- Logs in
- clicks on the **Dashboard Page.**  
- Sees a **Monthly Overview Card** with:  
  - Total food items used.  
  - Meals cooked this month.
  *(Note: Estimated money saved and CO₂ saved metrics are planned for Phase 2, requiring additional data and methodology.)*
- Can click “See Details” for insights by category (e.g., dairy, produce, meat).  
- Can share achievements or download a summary (PDF).  
- Logs out.

---

## 13. Yearly Summary
- Opens the website and lands on the **Landing Page**  
- First time log in afte first of January in the current year
- Gets a **Notification Display** saying **Your Yearly Summary is Ready** with:
  - Total food items used.  
  - Meals cooked this year month.
  - **Top 3 most-used ingredients** and **Favorite Recipies** this year.
  *(Note: Estimated money saved and CO₂ saved metrics are planned for Phase 2, requiring additional data and methodology.)*
- The user can **download** a PDF summary or **share highlights** on social media.
- Logs out.

---

## 14. User wants to view shopping list
- Opens the website and lands on the **Landing Page**  
- Logs in
- navigates to **My Pantry**
- clicks on **My Shopping List**
- Add items or delete items or delete My Shopping List
- Logs out

---


## 15. User Interacts with Eco-Facts & Food Stories
- Opens the website and lands on the **Landing Page**
- Scrolls to the **"Eco-Facts & Food Stories"** section
- Sees a personalized card: "You've wasted bread twice this month. Did you know it takes 160 gallons of water to make a loaf of bread?"
- Clicks on the card to learn more about the water footprint of different foods
- Shares an interesting infographic to social media directly from the app
- Logs out

---

## 16. User Upcycles a Wasted Food Item
- Opens the app and navigates to **"My Pantry"**
- Marks an overripe tomato as "wasted"
- Instead of just confirming, the app shows a prompt: "Don't just toss it, upcycle it!"
- Clicks the "Upcycle It!" button
- A card appears with a tip: "Plant the seeds from your overripe tomato in a pot of soil and grow your own tomato plant. Here's how..."
- The user also sees an option to learn more about composting
- Feels empowered and educated, turning a negative moment into a positive one


---

**Future expansion (Phase 2–3):**
- **Smart substitution suggestions:** e.g., “You’re missing basil — try parsley instead.”  
- **Regenerate with constraints:** e.g., “Make it cheaper / faster / healthier.”

## Technical Framework

### Frontend
- **Framework:** Next.js 14 (App Router, Server Components, SSR, and SSG).  
- **Styling:** Tailwind CSS + shadcn/ui components for modern, accessible UI.  
- **Performance:** Built-in image optimization, automatic code-splitting, and fast page loads.

### Backend
- **Architecture:** Next.js API Routes for server logic.  
- **Database:** Supabase (PostgreSQL).  
- **ORM:** Prisma for schema management and migrations.
- **AI Integration:** **Pydantic AI** (for structured LLM outputs) and GPT API for creative mode and substitution suggestions.   
- **Authentication:** NextAuth.js (email/password).  
- **Hosting:** Vercel (frontend + API), Supabase cloud (database).  

### Rationale
This stack ensures tight integration, rapid development, scalability, and AI-friendly API extensions while aligning with project constraints and the teacher’s feedback.

## AI Integration
- **Phase 2 (Post-MVP):**
  - **Ingredient Substitution:** GPT-powered simple substitution recommendations (e.g., lime ↔ lemon).  
  - **AI Recipe Suggestions:** Use GPT or OpenAI embeddings for creative recipe variations.  
  - **Semantic Search:** Implement OpenAI’s `text-embedding-3-small` model to improve recipe search relevance.  
  - **Personalized Educational Content:** Use basic data analysis or simple AI to personalize the "Eco-Facts & Food Stories" content based on user's waste habits.

AI is intentionally **not part of the MVP** to keep the core development focused and achievable within the 6-week timeline.

## Recipe Source
- **Primary:** Spoonacular API (Free tier, 150 requests/day)  
- **Fallback:** Locally stored seed dataset (20–30 curated recipes) for offline testing.

## Notifications
- **MVP:** In-app notifications when items approach expiration.  
- **Phase 2:** Add optional email alerts via Supabase functions or third-party API (Resend/SendGrid).  
- **Phase 3 (Optional):** Push notifications through web browser API.

## 6-Week Timeline

| **Week** | **Focus** |
|-----------|------------|
| **Week 1** | Project setup, authentication (NextAuth.js), Supabase connection |
| **Week 2** | Food inventory CRUD operations, Prisma schema integration |
| **Week 3** | Recipe API integration (Spoonacular), recipe display & search |
| **Week 4** | Smart recipe matching, expiration alerts, basic notifications |
| **Week 5** | Recipe suggestions, inventory auto-update, UI polish |
| **Week 6** | Testing, debugging, performance optimization, deployment |

## Success Criteria

### Functional
- Users can register, log in, and manage inventory.  
- Recipes display correctly from Spoonacular.  
- Recipe suggestions include at least 3 matches using user inventory.  
- Alerts trigger correctly 2–3 days before expiration.  
- Inventory updates when recipes are completed.

### User Experience
- 80% of test users can add food and get recipe suggestions within first session.  
- Recipe search loads within 2 seconds.  
- App is intuitive without requiring a tutorial.
- At least 25% of users engage with a Phase 2 feature (e.g., Upcycling) within the first month of its release.

### Technical
- ≥99% uptime on Vercel + Supabase.  
- Recipe search results under 1 second.  
- Lighthouse score > 90.  
- Responsive design across devices.  

## Known Challenges & Solutions

| **Challenge** | **Impact** | **Solution** | **Priority** |
|----------------|-------------|---------------|---------------|
| Recipe API limitations | High | Use Spoonacular API with caching and fallback dataset | High |
| Ingredient name variations | Medium | Use normalization + fuzzy matching for common terms | High |
| Limited AI scope | Medium | Add simple GPT-based substitutions in Phase 2 | Medium |
| Data privacy | Medium | Ensure secure auth (NextAuth + Supabase), enable user data deletion | High |
| Performance optimization | Low | Use SSR and incremental static regeneration | Medium |

## Accessibility & Data Privacy
- **Accessibility:** WCAG 2.1 AA compliance goals; focus on keyboard navigation and ARIA labels.  
- **Data Privacy:** Follow GDPR-like principles—users can delete accounts and data anytime.

## Deployment Strategy
- **CI/CD:** Vercel Git integration with automatic preview deployments.  
- **Database:** Supabase-hosted PostgreSQL with Prisma migrations.  
- **Environment Management:** Separate dev and production environments.  
- **Monitoring:** Supabase logs + Vercel analytics.

## Final Notes
This updated proposal **addresses all teacher feedback** by:
- Locking in a concrete backend stack and schema.  
- Defining a clear **6-week roadmap**.  
- Specifying a **recipe source (Spoonacular)**.  
- Moving AI to **Phase 2** for feasibility.  
- Adding detail to notifications, testing, and privacy.  

This approach ensures a **focused MVP** that’s achievable within the 6-week window while laying a strong foundation for AI-powered extensions and personalization in later phases.