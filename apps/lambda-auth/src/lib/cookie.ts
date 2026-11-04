import { createHmac, timingSafeEqual } from 'node:crypto';

/** Exact cookie names per Design.md's §Changed interfaces/contracts. The `__Host-`
 * prefix enforces `Secure`, `Path=/`, no `Domain` at the browser level (D3).
 *
 * The session is split across three cookies — `SESSION_COOKIE_NAME` (access
 * token alone), `REFRESH_COOKIE_NAME` (refresh token alone), and
 * `IDENTITY_COOKIE_NAME` (the small `sub`/`upn`/`exp` claims) — because real
 * tokens observed in production (DataArt tenant, 2026-11-04) run ~6.3-6.4KB
 * combined, which exceeds the ~4093-byte limit browsers actually enforce on
 * a single cookie's `name=value` pair.
 *
 * This started as a two-cookie split (access token + identity claims in one,
 * refresh token in the other), but live testing showed the access+identity
 * cookie still exceeded budget by ~150 bytes — the two large tokens are
 * close enough in size that bundling the identity claims with either one
 * tips it over. Giving each large token its own dedicated cookie, with the
 * identity claims in a third, removes that overhead entirely.
 *
 * Also: raising this module's own budget constant alone does not work
 * around the real browser limit — it only stops *this code* from rejecting
 * an oversized cookie. The browser silently drops it anyway, which first
 * manifested as an infinite login redirect loop (the server-side exchange
 * kept succeeding, but the dropped cookie meant the browser was never
 * actually authenticated on the next request). */
export const SESSION_COOKIE_NAME = '__Host-docs_session';
export const REFRESH_COOKIE_NAME = '__Host-docs_refresh';
export const IDENTITY_COOKIE_NAME = '__Host-docs_identity';
export const PKCE_COOKIE_NAME = '__Host-docs_pkce';

const COOKIE_ATTRIBUTES = 'HttpOnly; Secure; SameSite=Lax; Path=/';
const PKCE_COOKIE_MAX_AGE_SECONDS = 600; // 10 minutes — bounds the Entra redirect round-trip

// Real, browser-enforced ceiling on a single cookie's `name=value` pair
// (RFC 6265-derived; Chrome/Firefox/Safari all converge around this figure).
// This is not a value we can safely raise — exceeding it makes the browser
// drop the cookie silently.
const COOKIE_MAX_BYTES = 4093;

export class CookieBudgetExceededError extends Error {
  constructor(byteLength: number, maxBytes: number) {
    super(`Cookie value is ${byteLength} bytes, exceeding the ${maxBytes}-byte budget`);
    this.name = 'CookieBudgetExceededError';
  }
}

export interface SessionPayload {
  at: string; // access token
  rt: string; // refresh token
  sub: string; // subject
  upn: string; // user principal name
  exp: number; // access token expiry (unix seconds)
}

export interface PkcePayload {
  v: string; // code verifier
  s: string; // state
}

/** Throws if `cookieValue` exceeds `maxBytes` (default 4096, the common browser
 * single-cookie size limit). Pure check — does not truncate or mutate. */
export function assertByteBudget(cookieValue: string, maxBytes = 4096): void {
  const byteLength = Buffer.byteLength(cookieValue, 'utf-8');
  if (byteLength > maxBytes) throw new CookieBudgetExceededError(byteLength, maxBytes);
}

function sign(value: string, signingKey: Buffer): string {
  const payload = Buffer.from(value, 'utf-8').toString('base64url');
  const signature = createHmac('sha256', signingKey).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verify(token: string, signingKey: Buffer): string | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expectedSignature = createHmac('sha256', signingKey).update(payload).digest('base64url');
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (signatureBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(signatureBuf, expectedBuf)) return null;
  try {
    return Buffer.from(payload, 'base64url').toString('utf-8');
  } catch {
    return null;
  }
}

