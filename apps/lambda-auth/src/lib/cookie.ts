import { createHmac, timingSafeEqual } from 'node:crypto';

/** Exact cookie names per Design.md's §Changed interfaces/contracts. The `__Host-`
 * prefix enforces `Secure`, `Path=/`, no `Domain` at the browser level (D3).
 *
 * The session is split across two cookies — `SESSION_COOKIE_NAME` (access
 * token + identity claims) and `REFRESH_COOKIE_NAME` (refresh token) — because
 * real tokens observed in production (DataArt tenant, 2026-11-04) run
 * ~6.3-6.4KB combined, which exceeds the ~4093-byte limit browsers actually
 * enforce on a single cookie's `name=value` pair. Raising this module's own
 * budget constant alone does not work around that: it only stops *this code*
 * from rejecting an oversized cookie — the browser silently drops it anyway,
 * which manifested as an infinite login redirect loop (the server-side
 * exchange kept succeeding, but the dropped cookie meant the browser was
 * never actually authenticated on the next request). */
export const SESSION_COOKIE_NAME = '__Host-docs_session';
export const REFRESH_COOKIE_NAME = '__Host-docs_refresh';
export const PKCE_COOKIE_NAME = '__Host-docs_pkce';

const COOKIE_ATTRIBUTES = 'HttpOnly; Secure; SameSite=Lax; Path=/';
const PKCE_COOKIE_MAX_AGE_SECONDS = 600; // 10 minutes — bounds the Entra redirect round-trip

// Real, browser-enforced ceiling on a single cookie's `name=value` pair
// (RFC 6265-derived; Chrome/Firefox/Safari all converge around this figure).
// Unlike the module's previous 8192 constant, this is not a value we can
// safely raise — exceeding it makes the browser drop the cookie silently.
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

type AccessPart = Omit<SessionPayload, 'rt'>;
type RefreshPart = Pick<SessionPayload, 'rt'>;

/** Signs the session payload and returns both `Set-Cookie` header values —
 * `[accessCookie, refreshCookie]` — that together represent the session.
 * Both must be set; both must be present and valid to reconstruct the
 * session via `verifySessionCookie`. */
export function signSessionCookie(payload: SessionPayload, signingKey: Buffer): [string, string] {
  const { rt, ...accessPart } = payload;
  const accessPayload: AccessPart = accessPart;
  const refreshPayload: RefreshPart = { rt };

  const accessToken = sign(JSON.stringify(accessPayload), signingKey);
  const accessCookie = `${SESSION_COOKIE_NAME}=${accessToken}; ${COOKIE_ATTRIBUTES}`;
  assertByteBudget(accessCookie, COOKIE_MAX_BYTES);

  const refreshToken = sign(JSON.stringify(refreshPayload), signingKey);
  const refreshCookie = `${REFRESH_COOKIE_NAME}=${refreshToken}; ${COOKIE_ATTRIBUTES}`;
  assertByteBudget(refreshCookie, COOKIE_MAX_BYTES);

  return [accessCookie, refreshCookie];
}

/** Verifies and parses the session's two raw cookie values (the `Cookie`
 * header's values for `SESSION_COOKIE_NAME` and `REFRESH_COOKIE_NAME`, not
 * the full `Set-Cookie` strings). Returns `null` if either is missing,
 * malformed, tampered, or signed with a different key — never throws. */
export function verifySessionCookie(
  accessCookieValue: string | undefined,
  refreshCookieValue: string | undefined,
  signingKey: Buffer
): SessionPayload | null {
  if (!accessCookieValue || !refreshCookieValue) return null;
  const accessJson = verify(accessCookieValue, signingKey);
  if (accessJson === null) return null;
  const refreshJson = verify(refreshCookieValue, signingKey);
  if (refreshJson === null) return null;
  try {
    const access = JSON.parse(accessJson) as AccessPart;
    const refresh = JSON.parse(refreshJson) as RefreshPart;
    return { ...access, ...refresh };
  } catch {
    return null;
  }
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

/** Returns `Set-Cookie` header values that immediately expire both session
 * cookies — used when a valid-looking session turns out to be unusable
 * (e.g. only one of the pair survived) to avoid leaving a half-session
 * cookie around. */
export function clearSessionCookies(): [string, string] {
  return [
    `${SESSION_COOKIE_NAME}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`,
    `${REFRESH_COOKIE_NAME}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`,
  ];
}
