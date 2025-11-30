import request from 'supertest';
import { prisma } from '@/lib/prisma'; // Use the real prisma client
import { POST } from '../register/route';
import { NextRequest } from 'next/server';

// This is a simplified integration test setup.
// For a robust setup, you would typically:
// 1. Use a separate test database instance (e.g., a Docker container).
// 2. Clear the database before each test or test suite.
// 3. Potentially use a tool like `next-test-api-route-handler` to simulate API requests more accurately.

// Mock NextRequest for Supertest
// Supertest expects an express-like app, so we'll wrap our Next.js handler
// For simple route handlers without complex NextRequest features, this can work.
// For full fidelity, `next-test-api-route-handler` is recommended.
const createMockRequest = (body: any, ip: string = '127.0.0.1'): NextRequest => {
  const req = new NextRequest(new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
  // Manually attach ip for rate limiting
  Object.defineProperty(req, 'ip', { value: ip });
  return req;
};


describe('Register API Route Integration Tests', () => {
  // Clear the database before each test to ensure a clean state
  beforeEach(async () => {
    await prisma.user.deleteMany(); // Be cautious with this in a real setup!
    // Reset the in-memory rate limiter for each test run if it's external
    // For the current in-memory map, it will persist across runs within the same process.
    // In a real integration test, the process might restart or the rate limiter would be external.
    // If running in Jest, it generally forks processes, so it *might* be reset.
    // For clarity, let's just make a note about it.
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });


  it('should register a new user successfully and store in DB', async () => {
    const response = await POST(createMockRequest({
      email: 'integration@example.com',
      password: 'Password123!',
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('User registered successfully');
    expect(data.user).toHaveProperty('id');
    expect(data.user).toHaveProperty('email', 'integration@example.com');

    // Verify user exists in the database
    const userInDb = await prisma.user.findUnique({ where: { email: 'integration@example.com' } });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.email).toBe('integration@example.com');
    expect(userInDb?.passwordHash).not.toBe('Password123!'); // Should be hashed
  });

  it('should return 400 if email is missing', async () => {
    const response = await POST(createMockRequest({ password: 'Password123!' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Email and password are required');
  });

  it('should return 400 if password is missing', async () => {
    const response = await POST(createMockRequest({ email: 'integration@example.com' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Email and password are required');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await POST(createMockRequest({
      email: 'invalid-email',
      password: 'Password123!',
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Invalid email format');
  });

  it('should return 400 for weak password (no uppercase)', async () => {
    const response = await POST(createMockRequest({
      email: 'weakpass@example.com',
      password: 'password123!', // Missing uppercase
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toContain('Password must be at least 8 characters long');
  });

  it('should return 409 if user with email already exists', async () => {
    // First registration
    await POST(createMockRequest({
      email: 'existing@example.com',
      password: 'Password123!',
    }));

    // Second registration with same email
    const response = await POST(createMockRequest({
      email: 'existing@example.com',
      password: 'AnotherPass1!',
    }));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('User with this email already exists');
  });

  it('should rate limit requests', async () => {
    const commonRequest = { email: 'rate@example.com', password: 'Password123!' };
    const ip = '192.168.1.100';

    // Make 5 successful requests (assuming different emails or state reset)
    for (let i = 0; i < 5; i++) {
      const resp = await POST(createMockRequest({ email: `rate${i}@example.com`, password: 'Password123!' }, ip));
      expect(resp.status).toBe(201);
    }

    // The 6th request should be rate limited
    const responseTooMany = await POST(createMockRequest({ email: `rate5@example.com`, password: 'Password123!' }, ip));
    const dataTooMany = await responseTooMany.json();

    expect(responseTooMany.status).toBe(429);
    expect(dataTooMany.message).toBe('Too many requests. Please try again later.');
  }, 10000); // Increase timeout for rate limit test if needed
});
