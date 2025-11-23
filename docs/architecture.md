# Smart Food & Recipe Platform - Architecture Document

## 1. Executive Summary

This document outlines the architecture for the Smart Food & Recipe Platform, a mobile-responsive web application aimed at reducing food waste and inspiring cooking through intelligent kitchen inventory management and personalized recipe suggestions. The architecture is designed for scalability, performance, and a high-quality user experience, leveraging a modern serverless-first stack.

## 2. High-Level Architecture

The system follows a typical client-server architecture with a clear separation of concerns.

*   **User Interface (Client):** Users interact with a web application served by Vercel. This frontend communicates directly with the Next.js API Routes for application logic and authentication.
*   **Application Layer (Backend):** Built using Next.js API Routes, this layer handles business logic, communicates with the database via Prisma, orchestrates external API calls (Spoonacular), and manages authentication.
*   **Database (Persistence):** Supabase (PostgreSQL) serves as the primary data store, managed through Prisma ORM.
*   **External Services:**
    *   **Spoonacular API:** Provides the recipe database.
    *   **Vercel:** Hosts the Next.js application (frontend and API routes).
    *   **Supabase:** Provides the PostgreSQL database, authentication services, and potentially edge functions for future enhancements.
    *   **NextAuth.js:** Handles secure user authentication.
    *   **AI Services (Phase 2):** GPT API and Pydantic AI will be integrated for advanced features.

**Interaction Flow:**
1.  **User Request:** A user interacts with the Next.js frontend.
2.  **Frontend to API:** The frontend makes requests to Next.js API Routes (e.g., to fetch inventory, get recipes).
3.  **Authentication:** NextAuth.js secures API routes and manages user sessions.
4.  **API to Database:** API Routes interact with the Supabase PostgreSQL database via Prisma for data persistence (e.g., storing food items, shopping lists).
5.  **API to External API:** API Routes call the Spoonacular API to fetch recipe data.
6.  **Response:** Data is processed by API Routes and returned to the frontend for display to the user.

## 3. Technology Stack Overview

### 3.1 Frontend
*   **Framework:** **Next.js 14** (App Router, Server Components, SSR, and SSG)
    *   **Role:** Provides a robust framework for building modern web applications, enabling server-side rendering (SSR), static site generation (SSG), and efficient routing. App Router simplifies data fetching and state management across the application.
*   **Styling:** **Tailwind CSS + shadcn/ui components**
    *   **Role:** Tailwind CSS offers a utility-first approach for highly customizable and responsive styling. shadcn/ui provides unstyled, accessible UI components built on Radix UI primitives, allowing for complete custom theming (Farmhouse Kitchen) while ensuring accessibility and good defaults.

### 3.2 Backend
*   **Architecture:** **Next.js API Routes**
    *   **Role:** Serverless functions co-located with the frontend, handling application logic, data fetching, and external service integrations. This provides a unified development experience and leverages Vercel's serverless infrastructure.

### 3.3 Database & ORM
*   **Database:** **Supabase (PostgreSQL)**
    *   **Role:** A scalable, open-source relational database solution providing PostgreSQL, real-time capabilities, and an easy-to-use API gateway.
*   **ORM:** **Prisma**
    *   **Role:** A modern database toolkit that simplifies database access with type-safe queries, migrations, and an intuitive schema definition language.

### 3.4 Authentication
*   **Library:** **NextAuth.js**
    *   **Role:** A complete open-source authentication solution for Next.js applications, supporting email/password authentication (as required for MVP) and easily extendable for other providers.

### 3.5 Hosting & Deployment
*   **Platform:** **Vercel**
    *   **Role:** Hosts the Next.js frontend and API Routes, providing automatic deployments, CDN, serverless functions, and excellent developer experience.
*   **Platform:** **Supabase Cloud**
    *   **Role:** Hosts the PostgreSQL database and provides backend services like authentication and storage.

### 3.6 External APIs
*   **Recipe Database:** **Spoonacular API**
    *   **Role:** Provides a vast database of recipes, ingredients, and nutritional information, integrated through Next.js API Routes to serve recipe data to the frontend.

### 3.7 AI Integration (Phase 2)
*   **Libraries:** **Pydantic AI** (for structured LLM outputs) and **GPT API** (for creative mode and substitution suggestions).
    *   **Role:** In Phase 2, these tools will power advanced features like AI-driven ingredient substitutions, enhanced semantic search, and personalized recipe suggestions, integrated via Next.js API Routes.

## 4. Data Model

The core data entities are defined using Prisma, ensuring a type-safe and relational structure for the application's data.

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String // Stores hashed passwords for security
  createdAt     DateTime @default(now())
  foodItems     FoodItem[] // A user can have many food items
  preferences   UserPreference? // A user can have one set of preferences
  shoppingList  ShoppingList? // A user can have one shopping list
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

