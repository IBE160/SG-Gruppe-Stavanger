# System Architecture

**Dato:** 2025-11-20
**Prosjekt:** Smart Food & Recipe Platform
**Kommando:** `/architect *architecture`

## Arkitekturoversikt

```
┌─────────────────┐     ┌─────────────────┐
│   Client        │────▶│   Next.js       │
│   (Browser)     │     │   (Vercel)      │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   PostgreSQL    │
                        │   (Prisma)      │
                        └─────────────────┘
```

## Komponenter

### Frontend
- Next.js App Router
- React Server Components
- Client-side hydration

### Backend
- API Routes (REST)
- Prisma ORM
- NextAuth.js sessions

### Database
- PostgreSQL
- Prisma migrations
- Connection pooling

## Sikkerhet
- HTTPS everywhere
- JWT tokens
- Input validation
- CORS policies
