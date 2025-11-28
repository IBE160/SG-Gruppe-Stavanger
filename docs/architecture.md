# Architecture

## Executive Summary

Based on the provided PRD and UX Specification, the `ibe160` project aims to develop a mobile-responsive web application for intelligent kitchen inventory management, expiration alerts, and personalized recipe suggestions. This architectural document outlines the key decisions for building a scalable, performant, and secure application leveraging Next.js, Supabase, and AI integrations, adhering to modern web development best practices.

## Project Initialization

First implementation story should execute:
```bash
npx create-next-app@latest ibe160-app --typescript --tailwind --eslint --app
```
This establishes the base architecture with these decisions: Next.js framework, TypeScript, Tailwind CSS, ESLint, App Router, and default Next.js build tooling.

## Decision Summary

| Category | Decision | Version | Affects FR Categories | Rationale |
|---|---|---|---|---|
| Data Persistence | Supabase PostgreSQL | PostgreSQL 17.6.1.003 (managed by Supabase) | Inventory Management, User & Profile Management, Recipe Discovery & Interaction | Robust, open-source database with built-in features for authentication and real-time data, good integration with Next.js, simplifies tech stack. |
| Authentication | NextAuth.js with Supabase Auth | NextAuth.js 4.24.13 | User & Profile Management | Secure, flexible, and easy-to-implement authentication solution for Next.js, leveraging Supabase for backend user management. |
| API Pattern | RESTful API using Next.js API Routes (Route Handlers) | Next.js 16 (using App Router features) | Inventory Management, Recipe Discovery & Interaction, Notifications | Standard, flexible, and widely supported approach. Simplifies the tech stack by integrating API directly into the Next.js project. Seamless integration with external RESTful APIs like Spoonacular. |
| AI Application Integration | Spoonacular API for core recipe data; Google Gemini for generative AI features | Latest stable versions of both APIs | Recipe Discovery & Interaction, Notifications | Leverages specialized API for recipe data and powerful LLM for creative recipe generation and ingredient substitutions, providing a robust and flexible solution. |
| Deployment Target | Vercel for frontend and API routes; Supabase for backend services | Latest stable versions of both platforms | All | Vercel offers a seamless, optimized deployment experience for Next.js. Supabase provides a fully-managed backend, simplifying infrastructure management. This combination allows for a focus on feature development. |
| Real-time Features | Supabase Realtime | Latest stable version | Notifications, Inventory Management | Integrates seamlessly with Supabase PostgreSQL and authentication. Simplifies building real-time features for expiration alerts and live inventory updates without managing complex WebSocket servers. |
| Search | PostgreSQL Full-Text Search (FTS) | Latest PostgreSQL version supported by Supabase (currently 17) | Recipe Discovery & Interaction, Inventory Management | Built directly into the existing database (Supabase PostgreSQL), avoiding extra services. Efficient for relevant recipe and inventory searches. Offers a natural upgrade path to `pgvector` for AI-enhanced semantic search in the future. |
| Background Jobs | PG Cron in Supabase | Latest version of `pg_cron` extension supported by Supabase | Notifications, Inventory Management | Simple, reliable, and cost-effective for handling database-related background tasks like checking expiration dates. Avoids the complexity of a separate service. |
| Email/Notifications | Resend for transactional emails; Supabase's built-in email for authentication flows | Latest stable versions of Resend and Supabase email services | Notifications, User & Profile Management | Resend provides excellent deliverability and a developer-friendly API for critical alerts. Supabase's built-in email simplifies authentication-related communications, ensuring tight integration and streamlined setup. |
| Performance Optimization | Vercel Edge Caching & Next.js caching; Supabase PostgreSQL indexing; Supabase image optimization (future) | Latest stable versions of Vercel, Next.js, and Supabase PostgreSQL | All (especially Recipe Discovery & Interaction) | Maximizes performance by leveraging built-in optimizations of the chosen tech stack, ensuring fast page loads, rapid recipe search, and a responsive user experience. |
| Security | NextAuth.js + Supabase Auth for authentication; Supabase RLS for data access control; Next.js API Routes (Route Handlers) security best practices | Latest stable versions of all components | All | Leverages the secure foundations of chosen technologies to protect user data, prevent unauthorized access, and ensure resilience against threats. Combines strong authentication, fine-grained data access control, and robust API security. |
| Error Handling Strategy | try/catch in API routes/server; global error boundary in React frontend; friendly user messages; detailed server logging | N/A (Software Engineering Best Practice) | All | Provides robust and user-friendly error handling, maintaining a professional user experience while enabling effective debugging. |
| Logging Approach | Structured logging for server-side (Next.js API Routes, backend functions) using `Pino` or `Winston`; client-side console logging for development, Sentry for production | N/A (Software Engineering Best Practice) | All | Provides valuable insights into application behavior, aids in debugging, and enables effective monitoring, ensuring quick identification and resolution of issues. |
| Date/Time Handling | Store all dates and times in UTC in the database. Use JavaScript's `Date` object or a library like `date-fns` or `dayjs` for formatting and displaying dates/times to users in their local time zone on the frontend. | N/A (Software Engineering Best Practice) | Inventory Management, Notifications | Ensures data consistency across different time zones, prevents bugs related to date/time conversions, and provides a familiar user experience. |
| API Response Format | Consistent JSON structure with `data` for success, `error` for errors; standard HTTP status codes; `data` array for collections, `data` object for single items; consistent naming conventions (e.g., `camelCase`) | N/A (Software Engineering Best Practice) | All | Simplifies frontend development, improves maintainability, and provides clear error feedback, enhancing overall developer and user experience. |
| Testing Strategy | Multi-layered strategy including Unit Tests (`Jest`, `React Testing Library`), Integration Tests (API routes, database interactions), and End-to-End (E2E) Tests (`Playwright`, `Cypress`), focusing on user-centric scenarios | N/A (Software Engineering Best Practice) | All | Ensures the reliability and stability of the application, catches bugs early, prevents regressions, and provides confidence in the application's functionality. |
| Naming Patterns | `kebab-case` for files/folders; `PascalCase` for React components; `camelCase` for variables/functions; `snake_case` for database tables/columns; consistent, descriptive API endpoints | N/A (Software Engineering Best Practice) | All | Ensures consistency, improves readability, maintainability, and reduces potential conflicts and bugs across the codebase. |
| Structure Patterns | Adhere to the project structure defined in Step 6; co-locate `route.ts`, `page.tsx`, and `layout.tsx` within feature-specific `app` sub-folders; UI components in `components/ui`, `components/common`, and `components/specific`; `lib/` for utilities, types, and API client logic; top-level `tests/` directory mirroring `app/`. | N/A (Software Engineering Best Practice) | All | Promotes intuitive navigation, modularity, reusability, and maintainability of the codebase, reducing cognitive load and improving development efficiency. |
| Format Patterns | JSON for all API communications; UTC ISO 8601 strings for date/time; `camelCase` for JSON keys in API responses; explicit API request/response schemas (e.g., Zod for validation). | N/A (Software Engineering Best Practice) | All | Ensures smooth and error-free data exchange, simplifies frontend data handling, improves maintainability, and fosters better collaboration between frontend and backend. |
| Communication Patterns | `React Query` (or `SWR`) for client-side data fetching from own backend; `Supabase Realtime` client SDK for real-time updates; standard `fetch` API within server components/API routes for external APIs; React's `useState` and `useContext` for UI state management. | N/A (Software Engineering Best Practice) | All | Provides clear, efficient, and consistent methods for data interaction across the application, managing server state, real-time updates, and external integrations effectively. |
| Lifecycle Patterns | React Hooks (`useEffect`, `useState`, etc.) for component lifecycle and state; Next.js Server Components and Server Actions for data loading/mutations; consistent `loading` and `error` states for data-fetching UI components. | N/A (Software Engineering Best Practice) | All | Leverages modern React/Next.js best practices for predictable component behavior, optimized data handling, and consistent user feedback during data operations. |
| Location Patterns | Strict adherence to Project Structure from Step 6; Next.js App Router files (`page.tsx`, `layout.tsx`, `route.ts`) in feature folders under `app/`; UI components in `components/ui`, `components/common`, `components/specific`; shared utilities, types, client-side Supabase logic in `lib/`; static assets in `public/`. | N/A (Software Engineering Best Practice) | All | Reinforces codebase organization, promotes predictability for navigation and understanding, and ensures logical separation of concerns. |
| Consistency Patterns | Consistent UI/UX using shadcn/ui and Tailwind CSS per UX Design Specification; WCAG 2.1 AA accessibility standards; established code style (Prettier, ESLint); TypeScript best practices; consistent tone and voice for user-facing texts. | N/A (Software Engineering Best Practice) | All | Ensures a professional, polished, and user-friendly application, improves code quality, reduces bugs, and enhances maintainability. |

