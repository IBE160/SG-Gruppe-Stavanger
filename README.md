# Smart Food & Recipe Platform

**IBE160 Programmering med KI - SG-Gruppe-Stavanger**

An intelligent meal planning platform that helps users reduce food waste and discover meal inspiration.

## Project Structure

```
├── docs/                    # Core project documents
│   ├── PRD.md              # Product Requirements Document
│   ├── proposal.md         # Full project proposal
│   └── bmm-workflow-status.yaml
│
├── fase-0/                  # Phase 0: Discovery
│   ├── brainstorming-*     # Ideation and pre-mortem
│   ├── product-brief-*     # Product vision
│   └── research-*          # Market and technical research
│
├── fase-1/                  # Phase 1: Planning & Design
│   ├── ux-design-*         # Design system and specs
│   ├── *.html              # UI mockups (7 pages)
│   └── ci-pipeline-*       # CI/CD configuration
│
├── fase-2/                  # Phase 2: Architecture
│   ├── architecture.md     # System design and Prisma schema
│   └── solutioning-*       # Gate check validation
│
├── fase-3/                  # Phase 3: Implementation
│   ├── bmm-epics.md        # All epics and stories
│   └── sprint-status.yaml  # Sprint tracking
│
└── ibe160-app/              # Application Source Code
    ├── src/                 # Next.js source
    ├── prisma/              # Database schema
    └── public/              # Static assets
```

## Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** Supabase (PostgreSQL)
- **Auth:** Auth.js v5

## Features

- User authentication
- Food inventory management with barcode scanning
- Recipe discovery (Spoonacular API)
- Flexible recipe matching
- Smart grocery list generation
- Expiration alerts
- AI-powered features (substitutions, search, nutrition)

## Getting Started

```bash
cd ibe160-app
npm install
npx prisma generate
npm run dev
```

## Documentation

See each `fase-*/README.md` for detailed documentation and code references.
