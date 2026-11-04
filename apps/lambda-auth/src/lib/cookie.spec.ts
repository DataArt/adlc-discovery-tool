import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  CookieBudgetExceededError,
  PKCE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  assertByteBudget,
  clearPkceCookie,
  signPkceCookie,
  signSessionCookie,
  verifyPkceCookie,
  verifySessionCookie,
} from './cookie';

const KEY = randomBytes(32);
const OTHER_KEY = randomBytes(32);

function extractValue(setCookie: string): string {
  return setCookie.split(';')[0].split('=')[1];
}

const SESSION_PAYLOAD = {
  at: 'a'.repeat(800),
  rt: 'b'.repeat(400),
  sub: 'user-object-id-123',
  upn: 'jane.doe@dataart.com',
  exp: 1_700_000_000,
};

describe('cookie name constants', () => {
  it('match the Design.md-specified exact values', () => {
    expect(SESSION_COOKIE_NAME).toBe('__Host-docs_session');
    expect(PKCE_COOKIE_NAME).toBe('__Host-docs_pkce');
  });
});

describe('session cookie', () => {
  it('round-trips sign -> verify', () => {
    const setCookie = signSessionCookie(SESSION_PAYLOAD, KEY);
    const value = extractValue(setCookie);
    expect(verifySessionCookie(value, KEY)).toEqual(SESSION_PAYLOAD);
  });

  it('sets the required cookie attributes', () => {
    const setCookie = signSessionCookie(SESSION_PAYLOAD, KEY);
    expect(setCookie).toContain(`${SESSION_COOKIE_NAME}=`);
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('Secure');
    expect(setCookie).toContain('SameSite=Lax');
    expect(setCookie).toContain('Path=/');
  });

  it('rejects a tampered signature', () => {
    const setCookie = signSessionCookie(SESSION_PAYLOAD, KEY);
    const value = extractValue(setCookie);
    const [payload] = value.split('.');
    const tampered = `${payload}.deadbeef`;
    expect(verifySessionCookie(tampered, KEY)).toBeNull();
  });

  it('rejects a cookie signed with a different key', () => {
    const setCookie = signSessionCookie(SESSION_PAYLOAD, KEY);
    const value = extractValue(setCookie);
    expect(verifySessionCookie(value, OTHER_KEY)).toBeNull();
  });

  it('rejects malformed input without throwing', () => {
    expect(verifySessionCookie('not-a-valid-token', KEY)).toBeNull();
    expect(verifySessionCookie('', KEY)).toBeNull();
    expect(verifySessionCookie('a.b.c', KEY)).toBeNull();
  });

  it('serializes a representative payload under the 4096-byte budget', () => {
    const setCookie = signSessionCookie(SESSION_PAYLOAD, KEY);
    const value = extractValue(setCookie);
    expect(() => assertByteBudget(value)).not.toThrow();
  });
});

describe('assertByteBudget', () => {
  it('throws CookieBudgetExceededError when the value exceeds the budget', () => {
    const oversized = 'x'.repeat(5000);
    expect(() => assertByteBudget(oversized)).toThrow(CookieBudgetExceededError);
  });

  it('throws if signSessionCookie produces an oversized token', () => {
    const hugePayload = { ...SESSION_PAYLOAD, at: 'x'.repeat(10_000) };
    expect(() => signSessionCookie(hugePayload, KEY)).toThrow(CookieBudgetExceededError);
  });
});

describe('PKCE cookie', () => {
  const PKCE_PAYLOAD = { v: 'verifier-value', s: 'state-value' };

  it('round-trips sign -> verify', () => {
    const setCookie = signPkceCookie(PKCE_PAYLOAD, KEY);
    const value = extractValue(setCookie);
    expect(verifyPkceCookie(value, KEY)).toEqual(PKCE_PAYLOAD);
  });

  it('carries a 10-minute Max-Age', () => {
    const setCookie = signPkceCookie(PKCE_PAYLOAD, KEY);
    expect(setCookie).toContain('Max-Age=600');
  });

  it('also enforces the byte budget on an oversized PKCE payload', () => {
    const hugePayload = { v: 'x'.repeat(10_000), s: 'state-value' };
    expect(() => signPkceCookie(hugePayload, KEY)).toThrow(CookieBudgetExceededError);
  });

  it('rejects a mismatched key', () => {
    const setCookie = signPkceCookie(PKCE_PAYLOAD, KEY);
    const value = extractValue(setCookie);
    expect(verifyPkceCookie(value, OTHER_KEY)).toBeNull();
  });
});

describe('clearPkceCookie', () => {
  it('expires the PKCE cookie immediately', () => {
    const setCookie = clearPkceCookie();
    expect(setCookie).toContain(`${PKCE_COOKIE_NAME}=`);
    expect(setCookie).toContain('Max-Age=0');
  });
});