## Project Structure

```
ibe160-app/
├── app/                  # App Router root
│   ├── (auth)/           # Authentication routes (login, register, forgot-password)
│   │   ├── login/
│   │   ├── register/
│   │   └── ...
│   ├── (main)/           # Main application routes (dashboard, inventory, recipes, profile)
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── recipes/
│   │   ├── profile/
│   │   └── ...
│   ├── api/              # API routes (route handlers)
│   │   ├── auth/         # API routes for authentication (handled by NextAuth.js)
│   │   ├── inventory/    # API routes for inventory management
│   │   ├── recipes/      # API routes for recipe fetching and suggestions
│   │   └── ...
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Root page (e.g., landing page)
├── components/           # Reusable UI components (shadcn/ui, custom components)
│   ├── ui/               # shadcn/ui components
│   ├── common/           # Generic reusable components
│   └── specific/         # Components specific to features (e.g., InventoryCard, RecipeItem)
├── lib/                  # Utility functions, helpers, constants
│   ├── auth.ts           # NextAuth.js configuration
│   ├── db.ts             # Supabase client initialization
│   ├── utils.ts          # General utility functions
│   ├── api.ts            # API client for external services (Spoonacular)
│   └── types.ts          # Global TypeScript types and interfaces
├── styles/               # Tailwind CSS configuration and global styles
├── public/               # Static assets (images, fonts)
├── prisma/               # Prisma schema and migrations (if using Prisma with Supabase)
├── tests/                # Test files (unit, integration, e2e)
├── .env                  # Environment variables
├── next.config.mjs
├── package.json
├── tsconfig.json
└── ...
```

