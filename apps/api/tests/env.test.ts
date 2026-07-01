import { describe, it, expect } from 'vitest';
import { env, registerSchema, loginSchema, createGroupSchema, joinGroupSchema } from '../src/config/env';

describe('env config', () => {
  it('exports required env vars', () => {
    expect(typeof env.DATABASE_URL).toBe('string');
    expect(typeof env.JWT_SECRET).toBe('string');
    expect(typeof env.PORT).toBe('number');
  });
});

describe('registerSchema', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = registerSchema.safeParse({
      name: 'T',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'Test',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      name: 'Test',
      email: 'test@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid login', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('createGroupSchema', () => {
  it('accepts valid group name', () => {
    const result = createGroupSchema.safeParse({ name: 'My Group' });
    expect(result.success).toBe(true);
  });

  it('rejects single character name', () => {
    const result = createGroupSchema.safeParse({ name: 'A' });
    expect(result.success).toBe(false);
  });
});

describe('joinGroupSchema', () => {
  it('accepts 8-char invite code', () => {
    const result = joinGroupSchema.safeParse({ inviteCode: 'ABC12345' });
    expect(result.success).toBe(true);
  });

  it('rejects wrong length code', () => {
    const result = joinGroupSchema.safeParse({ inviteCode: 'ABC' });
    expect(result.success).toBe(false);
  });
});
