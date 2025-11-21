# Technical Specification: Epic 002 - User Authentication

**Epic ID:** EPIC-002
**Title:** User Authentication System
**Version:** 1.0
**Date:** November 2025

---

## Overview

Complete authentication system with Auth.js v5, including registration, login, session management, and protected routes.

---

## Technical Requirements

### Dependencies

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta",
    "@auth/prisma-adapter": "^1.0.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.0"
  }
}
```

---

## Implementation Tasks

### Task 1: Auth.js Configuration

**File:** `src/auth.ts`

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        return valid ? user : null
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login"
  }
})
```

### Task 2: API Routes

**File:** `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

**File:** `src/app/api/auth/register/route.ts`
```typescript
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
})

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, name } = registerSchema.parse(body)

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return Response.json({ error: "Email exists" }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, passwordHash, name }
  })

  return Response.json({ user: { id: user.id, email, name } }, { status: 201 })
}
```

### Task 3: Login Page

**File:** `src/app/(unauth)/login/page.tsx`

- Form with email/password
- react-hook-form + zod validation
- signIn() from next-auth
- Error handling
- Link to register

### Task 4: Register Page

**File:** `src/app/(unauth)/register/page.tsx`

- Form with name/email/password
- Password strength indicator
- API call to /api/auth/register
- Redirect to login on success

### Task 5: Protected Route Middleware

**File:** `src/middleware.ts`

```typescript
export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"]
}
```

---

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  avatar        String?
  points        Int       @default(0)
  level         Int       @default(1)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  foodItems     FoodItem[]
  notifications Notification[]
}
```

---

## Acceptance Criteria

- [ ] User can register with email/password
- [ ] Duplicate email rejected with 409
- [ ] User can login with valid credentials
- [ ] Invalid credentials return 401
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login
- [ ] Logout clears session

---

## Security Considerations

1. Password hashed with bcrypt (cost factor 10)
2. JWT session with secure cookies
3. CSRF protection via Auth.js
4. Rate limiting on auth endpoints (future)

---

## Code References

- `ibe160-app/src/auth.ts`
- `ibe160-app/src/app/api/auth/`
- `ibe160-app/src/app/(unauth)/login/page.tsx`
- `ibe160-app/src/app/(unauth)/register/page.tsx`
- `ibe160-app/src/middleware.ts`

---

*This tech spec provides implementation guidance for Epic 002.*