## FR Category to Architecture Mapping

*   **User & Profile Management:** Frontend routes in `app/(auth)/`, NextAuth.js API routes in `app/api/auth/`, Supabase Auth, and PostgreSQL tables for user data.
*   **Inventory Management:** Frontend routes in `app/(main)/inventory/`, API routes in `app/api/inventory/` for CRUD, Supabase PostgreSQL tables for data, Supabase Realtime for live updates, and PG Cron for expiration checks.
*   **Recipe Discovery & Interaction:** Frontend routes in `app/(main)/recipes/`, API routes in `app/api/recipes/` for Spoonacular and Gemini integrations, Spoonacular API, Google Gemini API, and Supabase PostgreSQL for Full-Text Search.
*   **Notifications:** Frontend components for in-app alerts, PG Cron for triggering alerts, Supabase Realtime for pushing alerts, Resend for email notifications, and Supabase's built-in email for authentication-related emails.

## Technology Stack Details

### Core Technologies

*   **Frontend Framework:** Next.js 16 (App Router, Server Components, Server Actions)
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Database:** Supabase PostgreSQL (v17)
*   **Authentication:** NextAuth.js (v4.24.13), Supabase Auth
*   **Real-time:** Supabase Realtime
*   **Background Jobs:** PG Cron
*   **Email:** Resend (transactional), Supabase (authentication)
*   **Recipe Data API:** Spoonacular API
*   **Generative AI:** Google Gemini API
*   **Deployment:** Vercel (frontend, API routes), Supabase (backend services)

### Integration Points

*   **Frontend (Next.js) <-> Backend (Next.js API Routes/Route Handlers):** RESTful API calls.
*   **Next.js API Routes <-> Supabase PostgreSQL:** Direct database queries via client libraries (e.g., Supabase JS client or Prisma).
*   **Next.js API Routes <-> Spoonacular API & Google Gemini API:** HTTP requests to external APIs.
*   **Next.js Frontend <-> Supabase Realtime:** WebSocket connection for real-time updates.
*   **Supabase PostgreSQL (PG Cron) <-> Supabase Realtime/Resend:** Database triggers or functions to send notifications/emails.
*   **NextAuth.js <-> Supabase Auth:** Handles user authentication and session management.

