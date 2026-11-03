import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { generatePkce, validateState } from './pkce';

describe('generatePkce', () => {
  it('derives the challenge as the S256 hash of the verifier', () => {
    const { verifier, challenge } = generatePkce();
    const expected = createHash('sha256').update(verifier).digest('base64url');
    expect(challenge).toBe(expected);
  });

  it('produces a sufficiently random verifier and state', () => {
    const a = generatePkce();
    const b = generatePkce();
    expect(a.verifier).not.toBe(b.verifier);
    expect(a.state).not.toBe(b.state);
    // 32 random bytes -> 43 base64url chars (no padding); 16 bytes -> 22 chars
    expect(a.verifier.length).toBeGreaterThanOrEqual(40);
    expect(a.state.length).toBeGreaterThanOrEqual(20);
  });
});

describe('validateState', () => {
  it('accepts a matching state', () => {
    expect(validateState('abc123', 'abc123')).toBe(true);
  });

  it('rejects a mismatched state', () => {
    expect(validateState('abc123', 'xyz789')).toBe(false);
  });

  it('rejects a missing received state', () => {
    expect(validateState('abc123', undefined)).toBe(false);
  });

  it('rejects a missing expected state', () => {
    expect(validateState(undefined, 'abc123')).toBe(false);
  });
});
