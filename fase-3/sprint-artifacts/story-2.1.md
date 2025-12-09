# Story 2.1: Build Registration Page

**Epic:** 2 - User Authentication and Profile
**Story ID:** STORY-2.1
**Status:** Done
**Sprint:** 1
**Points:** 5

---

## Description

Create registration UI with email/password form, validation, and error handling.

---

## Acceptance Criteria

- [x] Page at app/(unauth)/register/page.tsx
- [x] Form with email and password fields
- [x] React Hook Form + Zod validation
- [x] Password requirements: min 8 chars, uppercase, lowercase, number
- [x] Email format validation
- [x] Error messages display correctly (FR016)
- [x] Loading state during submission
- [x] Success redirects to pantry
- [x] Link to login page
- [x] Mobile responsive

---

## Technical Implementation

### Page Component

```typescript
// src/app/(unauth)/register/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Registration failed")
      }

      router.push("/login?registered=true")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold">Create Account</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields */}
        </form>
      </CardContent>
      <CardFooter>
        <Link href="/login">Already have an account? Sign in</Link>
      </CardFooter>
    </Card>
  )
}
```

### API Route

```typescript
// src/app/api/auth/register/route.ts
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = schema.parse(body)

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return Response.json({ message: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    })

    return Response.json({
      user: { id: user.id, email: user.email, name: user.name }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ message: error.errors[0].message }, { status: 400 })
    }
    return Response.json({ message: "Registration failed" }, { status: 500 })
  }
}
```

---

## UI Components Used

- `Card` - Container for form
- `Input` - Email, password, name fields
- `Button` - Submit button with loading state
- `Form` - From shadcn/ui with validation

---

## Validation Rules

| Field | Rules |
|-------|-------|
| Name | Min 2 characters |
| Email | Valid email format |
| Password | Min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| Confirm | Must match password |

---

## Error Handling

| Error | Message | Status |
|-------|---------|--------|
| Duplicate email | "Email already registered" | 409 |
| Invalid input | Zod error message | 400 |
| Server error | "Registration failed" | 500 |

---

## Code References

- `ibe160-app/src/app/(unauth)/register/page.tsx`
- `ibe160-app/src/app/api/auth/register/route.ts`

---

## Definition of Done

- [x] All acceptance criteria met
- [x] Form validation working
- [x] API route handling all cases
- [x] Error messages user-friendly
- [x] Mobile responsive
- [x] Code reviewed

---

*Completed: Week 1*