## Novel Pattern Designs

No novel architectural patterns were detected; the project leverages established patterns and technologies for its unique user experience.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Conventions

*   **Convention:** `kebab-case` for file and folder names; `PascalCase` for React components; `camelCase` for variables and function names; `snake_case` for database table and column names (Supabase PostgreSQL standard); consistent, descriptive naming for API endpoints (e.g., `/api/inventory` for collections, `/api/inventory/[id]` for specific items).
*   **Example:** `user-profile.tsx`, `UserProfile`, `myVariable`, `user_accounts`, `/api/inventory`
*   **Enforcement:** All agents MUST follow this pattern
*   **Rationale:** Ensures consistency, improves readability, maintainability, and reduces potential conflicts and bugs across the codebase.

### Structure Patterns

*   **Convention:** Adhere to the project structure defined in the Project Structure section above; co-locate `route.ts`, `page.tsx`, and `layout.tsx` within feature-specific `app` sub-folders; UI components in `components/ui` (for shadcn), `components/common`, and `components/specific`; `lib/` for utilities, types, and API client logic; top-level `tests/` directory mirroring `app/`.
*   **Enforcement:** All agents MUST follow this pattern
*   **Rationale:** Promotes intuitive navigation, modularity, reusability, and maintainability of the codebase, reducing cognitive load and improving development efficiency.

### Format Patterns

*   **Convention:** JSON for all API communications; UTC ISO 8601 strings for date/time; `camelCase` for JSON keys in API responses; explicit API request and response schemas (e.g., Zod for validation) to ensure data integrity.
*   **Example:** `{"data": {"itemName": "Apple", "expirationDate": "2025-12-01T10:00:00Z"}}`
*   **Enforcement:** All agents MUST follow this pattern
*   **Rationale:** Ensures smooth and error-free data exchange, simplifies frontend data handling, improves maintainability, and fosters better collaboration between frontend and backend by establishing clear data contracts.

### Communication Patterns

*   **Convention:** `React Query` (or `SWR`) for client-side data fetching from own backend; `Supabase Realtime` client SDK for real-time updates; standard `fetch` API within server components or API routes for external APIs (Spoonacular, Gemini); React's `useState` and `useContext` for UI state management.
*   **Example:** Using `useQuery` from `React Query` to fetch inventory data; `supabase.subscribe()` for real-time alerts.
*   **Enforcement:** All agents MUST follow this pattern
*   **Rationale:** Provides clear, efficient, and consistent methods for data interaction across the application, managing server state, real-time updates, and external integrations effectively.

### Lifecycle Patterns

*   **Convention:** React Hooks (`useEffect`, `useState`, `useContext`, `useCallback`, `useMemo`) to manage component lifecycle and state; Next.js Server Components and Server Actions for data loading and mutations; consistent `loading` states and `error` states across UI components that fetch data.
*   **Example:** Using `useEffect` to fetch data on component mount; `async` Server Actions for form submissions.
*   **Enforcement:** All agents MUST follow this pattern
*   **Rationale:** Leverages modern React/Next.js best practices for predictable component behavior, optimized data handling, and consistent user feedback during data operations.

### Location Patterns

*   **Convention:** Strict adherence to the Project Structure defined above; Next.js App Router files (`page.tsx`, `layout.tsx`, `route.ts`) in their respective feature folders under `app/`; UI components categorized under `components/ui` (for shadcn), `components/common`, or `components/specific`; shared utilities, types, and client-side Supabase logic in `lib/`; static assets in `public/`.
*   **Example:** `app/inventory/page.tsx`, `components/specific/InventoryCard.tsx`, `lib/supabaseClient.ts`, `public/logo.png`.
*   **Enforcement:** All agents MUST follow this pattern
*   **Rationale:** Reinforces codebase organization, promotes predictability for navigation and understanding, and ensures logical separation of concerns, leading to a more maintainable and scalable project.

### Consistency Patterns

