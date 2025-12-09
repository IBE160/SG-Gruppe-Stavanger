# ibe160 - Smart Food & Recipe Platform

A Next.js-based web application for tracking pantry inventory, managing food expiration dates, and discovering recipes to reduce food waste.

## 🎯 Project Overview

ibe160 helps users:
- **Track food inventory** with expiration dates
- **Get expiration alerts** for items about to expire
- **Discover recipes** based on available ingredients
- **Reduce food waste** through smart planning

## ✨ Features Implemented (MVP)

### Epic 1: Project Foundation ✓
- Next.js 16.0.1 with App Router
- TypeScript configuration
- Tailwind CSS 4 styling
- Prisma ORM setup with PostgreSQL schema
- Auth.js v5 configuration

### Epic 2: User Authentication ✓
- Email/password registration with validation
- Secure login with Auth.js v5
- User profile management
- 30-day session duration
- Protected routes with middleware

### Epic 3: Food Inventory Management ✓
- **View pantry items** with responsive grid layout
- **Add items** with full validation (name, category, quantity, unit, expiration)
- **Edit items** with pre-filled forms
- **Delete items** with confirmation dialog
- **Expiration indicators** - visual warnings for items expiring within 3 days
- **Category emojis** (🥛 Dairy, 🥗 Produce, 🍗 Meat, 🌾 Grains, 📦 Other)
- **Loading states** and error handling
- **Toast notifications** for success/error feedback

### Epic 4: Offline-First Infrastructure ✓
- **React Query** for data caching and state management
- **Optimistic updates** for instant UI feedback
- **Automatic refetching** and cache invalidation
- **Background sync** for seamless offline experience

### Epic 5: Recipe Search (Spoonacular API) ✓
- **Spoonacular API integration** for thousands of recipes
- **Text-based search** by recipe name
- **Ingredient-based search** using pantry items
- **Smart recipe matching** with available ingredients
- **Recipe details** with cooking time and servings

### Epic 6: Flexible Recipe Matching ✓
- **Auto-match recipes** based on pantry inventory
- **Toggle between search modes** (text/ingredients)
- **Real-time ingredient tracking**
- **Recipe suggestions** tailored to available food

### Epic 7: Smart Grocery List ✓
- **Add grocery items** with quick input
- **Check off items** while shopping
- **Track shopping progress** with summary stats
- **LocalStorage persistence** for offline access
- **Clear completed items** feature

### Epic 8: Expiration Alerts & Notifications ✓
- **Visual alert dashboard** with categorized warnings
- **Browser notifications** for expiring items
- **Critical/Warning/Safe** categorization
- **Expired item tracking** with action buttons
- **Recipe suggestions** for soon-to-expire items

### Epic 9: Landing Page & Recipe Browser ✓
- Professional landing page with hero section
- Recipe browser with search and filtering
- Sample recipes with categories and cooking times
- Navigation between all pages

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 16.0.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form + Zod validation
- **State Management:** @tanstack/react-query (TanStack Query)
- **Caching:** React Query with offline-first approach

### Backend
- **API:** Next.js API Routes (RESTful)
- **Authentication:** Auth.js v5 (NextAuth beta)
- **Database:** Prisma 6.19.0 + PostgreSQL
- **Validation:** Zod schemas

### Development
- **Build Tool:** Turbopack (Next.js 16)
- **Package Manager:** npm
- **Version Control:** Git

## 📁 Project Structure

