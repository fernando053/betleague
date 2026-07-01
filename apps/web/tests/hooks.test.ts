import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useIOS hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useIOS exports expected shape', async () => {
    const mod = await import('../src/hooks/useIOS');
    expect(typeof mod.useIOS).toBe('function');
    expect(typeof mod.useKeyboard).toBe('function');
  });
});