*   **Convention:** Consistent UI/UX experience across the application using the chosen design system (shadcn/ui, Tailwind CSS) and following the UX Design Specification; adherence to WCAG 2.1 AA accessibility standards; established code style (e.g., using Prettier and ESLint); TypeScript best practices for type safety; consistent tone and voice for user-facing texts and messages.
*   **Example:** All buttons follow shadcn/ui styling; consistent error message wording; all code linted with ESLint.
*   **Enforcement:** All agents MUST follow this pattern
*   **Rationale:** Ensures a professional, polished, and user-friendly application, improves code quality, reduces bugs, and enhances maintainability, making the app feel cohesive and well-built.

## Consistency Rules

(These rules are derived from the Implementation Patterns described above, focusing on conflict prevention.)

*   **Naming Consistency:** All developers and AI agents must adhere to the defined `kebab-case`, `PascalCase`, `camelCase`, and `snake_case` conventions for files, components, variables, database entities, and API endpoints to prevent naming collisions and improve readability.
*   **Structural Adherence:** All new features and components must be placed according to the defined project structure, ensuring logical organization and easy discoverability of code.
*   **Data Format Uniformity:** All API communications must use JSON, with `camelCase` keys and UTC ISO 8601 date/time strings, validated by schemas, to guarantee seamless data exchange and reduce integration errors.
*   **Communication Protocol:** Client-side data fetching will primarily use `React Query` or `SWR`, real-time updates via `Supabase Realtime`, and external API calls via standard `fetch` API, ensuring predictable and efficient data flow.
*   **Lifecycle Management:** React Hooks for component state/lifecycle, Server Components/Actions for data operations, and consistent `loading`/`error` states are mandatory for predictable behavior and user feedback.
*   **Location Discipline:** All code and assets must reside in their designated directories within the `app/`, `components/`, `lib/`, and `public/` folders as defined in the project structure.
*   **Global Style and Quality:** Strict adherence to the UX Design Specification for UI/UX, WCAG 2.1 AA for accessibility, and automated code formatting/linting (Prettier/ESLint) for code quality, along with consistent tone in user-facing messages.
*   **Error Handling and Logging:** All errors must be handled gracefully with user-friendly messages and detailed server-side logging. Structured logging is required for server operations.
*   **Date/Time Standardization:** All internal date/time storage must be in UTC, with frontend localization for display.
*   **Security by Design:** NextAuth.js and Supabase Auth for all authentication, RLS enabled on all sensitive database tables, and all API endpoints follow security best practices.
*   **Performance Awareness:** Development should always consider caching strategies, database indexing, and efficient data fetching to meet performance targets.
*   **Test-Driven Development Mindset:** Implementing Unit, Integration, and E2E tests for all features is required to ensure reliability and prevent regressions.

## Data Architecture

*   **Database:** Supabase PostgreSQL
*   **Access Control:** Row Level Security (RLS) enabled on all sensitive tables, managed via Supabase policies.
*   **Search:** PostgreSQL Full-Text Search (FTS) for efficient text-based queries on recipes and inventory.
*   **Scheduled Tasks:** PG Cron for background jobs, such as checking for expiring items.
*   **Date/Time Storage:** All dates and times will be stored in UTC (Coordinated Universal Time) in PostgreSQL.
*   **ORM/Client:** Utilize the Supabase JS client library for direct interaction and potentially Prisma for a more robust ORM layer if needed (decision to be refined during implementation).

## API Contracts

*   **API Style:** RESTful API.
*   **Implementation:** Next.js API Routes (Route Handlers) for internal APIs.
*   **External Integration:** Direct `fetch` calls from Server Components/API Routes to Spoonacular API and Google Gemini API.
*   **Response Format:** Consistent JSON structure with a top-level `data` key for successful responses and an `error` key for errors. Use standard HTTP status codes. `camelCase` for JSON keys.
*   **Schema Definition:** API request and response payloads will have explicitly defined schemas (e.g., using Zod) for validation and type safety.

## Security Architecture

*   **Authentication:** NextAuth.js integrated with Supabase Auth for secure user registration, login, and session management.
*   **Authorization:** Row Level Security (RLS) policies in Supabase PostgreSQL to ensure users only access and modify their own data.
*   **API Security:** Adherence to best practices for Next.js API Routes, including input validation, protection against CSRF, rate limiting, secure environment variable usage, and generic error messages.
*   **Data Protection:** All data communication over HTTPS. Supabase handles database encryption at rest.
*   **Deployment Security:** Vercel's secure deployment practices and automatic SSL certificates for all hosted applications.

