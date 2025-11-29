import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma-client";
import bcrypt from "bcryptjs";
import { rateLimiter } from '@/lib/rate-limiter'; // Import the rate limiter
import logger from '@/lib/logger'; // Import logger

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "boolean" } // Add rememberMe credential
      },
      async authorize(credentials, req) {
        // Apply rate limiting before authentication attempts
        // Note: For Next.js App Router, req.ip might not always be directly available
        // A more robust solution might involve a custom middleware or reading from headers
        const ip = (req?.headers as any)?.get('x-forwarded-for') || req?.ip || '127.0.0.1';
        const rateLimitResult = rateLimiter.check(ip);

        if (rateLimitResult.limited) {
          logger.warn(`Rate limit exceeded for login attempt from IP: ${ip}`);
          // Returning null here will result in a generic 'CredentialsSignin' error
          // NextAuth.js does not directly support returning custom HTTP status codes from authorize
          throw new Error("Too many login attempts. Please try again later.");
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          logger.warn(`Login attempt with non-existent email: ${credentials.email}`);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          logger.warn(`Login attempt with invalid password for user: ${credentials.email}`);
          return null;
        }

        // Return user object, including rememberMe state for use in callbacks
        return {
          id: user.id,
          email: user.email,
          rememberMe: credentials.rememberMe === 'true', // Convert string to boolean
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Default to 30 days for 'remember me' like behavior
  },
  pages: {
    signIn: "/auth/signin", // This should point to app/login or similar, adjust if necessary
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        (token as any).rememberMe = (user as any).rememberMe; // Pass rememberMe to token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      if ((token as any).rememberMe === false) { // If rememberMe was explicitly false, shorten session
        session.expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };