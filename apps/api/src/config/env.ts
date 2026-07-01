import { z } from 'zod';

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: parseInt(process.env.PORT || '3001'),
  FOOTBALL_DATA_API_KEY: process.env.FOOTBALL_DATA_API_KEY || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createGroupSchema = z.object({
  name: z.string().min(2).max(50),
});

export const joinGroupSchema = z.object({
  inviteCode: z.string().length(8),
});

export const placeBetSchema = z.object({
  stake: z.number().min(1).max(10000),
  selections: z.array(z.object({
    matchId: z.string(),
    market: z.string(),
    selection: z.string(),
  })).min(1).max(20),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
});

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});
