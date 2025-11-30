import { Page } from '@playwright/test';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'Awy7RqbaSVL2/TVpagQDYde2bKK0uW/ddkKCaZDeWuA=-generate-with-openssl-rand-base64-32';

export async function setupAuthenticatedUser(page: Page, email: string, password: string) {
  // Clean up any existing user
  await prisma.user.deleteMany({ where: { email } });

  // Create test user
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  // Create JWT token manually
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.email,
    },
    NEXTAUTH_SECRET,
    { expiresIn: '1d' }
  );

  // Set the session cookie
  await page.context().addCookies([
    {
      name: 'next-auth.session-token',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      expires: Date.now() / 1000 + 24 * 60 * 60, // 1 day
    },
  ]);

  return user;
}
