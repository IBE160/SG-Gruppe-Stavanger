import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Assuming this path is correct
import { rateLimiter } from '@/lib/rate-limiter'; // Import the rate limiter

import logger from '@/lib/logger';

// Email validation regex (basic)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password complexity regex: at least 8 characters, one uppercase, one lowercase, one number, one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function POST(req: NextRequest) {
  // TODO: Implement a distributed rate limiting solution suitable for serverless environments (e.g., using Redis, Upstash, or a dedicated rate limiting service)
  // The current in-memory rate limiter is not effective across multiple serverless instances.

  // Extract IP address from request headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : req.headers.get('x-real-ip') || '127.0.0.1';

  const rateLimitResult = rateLimiter.check(ip);
  if (rateLimitResult.limited) {
    return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    let email, password;

    try {
      const body = await req.json();
      email = body.email;
      password = body.password;
    } catch (jsonError) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Server-side email format validation
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Server-side password complexity validation
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } }, { status: 201 });

  } catch (error) {
    logger.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
