import "dotenv/config";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  adapter: {
    url: process.env.DATABASE_URL, // must be set in your .env
  },
});
