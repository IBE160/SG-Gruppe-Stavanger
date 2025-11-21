# Technical Specification: Epic 001 - Project Setup

**Epic ID:** EPIC-001
**Title:** Project Setup & Infrastructure
**Version:** 1.0
**Date:** November 2025

---

## Overview

Initial project scaffolding with Next.js 14, Prisma ORM, database configuration, and development environment setup.

---

## Technical Requirements

### Core Setup

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 14.x |
| Language | TypeScript | 5.x |
| Package Manager | npm/pnpm | Latest |
| Runtime | Node.js | 18+ |

### Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@prisma/client": "^5.0.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prisma": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0"
  }
}
```

---

## Implementation Tasks

### Task 1: Initialize Next.js Project

```bash
npx create-next-app@14 smart-food-platform --typescript --tailwind --app --src-dir
```

**Files Created:**
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `tailwind.config.ts`
- `tsconfig.json`

### Task 2: Configure Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

**Configuration:**
- Database: PostgreSQL (Supabase)
- Provider in `prisma/schema.prisma`
- Environment variables in `.env`

### Task 3: Setup Database Schema

See `fase-2/architecture.md` for complete schema.

### Task 4: Configure ESLint & Prettier

**Files:**
- `.eslintrc.json`
- `.prettierrc`
- `tsconfig.json` with strict mode

### Task 5: Setup Environment Variables

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## Acceptance Criteria

- [ ] Next.js app runs with `npm run dev`
- [ ] Prisma connects to database
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with 0 errors
- [ ] Basic landing page renders

---

## Code References

- `ibe160-app/package.json`
- `ibe160-app/prisma/schema.prisma`
- `ibe160-app/tsconfig.json`
- `ibe160-app/tailwind.config.ts`

---

*This tech spec provides implementation guidance for Epic 001.*
