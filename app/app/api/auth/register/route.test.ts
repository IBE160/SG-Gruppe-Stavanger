import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../register/route'; // Adjust path as necessary
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed-${password}`)),
  compare: jest.fn(),
}));

// Mock prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock NextRequest and NextResponse
class MockNextRequest extends NextRequest {
  constructor(init: RequestInit & { ip?: string; json?: () => Promise<any> }) {
    super(new Request('http://localhost/api/auth/register', {
      method: 'POST',
      ...init,
      body: init.json ? JSON.stringify(init.json()) : init.body,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    }));
    Object.defineProperty(this, 'ip', {
      get: () => init.ip || '127.0.0.1',
    });
    if (init.json) {
      this.json = init.json;
    }
  }
}

describe('Register API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
    });

    const mockRequest = new MockNextRequest({
      json: () => Promise.resolve({ email: 'test@example.com', password: 'password123' }),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('User registered successfully');
    expect(data.user).toEqual({ id: 'user-1', email: 'test@example.com' });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed-password',
      },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
  });

  it('should return 400 if email or password are missing', async () => {
    const mockRequest = new MockNextRequest({
      json: () => Promise.resolve({ email: 'test@example.com' }), // Missing password
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Email and password are required');
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should return 409 if user with email already exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'existing@example.com' });

    const mockRequest = new MockNextRequest({
      json: () => Promise.resolve({ email: 'existing@example.com', password: 'password123' }),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('User with this email already exists');
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should return 500 for internal server errors', async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

    const mockRequest = new MockNextRequest({
      json: () => Promise.resolve({ email: 'test@example.com', password: 'password123' }),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('Internal server error');
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid email format', async () => {
    const mockRequest = new MockNextRequest({
      json: () => Promise.resolve({ email: 'invalid-email', password: 'Password123!' }),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Invalid email format');
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should return 400 for weak password', async () => {
    const mockRequest = new MockNextRequest({
      json: () => Promise.resolve({ email: 'test@example.com', password: 'weak' }),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toContain('Password must be at least 8 characters long');
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should rate limit requests', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'test@example.com' });

    const commonRequest = { email: 'test@example.com', password: 'password123' };
    const ip = '192.168.1.1';

    // Make 5 successful requests
    for (let i = 0; i < 5; i++) {
      const mockRequest = new MockNextRequest({
        json: () => Promise.resolve(commonRequest),
        ip: ip,
      });
      const response = await POST(mockRequest);
      expect(response.status).toBe(201);
    }

    // The 6th request should be rate limited
    const mockRequestTooMany = new MockNextRequest({
      json: () => Promise.resolve(commonRequest),
      ip: ip,
    });
    const responseTooMany = await POST(mockRequestTooMany);
    const dataTooMany = await responseTooMany.json();

    expect(responseTooMany.status).toBe(429);
    expect(dataTooMany.message).toBe('Too many requests. Please try again later.');
    expect(prisma.user.create).toHaveBeenCalledTimes(5);
  });
});
