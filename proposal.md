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

### Nice to Have (Phase 2 and Beyond)
- **User Preferences & Dietary Profiles:** Save dietary restrictions and preferred cuisines.  
- **Recipe Tagging & Advanced Filters:** Filter recipes by nutrition, difficulty, or dietary type.  
- **Creative Mode – Ingredient Substitution:** Simple AI-powered substitutions using GPT for common ingredient swaps.  
- **AI-Enhanced Search:** Use embeddings for smarter, semantic recipe matching (e.g., “healthy chicken” finds similar dishes).  
- **Smart Shopping Suggestions:** Recommend items based on cooking history and consumption patterns.  
- **Nutritional Analysis:** Display nutrition facts and healthier recipe alternatives.  

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
\`\`\`

### Relationships
- A **User** has many **FoodItems**.  
- A **Recipe** uses many **FoodItems**.  
- A **User** can receive many **Notifications**.  
- **User Preferences** influence recipe recommendations.  

## Technical Framework

### Frontend
- **Framework:** Next.js 14 (App Router, Server Components, SSR, and SSG).  
- **Styling:** Tailwind CSS + shadcn/ui components for modern, accessible UI.  
- **Performance:** Built-in image optimization, automatic code-splitting, and fast page loads.

### Backend
- **Architecture:** Next.js API Routes for server logic.  
- **Database:** Supabase (PostgreSQL).  
- **ORM:** Prisma for schema management and migrations.  
- **Authentication:** NextAuth.js (email/password).  
- **Hosting:** Vercel (frontend + API), Supabase cloud (database).  

### Rationale
This stack ensures tight integration, rapid development, scalability, and AI-friendly API extensions while aligning with project constraints and the teacher’s feedback.

## AI Integration
- **Phase 2 (Post-MVP):**
  - **Ingredient Substitution:** GPT-powered simple substitution recommendations (e.g., lime ↔ lemon).  
  - **AI Recipe Suggestions:** Use GPT or OpenAI embeddings for creative recipe variations.  
  - **Semantic Search:** Implement OpenAI’s `text-embedding-3-small` model to improve recipe search relevance.  

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