function signOne(name: string, value: unknown, signingKey: Buffer): string {
  const token = sign(JSON.stringify(value), signingKey);
  const setCookie = `${name}=${token}; ${COOKIE_ATTRIBUTES}`;
  assertByteBudget(setCookie, COOKIE_MAX_BYTES);
  return setCookie;
}

function verifyOne<T>(cookieValue: string | undefined, signingKey: Buffer): T | null {
  if (!cookieValue) return null;
  const json = verify(cookieValue, signingKey);
  if (json === null) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

type IdentityPart = Pick<SessionPayload, 'sub' | 'upn' | 'exp'>;

/** Signs the session payload and returns three `Set-Cookie` header values —
 * `[accessCookie, refreshCookie, identityCookie]` — that together represent
 * the session. All three must be set; all three must be present and valid
 * to reconstruct the session via `verifySessionCookie`. */
export function signSessionCookie(
  payload: SessionPayload,
  signingKey: Buffer
): [string, string, string] {
  const accessCookie = signOne(SESSION_COOKIE_NAME, { at: payload.at }, signingKey);
  const refreshCookie = signOne(REFRESH_COOKIE_NAME, { rt: payload.rt }, signingKey);
  const identityPayload: IdentityPart = { sub: payload.sub, upn: payload.upn, exp: payload.exp };
  const identityCookie = signOne(IDENTITY_COOKIE_NAME, identityPayload, signingKey);
  return [accessCookie, refreshCookie, identityCookie];
}

/** Verifies and parses the session's three raw cookie values (the `Cookie`
 * header's values for `SESSION_COOKIE_NAME`, `REFRESH_COOKIE_NAME`, and
 * `IDENTITY_COOKIE_NAME` — not the full `Set-Cookie` strings). Returns
 * `null` if any is missing, malformed, tampered, or signed with a different
 * key — never throws. */
export function verifySessionCookie(
  accessCookieValue: string | undefined,
  refreshCookieValue: string | undefined,
  identityCookieValue: string | undefined,
  signingKey: Buffer
): SessionPayload | null {
  const access = verifyOne<{ at: string }>(accessCookieValue, signingKey);
  if (access === null) return null;
  const refresh = verifyOne<{ rt: string }>(refreshCookieValue, signingKey);
  if (refresh === null) return null;
  const identity = verifyOne<IdentityPart>(identityCookieValue, signingKey);
  if (identity === null) return null;
  return { ...access, ...refresh, ...identity };
}

/** Signs the PKCE payload and returns the full `Set-Cookie` header value,
 * including the 10-minute TTL that bounds the Entra redirect round-trip. */
export function signPkceCookie(payload: PkcePayload, signingKey: Buffer): string {
  const token = sign(JSON.stringify(payload), signingKey);
  const setCookie = `${PKCE_COOKIE_NAME}=${token}; ${COOKIE_ATTRIBUTES}; Max-Age=${PKCE_COOKIE_MAX_AGE_SECONDS}`;
  assertByteBudget(setCookie, COOKIE_MAX_BYTES);
  return setCookie;
}

/** Verifies and parses a PKCE cookie's raw value. Returns `null` on any
 * malformed/tampered/wrong-key input — never throws. */
export function verifyPkceCookie(cookieValue: string, signingKey: Buffer): PkcePayload | null {
  const json = verify(cookieValue, signingKey);
  if (json === null) return null;
  try {
    return JSON.parse(json) as PkcePayload;
  } catch {
    return null;
  }
}

/** Returns a `Set-Cookie` header value that immediately expires the PKCE
 * cookie, once the callback round-trip completes. */
export function clearPkceCookie(): string {
  return `${PKCE_COOKIE_NAME}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`;
}

/** Returns `Set-Cookie` header values that immediately expire all three
 * session cookies — used when a valid-looking session turns out to be
 * unusable (e.g. only some of the trio survived) to avoid leaving a
 * half-session behind. */
export function clearSessionCookies(): [string, string, string] {
  return [
    `${SESSION_COOKIE_NAME}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`,
    `${REFRESH_COOKIE_NAME}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`,
    `${IDENTITY_COOKIE_NAME}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`,
  ];
}