## Performance Considerations

*   **Caching:** Leverage Vercel's Edge Network for CDN caching of static assets. Utilize Next.js's built-in caching mechanisms (Data Cache, `fetch` caching, ISR) for dynamic content.
*   **Database Optimization:** Strategic indexing of frequently queried columns in Supabase PostgreSQL. Optimization of SQL queries.
*   **Image Optimization:** Built-in image optimization via `next/image` component (Vercel) for efficient delivery. Potential future use of Supabase Storage's image transformation features.
*   **Code Optimization:** Next.js Server Components and Server Actions to minimize client-side JavaScript and offload computation to the server. Automatic code splitting and lazy loading.
*   **Real-time Efficiency:** Supabase Realtime for targeted, efficient delivery of real-time updates, avoiding unnecessary polling.

## Deployment Architecture

*   **Frontend & API Routes:** Vercel, providing global CDN, serverless functions (for API Routes), automatic scaling, and continuous deployment from Git.
*   **Backend Services:** Supabase, offering managed PostgreSQL database, authentication, real-time, and storage services.
*   **Domain:** Custom domain configured in Vercel, with DNS pointing to Vercel and Supabase services.

## Development Environment

### Prerequisites

*   Node.js (LTS version)
*   npm, yarn, pnpm, or bun (package manager)
*   Git (version control)
*   Supabase CLI (for local Supabase development and migrations)
*   VS Code (recommended IDE)

### Setup Commands

```bash
# Clone the repository
git clone [repository-url] ibe160-app
cd ibe160-app

# Install dependencies
npm install # or yarn install, pnpm install, bun install

# Initialize Next.js project (if starting from scratch)
# npx create-next-app@latest . --typescript --tailwind --eslint --app

# Set up Supabase locally (if needed, using Supabase CLI)
# supabase init
# supabase start

# Link to your Supabase project (if already created)
# supabase link --project-ref [your-project-ref]

# Generate types for Supabase (if needed)
# supabase gen types typescript --project-id [your-project-ref] --schema public > lib/database.types.ts

# Run the development server
npm run dev # or yarn dev, pnpm dev, bun dev
```

## Architecture Decision Records (ADRs)

Key architectural decisions and their rationales are embedded throughout this document, guiding the implementation and ensuring clarity for future development. These include:

*   **Data Persistence:** Supabase PostgreSQL, chosen for its robustness, built-in features, and seamless integration with Next.js.
*   **Authentication:** NextAuth.js with Supabase Auth, providing a secure, flexible, and integrated authentication solution.
*   **API Pattern:** RESTful API using Next.js API Routes (Route Handlers), simplifying the stack and aligning with external API integrations.
*   **AI Integration:** Spoonacular API for core recipe data and Google Gemini for generative AI features, combining specialized data with creative intelligence.
*   **Deployment:** Vercel and Supabase, forming a performant, scalable, and developer-friendly hosting environment.
*   **Real-time:** Supabase Realtime, enabling dynamic updates for critical features like expiration alerts.
*   **Search:** PostgreSQL Full-Text Search, leveraging existing database capabilities with a future-proof path for vector search.
*   **Background Jobs:** PG Cron in Supabase, for efficient and integrated database-centric scheduled tasks.
*   **Email/Notifications:** Resend for transactional emails and Supabase's built-in email for authentication flows, providing specialized and integrated communication.
*   **Performance:** Strategic caching, database indexing, and Next.js/Vercel optimizations to meet high performance targets.
*   **Security:** Comprehensive approach using NextAuth.js, Supabase RLS, and API security best practices.
*   **Cross-Cutting Concerns:** Defined strategies for Error Handling, Logging, Date/Time Handling, API Response Format, and Testing to ensure consistent quality and maintainability.
*   **Implementation Patterns:** Established conventions for Naming, Structure, Format, Communication, Lifecycle, Location, and overall Consistency to prevent agent conflicts and promote a cohesive codebase.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-11-28_
_For: BIP_
