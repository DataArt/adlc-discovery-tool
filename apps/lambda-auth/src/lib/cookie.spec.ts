import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  CookieBudgetExceededError,
  IDENTITY_COOKIE_NAME,
  PKCE_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  assertByteBudget,
  clearPkceCookie,
  clearSessionCookies,
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
  rt: 'b'.repeat(400),
  sub: 'user-object-id-123',
  upn: 'jane.doe@dataart.com',
  exp: 1_700_000_000,
};

describe('cookie name constants', () => {
  it('match the Design.md-specified exact values', () => {
    expect(REFRESH_COOKIE_NAME).toBe('__Host-docs_refresh');
    expect(IDENTITY_COOKIE_NAME).toBe('__Host-docs_identity');
    expect(PKCE_COOKIE_NAME).toBe('__Host-docs_pkce');
  });
});

describe('session cookie (split across two cookies — no access token stored, see lib/cookie.ts)', () => {
  it('round-trips sign -> verify', () => {
    const [refreshSetCookie, identitySetCookie] = signSessionCookie(SESSION_PAYLOAD, KEY);
    expect(
      verifySessionCookie(extractValue(refreshSetCookie), extractValue(identitySetCookie), KEY)
    ).toEqual(SESSION_PAYLOAD);
  });

  it('sets the required cookie attributes and correct names on both cookies', () => {
    const [refreshSetCookie, identitySetCookie] = signSessionCookie(SESSION_PAYLOAD, KEY);
    expect(refreshSetCookie).toContain(`${REFRESH_COOKIE_NAME}=`);
    expect(identitySetCookie).toContain(`${IDENTITY_COOKIE_NAME}=`);
    for (const setCookie of [refreshSetCookie, identitySetCookie]) {
      expect(setCookie).toContain('HttpOnly');
      expect(setCookie).toContain('Secure');
      expect(setCookie).toContain('SameSite=Lax');
      expect(setCookie).toContain('Path=/');
    }
  });

  it('rejects a tampered refresh-cookie signature', () => {
    const [refreshSetCookie, identitySetCookie] = signSessionCookie(SESSION_PAYLOAD, KEY);
    const [payload] = extractValue(refreshSetCookie).split('.');
    const tampered = `${payload}.deadbeef`;
    expect(verifySessionCookie(tampered, extractValue(identitySetCookie), KEY)).toBeNull();
  });

  it('rejects a cookie pair signed with a different key', () => {
    const [refreshSetCookie, identitySetCookie] = signSessionCookie(SESSION_PAYLOAD, KEY);
    expect(
      verifySessionCookie(
        extractValue(refreshSetCookie),
        extractValue(identitySetCookie),
        OTHER_KEY
      )
    ).toBeNull();
  });

  it('rejects malformed input without throwing', () => {
    expect(verifySessionCookie('not-a-valid-token', 'also-not-valid', KEY)).toBeNull();
    expect(verifySessionCookie('', '', KEY)).toBeNull();
    expect(verifySessionCookie('a.b.c', 'd.e.f', KEY)).toBeNull();
  });

  it('rejects when either cookie is missing', () => {
    const [refreshSetCookie, identitySetCookie] = signSessionCookie(SESSION_PAYLOAD, KEY);
    const r = extractValue(refreshSetCookie);
    const i = extractValue(identitySetCookie);
    expect(verifySessionCookie(undefined, i, KEY)).toBeNull();
    expect(verifySessionCookie(r, undefined, KEY)).toBeNull();
  });

  it('serializes a representative payload with each cookie under the 4093-byte budget', () => {
    const setCookies = signSessionCookie(SESSION_PAYLOAD, KEY);
    for (const setCookie of setCookies) {
      expect(() => assertByteBudget(setCookie, 4093)).not.toThrow();
    }
  });
});

describe('assertByteBudget', () => {
  it('throws CookieBudgetExceededError when the value exceeds the budget', () => {
    const oversized = 'x'.repeat(5000);
    expect(() => assertByteBudget(oversized)).toThrow(CookieBudgetExceededError);
  });

  it('throws if signSessionCookie produces an oversized refresh-token cookie', () => {
    const hugePayload = { ...SESSION_PAYLOAD, rt: 'x'.repeat(10_000) };
    expect(() => signSessionCookie(hugePayload, KEY)).toThrow(CookieBudgetExceededError);
  });

  it('accepts a realistic large refresh token within budget (sized to reflect production-observed token sizes)', () => {
    const largeTokenPayload = {
      ...SESSION_PAYLOAD,
      rt: 'r'.repeat(2900),
    };
    expect(() => signSessionCookie(largeTokenPayload, KEY)).not.toThrow();
  });
});

describe('clearSessionCookies', () => {
  it('expires both session cookies immediately', () => {
    const [refreshClear, identityClear] = clearSessionCookies();
    expect(refreshClear).toContain(`${REFRESH_COOKIE_NAME}=`);
    expect(refreshClear).toContain('Max-Age=0');
    expect(identityClear).toContain(`${IDENTITY_COOKIE_NAME}=`);
    expect(identityClear).toContain('Max-Age=0');
  });
});

describe('PKCE cookie', () => {
  const PKCE_PAYLOAD = { v: 'verifier-value', s: 'state-value', p: '/docs/intro' };

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
    const hugePayload = { v: 'x'.repeat(10_000), s: 'state-value', p: '/docs/intro' };
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