```
ibe160-app/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Protected routes
│   │   │   ├── pantry/       # Pantry management
│   │   │   ├── profile/      # User profile
│   │   │   ├── recipes/      # Recipe browser (Spoonacular)
│   │   │   ├── grocery/      # Smart grocery list
│   │   │   └── alerts/       # Expiration alerts
│   │   ├── (unauth)/         # Public routes
│   │   │   ├── login/        # Login page
│   │   │   └── register/     # Registration page
│   │   ├── api/
│   │   │   ├── auth/         # Auth endpoints
│   │   │   └── pantry/       # CRUD endpoints
│   │   ├── globals.css       # Global styles + animations
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── PantryItemCard.tsx
│   │   ├── AddItemDialog.tsx
│   │   ├── EditItemDialog.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Toast.tsx
│   │   └── Providers.tsx     # React Query provider
│   ├── hooks/
│   │   ├── usePantry.ts      # Pantry React Query hooks
│   │   └── useRecipes.ts     # Recipe React Query hooks
│   └── lib/
│       ├── auth.ts           # Auth.js configuration
│       ├── spoonacular.ts    # Spoonacular API client
│       └── validation/       # Zod schemas
│           ├── auth.ts
│           └── pantry.ts
├── prisma/
│   └── schema.prisma         # Database schema
├── docs/                     # BMAD documentation
│   ├── architecture.md       # Technical architecture
│   ├── bmm-epics.md         # Epics and stories
│   └── sprint-status.yaml   # Development tracking
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ibe160-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/database"
   DIRECT_URL="postgresql://user:password@host:5432/database"

   # Auth.js
   AUTH_SECRET="<generate-with-openssl-rand-base64-32>"
   AUTH_URL="http://localhost:3000"

   # Future: Spoonacular API (for recipes)
   SPOONACULAR_API_KEY="your_api_key"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # (Optional) Seed database
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

```prisma
model User {
  id            String          @id @default(cuid())
  email         String          @unique
  passwordHash  String
  name          String?
  foodItems     FoodItem[]
  notifications Notification[]
  preferences   UserPreference?
}

model FoodItem {
  id              String   @id @default(cuid())
  name            String
  category        String   // dairy, produce, meat, grains, other
  bestBeforeDate  DateTime
  quantity        Float
  unit            String   // g, kg, ml, L, pieces, oz, lbs
  userId          String
}

model Recipe {
  id             String   @id @default(cuid())
  spoonacularId  Int?     @unique
  title          String
  ingredients    String   // JSON
  instructions   String
  cookingTime    Int
  servings       Int
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Coverage report
npm run test:coverage
```

## 🏗️ Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables (Production)
Set these in Vercel dashboard:
- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `AUTH_URL` (your production URL)

## 🔐 Security

- **Password hashing** with bcrypt
- **JWT sessions** with 30-day expiration
- **Protected API routes** with session validation
- **Input validation** with Zod schemas
- **SQL injection prevention** via Prisma ORM
- **XSS protection** via React's automatic escaping

## 📝 Development Workflow

This project follows the **BMAD Method** (Business-Mad Development):

1. **Phase 1:** Requirements Analysis → `docs/PRD.md`
2. **Phase 2:** Architecture Design → `docs/architecture.md`
3. **Phase 3:** Epic Planning → `docs/bmm-epics.md`
4. **Phase 4:** Implementation → Tracked in `docs/sprint-status.yaml`

### Completed Epics
- ✅ Epic 1: Project Initialization
- ✅ Epic 2: User Authentication
- ✅ Epic 3: Food Inventory Management
- ✅ Epic 4: Offline-First Infrastructure (React Query)
- ✅ Epic 5: Recipe Search (Spoonacular API)
- ✅ Epic 6: Flexible Recipe Matching
- ✅ Epic 7: Smart Grocery List
- ✅ Epic 8: Expiration Alerts & Notifications
- ✅ Epic 9: Landing Page & Recipe Browser

### All Core Features Complete! 🎉
**100% of planned MVP epics implemented**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built following the BMAD Method
- Inspired by the global food waste challenge (1 billion meals wasted daily)
- Uses Spoonacular API for recipe data (production)

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation in `/docs`
- Review sprint status in `docs/sprint-status.yaml`

---

**Status:** Full Product Complete ✓ (All 9 Epics)
**Version:** 2.0.0
**Last Updated:** November 2025
