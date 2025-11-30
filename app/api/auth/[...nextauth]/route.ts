import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma-client";
import bcrypt from "bcryptjs";
import { rateLimiter } from '@/lib/rate-limiter';
import logger from '@/lib/logger';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "boolean" }
      },
      async authorize(credentials, req) {
        // Fixed: Properly extract IP address from request headers
        const forwardedFor = req?.headers?.['x-forwarded-for'];
        const ip = typeof forwardedFor === 'string' 
          ? forwardedFor.split(',')[0].trim() 
          : req?.headers?.['x-real-ip'] || '127.0.0.1';
        
        const rateLimitResult = rateLimiter.check(ip);

        if (rateLimitResult.limited) {
          logger.warn(`Rate limit exceeded for login attempt from IP: ${ip}`);
          throw new Error("Too many login attempts. Please try again later.");
        }

        if (!credentials?.email || !credentials?.password) {
          logger.warn(`Login attempt with missing credentials from IP: ${ip}`);
          return null;
        }

        try {
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

          logger.info(`Successful login for user: ${credentials.email}`);
          
          // Return user object, including rememberMe state for use in callbacks
          return {
            id: user.id,
            email: user.email,
            rememberMe: credentials.rememberMe === 'true',
          };
        } catch (error) {
          logger.error(`Error during authentication: ${error}`);
          throw new Error("An error occurred during authentication. Please try again.");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Default to 30 days
  },
  pages: {
    signIn: "/login", // Fixed: Changed from /auth/signin to /login to match your login page
    error: "/login", // Fixed: Redirect errors back to login page instead of non-existent error page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        (token as any).rememberMe = (user as any).rememberMe;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      // If rememberMe was explicitly false, shorten session to 24 hours
      if ((token as any).rememberMe === false) {
        session.expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
});

export { handler as GET, handler as POST };