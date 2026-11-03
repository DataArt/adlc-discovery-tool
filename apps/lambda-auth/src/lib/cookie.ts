import { createHmac, timingSafeEqual } from 'node:crypto';

/** Exact cookie names per Design.md's §Changed interfaces/contracts. The `__Host-`
 * prefix enforces `Secure`, `Path=/`, no `Domain` at the browser level (D5). */
export const SESSION_COOKIE_NAME = '__Host-docs_session';
export const PKCE_COOKIE_NAME = '__Host-docs_pkce';

const COOKIE_ATTRIBUTES = 'HttpOnly; Secure; SameSite=Lax; Path=/';
const PKCE_COOKIE_MAX_AGE_SECONDS = 600; // 10 minutes — bounds the Entra redirect round-trip

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

/** Signs the session payload and returns the full `Set-Cookie` header value. */
export function signSessionCookie(payload: SessionPayload, signingKey: Buffer): string {
  const token = sign(JSON.stringify(payload), signingKey);
  assertByteBudget(token);
  return `${SESSION_COOKIE_NAME}=${token}; ${COOKIE_ATTRIBUTES}`;
}

/** Verifies and parses a session cookie's raw value (the `Cookie` header's value
 * for `SESSION_COOKIE_NAME`, not the full `Set-Cookie` string). Returns `null` on
 * any malformed/tampered/wrong-key input — never throws. */
export function verifySessionCookie(
  cookieValue: string,
  signingKey: Buffer
): SessionPayload | null {
  const json = verify(cookieValue, signingKey);
  if (json === null) return null;
  try {
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

/** Signs the PKCE payload and returns the full `Set-Cookie` header value,
 * including the 10-minute TTL that bounds the Entra redirect round-trip. */
export function signPkceCookie(payload: PkcePayload, signingKey: Buffer): string {
  const token = sign(JSON.stringify(payload), signingKey);
  return `${PKCE_COOKIE_NAME}=${token}; ${COOKIE_ATTRIBUTES}; Max-Age=${PKCE_COOKIE_MAX_AGE_SECONDS}`;
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
