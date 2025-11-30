import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const getPrismaClient = () => {
  return new PrismaClient();
};
