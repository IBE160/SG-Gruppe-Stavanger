import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { rateLimiter } from '@/lib/rate-limiter';

// Mock the NextAuth handler - we'll test the authorize function directly
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Helper function to create a test user
async function createTestUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

// Helper function to simulate the authorize function from NextAuth config
async function simulateAuthorize(credentials: any, ip: string = '127.0.0.1') {
  // Simulate request headers
  const req = {
    headers: {
      'x-forwarded-for': ip,
    },
  };

  // Apply rate limiting
  const rateLimitResult = rateLimiter.check(ip);

  if (rateLimitResult.limited) {
    throw new Error("Too many login attempts. Please try again later.");
  }

  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      rememberMe: credentials.rememberMe === 'true',
    };
  } catch (error) {
    throw new Error("An error occurred during authentication. Please try again.");
  }
}

describe('Login Flow Integration Tests', () => {
  // Clear the database and rate limiter before each test
  beforeEach(async () => {
    await prisma.user.deleteMany();
    // Note: In-memory rate limiter persists across tests in the same process
    // For better isolation, you would need to reset it or use a distributed solution
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Successful Login', () => {
    it('should authenticate a user with valid credentials', async () => {
      // Create a test user
      const testEmail = 'test@example.com';
      const testPassword = 'Password123!';
      await createTestUser(testEmail, testPassword);

      // Attempt to login
      const result = await simulateAuthorize({
        email: testEmail,
        password: testPassword,
        rememberMe: 'false',
      });

      expect(result).not.toBeNull();
      expect(result?.email).toBe(testEmail);
      expect(result?.rememberMe).toBe(false);
    });

    it('should authenticate a user with remember me enabled', async () => {
      const testEmail = 'rememberme@example.com';
      const testPassword = 'Password123!';
      await createTestUser(testEmail, testPassword);

      const result = await simulateAuthorize({
        email: testEmail,
        password: testPassword,
        rememberMe: 'true',
      });

      expect(result).not.toBeNull();
      expect(result?.email).toBe(testEmail);
      expect(result?.rememberMe).toBe(true);
    });
  });

  describe('Failed Login - Invalid Credentials', () => {
    it('should return null for non-existent user', async () => {
      const result = await simulateAuthorize({
        email: 'nonexistent@example.com',
        password: 'Password123!',
        rememberMe: 'false',
      });

      expect(result).toBeNull();
    });

    it('should return null for incorrect password', async () => {
      const testEmail = 'wrongpass@example.com';
      const testPassword = 'Password123!';
      await createTestUser(testEmail, testPassword);

      const result = await simulateAuthorize({
        email: testEmail,
        password: 'WrongPassword123!',
        rememberMe: 'false',
      });

      expect(result).toBeNull();
    });

    it('should return null for missing email', async () => {
      const result = await simulateAuthorize({
        password: 'Password123!',
        rememberMe: 'false',
      });

      expect(result).toBeNull();
    });

    it('should return null for missing password', async () => {
      const result = await simulateAuthorize({
        email: 'test@example.com',
        rememberMe: 'false',
      });

      expect(result).toBeNull();
    });
  });

  describe('Rate Limiting', () => {
    it('should allow up to 5 login attempts from the same IP', async () => {
      const testEmail = 'ratelimit@example.com';
      const testPassword = 'Password123!';
      await createTestUser(testEmail, testPassword);

      const ip = '192.168.1.100';

      // Make 5 login attempts (all should succeed if credentials are valid)
      for (let i = 0; i < 5; i++) {
        const result = await simulateAuthorize({
          email: testEmail,
          password: testPassword,
          rememberMe: 'false',
        }, ip);

        expect(result).not.toBeNull();
      }
    });

    it('should block the 6th login attempt from the same IP within the window', async () => {
      const testEmail = 'ratelimit2@example.com';
      const testPassword = 'Password123!';
      await createTestUser(testEmail, testPassword);

      const ip = '192.168.1.101';

      // Make 5 successful login attempts
      for (let i = 0; i < 5; i++) {
        await simulateAuthorize({
          email: testEmail,
          password: testPassword,
          rememberMe: 'false',
        }, ip);
      }

      // The 6th attempt should be rate limited
      await expect(
        simulateAuthorize({
          email: testEmail,
          password: testPassword,
          rememberMe: 'false',
        }, ip)
      ).rejects.toThrow("Too many login attempts. Please try again later.");
    });

    it('should rate limit failed login attempts as well', async () => {
      const ip = '192.168.1.102';

      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await simulateAuthorize({
          email: `nonexistent${i}@example.com`,
          password: 'Password123!',
          rememberMe: 'false',
        }, ip);
      }

      // The 6th attempt should be rate limited even if credentials are invalid
      await expect(
        simulateAuthorize({
          email: 'nonexistent@example.com',
          password: 'Password123!',
          rememberMe: 'false',
        }, ip)
      ).rejects.toThrow("Too many login attempts. Please try again later.");
    });

    it('should allow login attempts from different IPs', async () => {
      const testEmail = 'differentip@example.com';
      const testPassword = 'Password123!';
      await createTestUser(testEmail, testPassword);

      // Make 5 attempts from IP 1
      for (let i = 0; i < 5; i++) {
        const result = await simulateAuthorize({
          email: testEmail,
          password: testPassword,
          rememberMe: 'false',
        }, '192.168.1.103');

        expect(result).not.toBeNull();
      }

      // Attempt from a different IP should still work
      const result = await simulateAuthorize({
        email: testEmail,
        password: testPassword,
        rememberMe: 'false',
      }, '192.168.1.104');

      expect(result).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle database errors gracefully', async () => {
      // Temporarily disconnect Prisma to simulate a database error
      await prisma.$disconnect();

      await expect(
        simulateAuthorize({
          email: 'test@example.com',
          password: 'Password123!',
          rememberMe: 'false',
        })
      ).rejects.toThrow("An error occurred during authentication. Please try again.");

      // Reconnect for other tests
      await prisma.$connect();
    });

    it('should verify password hashing is working correctly', async () => {
      const testEmail = 'hashtest@example.com';
      const testPassword = 'Password123!';
      const user = await createTestUser(testEmail, testPassword);

      // Ensure password is hashed and not stored in plain text
      expect(user.passwordHash).not.toBe(testPassword);
      expect(user.passwordHash.length).toBeGreaterThan(20); // Bcrypt hashes are longer

      // Ensure the hashed password can be verified
      const isValid = await bcrypt.compare(testPassword, user.passwordHash);
      expect(isValid).toBe(true);
    });

    it('should handle email case sensitivity correctly', async () => {
      const testEmail = 'CaseSensitive@Example.com';
      const testPassword = 'Password123!';
      await createTestUser(testEmail, testPassword);

      // Attempt to login with same email but different casing
      // This behavior depends on your Prisma schema (case-sensitive or not)
      const result = await simulateAuthorize({
        email: testEmail.toLowerCase(),
        password: testPassword,
        rememberMe: 'false',
      });

      // In most setups, emails should be case-insensitive
      // Adjust this test based on your actual requirements
      // For now, we expect null if emails are case-sensitive
      // Modify as needed based on your implementation
      expect(result).toBeNull();
    });
  });

  describe('Full Authentication Flow with Prisma', () => {
    it('should successfully authenticate and verify user exists in database', async () => {
      const testEmail = 'fullflow@example.com';
      const testPassword = 'Password123!';

      // Create user
      const createdUser = await createTestUser(testEmail, testPassword);
      expect(createdUser.email).toBe(testEmail);

      // Authenticate
      const result = await simulateAuthorize({
        email: testEmail,
        password: testPassword,
        rememberMe: 'false',
      });

      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdUser.id);
      expect(result?.email).toBe(testEmail);

      // Verify user still exists in database
      const userInDb = await prisma.user.findUnique({
        where: { email: testEmail }
      });

      expect(userInDb).not.toBeNull();
      expect(userInDb?.id).toBe(createdUser.id);
    });

    it('should handle multiple users with different credentials', async () => {
      // Create multiple users
      const users = [
        { email: 'user1@example.com', password: 'Password1!' },
        { email: 'user2@example.com', password: 'Password2!' },
        { email: 'user3@example.com', password: 'Password3!' },
      ];

      for (const user of users) {
        await createTestUser(user.email, user.password);
      }

      // Authenticate each user with correct credentials
      for (const user of users) {
        const result = await simulateAuthorize({
          email: user.email,
          password: user.password,
          rememberMe: 'false',
        }, `192.168.1.${users.indexOf(user) + 1}`); // Different IPs to avoid rate limiting

        expect(result).not.toBeNull();
        expect(result?.email).toBe(user.email);
      }

      // Verify wrong password fails for each user
      for (const user of users) {
        const result = await simulateAuthorize({
          email: user.email,
          password: 'WrongPassword!',
          rememberMe: 'false',
        }, `192.168.2.${users.indexOf(user) + 1}`); // Different IPs to avoid rate limiting

        expect(result).toBeNull();
      }
    });
  });
});
