# Tech Stack Decision

**Date:** 2025-11-20
**Project:** Smart Food & Recipe Platform
**Command:** `/tea *framework`

## Selected Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State:** React Context / Zustand

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** PostgreSQL (Prisma ORM)
- **Auth:** NextAuth.js v5

### Infrastructure
- **Hosting:** Vercel
- **Database:** Vercel Postgres / Supabase
- **CDN:** Vercel Edge Network

## Rationale
- Next.js for SSR/SSG and SEO
- Prisma for type-safe database queries
- Vercel for easy deployment
