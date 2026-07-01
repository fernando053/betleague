import { describe, it, expect } from 'vitest';

describe('Zod schemas', () => {
  it('placeBetSchema validates correct data', async () => {
    const { placeBetSchema } = await import('../src/config/env');
    const result = placeBetSchema.safeParse({
      stake: 10,
      selections: [{ matchId: 'cm123', market: '1X2', selection: '1' }],
    });
    expect(result.success).toBe(true);
  });

  it('placeBetSchema rejects empty selections', async () => {
    const { placeBetSchema } = await import('../src/config/env');
    const result = placeBetSchema.safeParse({ stake: 10, selections: [] });
    expect(result.success).toBe(false);
  });

  it('placeBetSchema rejects stake < 1', async () => {
    const { placeBetSchema } = await import('../src/config/env');
    const result = placeBetSchema.safeParse({
      stake: 0,
      selections: [{ matchId: 'cm1', market: '1X2', selection: '1' }],
    });
    expect(result.success).toBe(false);
  });

  it('paginationSchema has defaults', async () => {
    const { paginationSchema } = await import('../src/config/env');
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(20);
      expect(result.data.cursor).toBeUndefined();
    }
  });

  it('paginationSchema parses cursor', async () => {
    const { paginationSchema } = await import('../src/config/env');
    const result = paginationSchema.safeParse({ cursor: 'abc123', limit: 10 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cursor).toBe('abc123');
      expect(result.data.limit).toBe(10);
    }
  });
});
