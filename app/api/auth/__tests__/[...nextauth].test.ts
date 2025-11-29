import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Define a variable to hold the NextAuth options that would be passed to NextAuth
let nextAuthOptions: any;

// Mock next-auth to capture the options it's called with
jest.mock('next-auth', () => (options: any) => {
  nextAuthOptions = options; // Capture the options
  // Return a mock handler that would typically be returned by NextAuth
  return {
    GET: jest.fn(),
    POST: jest.fn(),
    // We don't need to implement the full NextAuth handler here,
    // just capture the options to extract the authorize function.
  };
});

// Import the actual route file, which will trigger the mocked NextAuth
import { handler } from '../[...nextauth]/route';

// Mock prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('NextAuth CredentialsProvider - authorize function', () => {
  let authorize: (credentials: Record<any, any>, req?: any) => Promise<any>;

  beforeAll(() => {
    // nextAuthOptions should now be populated from the import of '../[...nextauth]/route'
    const credentialsProviderConfig = nextAuthOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    );

    if (!credentialsProviderConfig || !credentialsProviderConfig.authorize) {
      throw new Error('CredentialsProvider or its authorize function not found in NextAuth options.');
    }
    authorize = credentialsProviderConfig.authorize;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user on successful authorization', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const user = await authorize({ email: 'test@example.com', password: 'password123' });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    expect(user).toEqual({ id: 'user-1', email: 'test@example.com' });
  });

  it('should return null if email or password are missing', async () => {
    const user = await authorize({ email: 'test@example.com' }); // Missing password

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(user).toBeNull();
  });

  it('should return null if user is not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const user = await authorize({ email: 'unknown@example.com', password: 'password123' });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'unknown@example.com' } });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(user).toBeNull();
  });

  it('should return null if password is invalid', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const user = await authorize({ email: 'test@example.com', password: 'wrongpassword' });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed-password');
    expect(user).toBeNull();
  });
});