model Recipe { // Placeholder for Spoonacular recipes, actual storage might be partial or cached
  id             String   @id @default(cuid()) // Spoonacular ID or generated
  title          String
  ingredients    Json // Storing as JSON to accommodate varying structures from API
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
  foodItemId      String? // Links notification to a specific food item (e.g., for expiration)
}

model ShoppingList {
  id        String         @id @default(cuid())
  userId    String         @unique
  user      User           @relation(fields: [userId], references: [id])
  items     ShoppingListItem[] // A shopping list can have many items
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

// Future model for user preferences (Phase 2)
// model UserPreference {
//   id          String   @id @default(cuid())
//   userId      String   @unique
//   user        User     @relation(fields: [userId], references: [id])
//   dietaryRestrictions String[] // e.g., Vegan, Gluten-Free
//   allergies   String[]
//   preferredCuisines String[]
// }
```
**Key Relationships:**
*   **One-to-Many:** A `User` can have multiple `FoodItem`s. A `ShoppingList` can contain multiple `ShoppingListItem`s.
*   **One-to-One:** A `User` has one `ShoppingList`.
*   Recipes fetched from Spoonacular will primarily be stored or cached on demand, linking to user actions (e.g., "liked recipes").

## 5. Frontend Architecture

The frontend is built with **Next.js 14**, leveraging its latest features for a highly optimized and developer-friendly experience.

*   **App Router:** Used for organizing application routes, enabling nested layouts, and server components.
*   **Server Components:** Maximize performance by rendering UI on the server, reducing client-side JavaScript, and improving initial page load times.
*   **Server-Side Rendering (SSR) & Static Site Generation (SSG):** Strategically applied to different pages. SSR will be used for dynamic content (e.g., user's pantry, recipe suggestions) to ensure up-to-date data. SSG may be considered for static content like landing pages or documentation.
*   **UI Components:** **Tailwind CSS** is the foundation for styling, providing rapid UI development and consistent theming. **shadcn/ui** components (buttons, dialogs, inputs) built on Radix UI primitives will be customized to align with the "Farmhouse Kitchen" aesthetic and ensure accessibility.
*   **State Management:** For client-side interactivity, React's `useState` and `useContext` will be sufficient for most local and global state needs. For more complex, global state or server data caching, a library like React Query or SWR could be introduced in later stages if necessary, though Next.js Server Components and React's built-in caching often reduce this need.
*   **Responsive Design:** Implemented using Tailwind CSS's utility classes and Next.js's capabilities, ensuring a seamless experience across desktop, tablet, and mobile devices, adapting the "Farmhouse Kitchen" theme appropriately.

## 6. Backend Architecture

The backend logic primarily resides within **Next.js API Routes**, which function as serverless endpoints.

*   **API Routes:** These endpoints will handle:
    *   **CRUD Operations:** For `FoodItem`, `ShoppingList`, `ShoppingListItem` (add, view, edit, delete).
    *   **Spoonacular API Proxy:** Securely call the Spoonacular API, potentially caching responses to stay within rate limits and improve performance.
    *   **Recipe Matching Logic:** Implement algorithms to match user's `FoodItem` inventory with Spoonacular recipes.
    *   **Expiration Alert Generation:** Logic to identify expiring items and generate notifications.
    *   **Authentication & Authorization:** Integrated with NextAuth.js callbacks and middleware to protect routes.
*   **Prisma ORM:** Used within API Routes to interact with the Supabase PostgreSQL database. Prisma provides a type-safe and efficient way to query, insert, update, and delete data, abstracting raw SQL.
*   **Modularity:** API Routes will be structured logically (e.g., `/api/inventory`, `/api/recipes`, `/api/auth`) to maintain a clean and maintainable codebase.

## 7. Authentication & Authorization

**NextAuth.js** will be the backbone of user authentication.

*   **Provider:** Email/password authentication will be implemented as per MVP requirements. This involves secure hashing of passwords (`passwordHash` in `User` model) and session management.
*   **Session Management:** NextAuth.js handles session creation, validation, and renewal, providing secure JWT tokens or database-backed sessions.
*   **Route Protection:** Middleware and `getServerSession` will be used to protect both API Routes and frontend pages, ensuring only authenticated and authorized users can access sensitive data and functionality.
*   **Supabase Integration:** NextAuth.js can be configured to use Supabase's PostgreSQL database for storing user accounts and sessions, leveraging Prisma for interaction.

## 8. Deployment & Hosting Strategy

The deployment strategy is designed for continuous integration and delivery, leveraging serverless platforms for scalability and ease of management.

*   **Vercel:**
    *   Hosts the entire Next.js application, including frontend and Next.js API Routes.
    *   Provides automatic deployments from Git pushes to the main branch, with preview deployments for pull requests.
    *   Leverages global CDN for fast content delivery and serverless functions for API Routes, scaling automatically with demand.
*   **Supabase Cloud:**
    *   Hosts the PostgreSQL database, providing a managed, highly available, and scalable database instance.
    *   Manages user authentication services, which NextAuth.js can integrate with.
    *   Offers additional backend services (e.g., Storage, Edge Functions) for potential future use cases.
*   **Prisma Migrations:** Database schema changes will be managed through Prisma Migrate, ensuring version control and easy application of schema updates to the Supabase database.

## 9. Scalability & Performance Considerations

*   **Next.js Optimization:**
    *   **Server Components, SSR, SSG:** Reduce client-side JavaScript and improve initial load times.
    *   **Image Optimization:** Built-in Next.js image optimization for efficient delivery of visual assets.
    *   **Code Splitting:** Automatic code splitting ensures only necessary code is loaded for each page.
*   **Serverless API Routes:** Next.js API Routes hosted on Vercel scale automatically based on demand, handling traffic spikes efficiently without manual server provisioning.
*   **Supabase PostgreSQL:** A managed database service designed for scalability, capable of handling growing data volumes and user concurrency.
*   **Spoonacular API Caching:** To mitigate rate limits and improve response times, API responses from Spoonacular will be aggressively cached (e.g., using `stale-while-revalidate` strategies or a dedicated caching layer if performance becomes a bottleneck).
*   **Database Query Optimization:** Prisma's efficient query engine and careful indexing of database tables will ensure fast data retrieval.
*   **Global CDN:** Vercel's CDN ensures low latency for users globally by serving static assets and cached content from edge locations.

## 10. AI Integration Strategy (Phase 2)

AI capabilities are planned for Phase 2 to enhance user experience without hindering the MVP timeline.

*   **Ingredient Substitution:**
    *   **Mechanism:** Next.js API Route will call the GPT API with user's available ingredients and a desired recipe. GPT will suggest common, simple substitutions (e.g., "lime ↔ lemon").
    *   **Structured Output:** Pydantic AI will be used to define strict schemas for GPT's output, ensuring reliable parsing and integration into the application.
*   **AI-Enhanced Search & Recipe Suggestions:**
    *   **Semantic Search:** Utilize OpenAI's `text-embedding-3-small` model to generate embeddings for recipe descriptions and user preferences. A nearest-neighbor search on these embeddings can provide more relevant and semantic recipe matches (e.g., "healthy chicken" matching similar dishes, not just keyword-based).
    *   **Creative Mode:** GPT API will power the "Creative Mode" allowing users to provide natural language prompts to generate new recipes based on available ingredients.
*   **Personalized Educational Content:** Simple AI or rule-based systems will analyze user's waste habits (e.g., frequently wasted bread) to personalize "Eco-Facts & Food Stories" with relevant educational content.

## 11. Key Architectural Decisions & Rationale

*   **Next.js 14 (App Router, Server Components):** Chosen for its excellent performance characteristics (SSR, SSG, Server Components reduce client-side JavaScript), developer experience, and unified frontend/backend (API Routes). This aligns with the need for a fast, responsive, and scalable web application.
*   **Supabase (PostgreSQL) + Prisma:** Provides a robust, scalable, and managed database solution with a powerful, type-safe ORM. This simplifies database interactions and migrations, accelerating development.
*   **Tailwind CSS + shadcn/ui:** Enables rapid, highly customizable UI development while ensuring accessibility and a unique "Farmhouse Kitchen" aesthetic without being constrained by opinionated component libraries.
*   **Vercel Hosting:** Seamless integration with Next.js for automatic, scalable, and performant deployments, aligning with the project's goal for high uptime and responsiveness.
*   **AI in Phase 2:** A deliberate decision to de-risk the MVP, allowing focus on core functionality. Integrating AI later ensures a stable foundation and allows for more refined AI features.
*   **Spoonacular API:** Provides a comprehensive recipe database, crucial for diverse recipe suggestions. Caching strategies will manage API limits.

## 12. Open Questions & Future Considerations

*   **Ingredient Name Variations:** How to robustly handle variations in ingredient names and units for accurate inventory matching and recipe suggestions. Further research into natural language processing (NLP) techniques or a dedicated ingredient normalization service may be required.
*   **Offline Support:** While not in MVP, considering service workers for basic offline capabilities (e.g., viewing cached recipes or inventory) could enhance user experience.
*   **Real-time Features:** Supabase's real-time capabilities could be explored for features like collaborative shopping lists or live updates to inventory across devices.
*   **Monitoring & Logging:** Implementing a comprehensive logging and monitoring strategy (e.g., Sentry, Datadog) beyond basic Vercel/Supabase analytics will be crucial for production stability and debugging.
*   **Advanced AI Prompt Engineering:** As AI features evolve, continuous refinement of prompt engineering for GPT models will be necessary to achieve desired output quality and consistency.
*   **Smart Home Integration:** Long-term vision includes integration with smart kitchen appliances for automated inventory. This would require exploring IoT platforms and APIs.
*   **Internationalization (i18n):** Planning for multi-language support for recipe content and UI elements for future international expansion.
