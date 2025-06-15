import { describe, it, expect } from 'vitest';
import { containsProfanity } from './profanity';

describe('containsProfanity', () => {
  it('detects profanity', () => {
    expect(containsProfanity('shit happens')).toBe(true);
  });

  it('allows clean text', () => {
    expect(containsProfanity('hello world')).toBe(false);
  });
});
