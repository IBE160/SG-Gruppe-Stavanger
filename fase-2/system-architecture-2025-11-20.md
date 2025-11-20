# System Architecture

**Date:** 2025-11-20
**Project:** Smart Food & Recipe Platform
**Command:** `/architect *architecture`

## Architecture Overview

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

## Components

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

## Security
- HTTPS everywhere
- JWT tokens
- Input validation
- CORS policies
