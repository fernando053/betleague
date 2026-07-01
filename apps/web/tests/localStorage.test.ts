import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((_index: number) => null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('localStorage mock', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('stores and retrieves items', () => {
    localStorage.setItem('token', 'abc123');
    expect(localStorage.getItem('token')).toBe('abc123');
  });

  it('removes items', () => {
    localStorage.setItem('token', 'abc123');
    localStorage.removeItem('token');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
