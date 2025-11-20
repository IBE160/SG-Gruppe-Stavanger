# Tech Stack Decision

**Dato:** 2025-11-20
**Prosjekt:** Smart Food & Recipe Platform
**Kommando:** `/tea *framework`

## Valgt Stack

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

## Begrunnelse
- Next.js for SSR/SSG og SEO
- Prisma for type-safe database queries
- Vercel for enkel deployment
