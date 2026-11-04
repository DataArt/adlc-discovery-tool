import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

function base64url(buffer: Buffer): string {
  return buffer.toString('base64url');
}

export interface PkceValues {
  verifier: string;
  challenge: string;
  state: string;
}

/**
 * Generates a PKCE code verifier/challenge pair (S256 method) plus a CSRF
 * `state` value, for the initial redirect to Entra's /authorize endpoint.
 */
export function generatePkce(): PkceValues {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash('sha256').update(verifier).digest());
  const state = base64url(randomBytes(16));
  return { verifier, challenge, state };
}

/**
 * Validates the `state` returned on the OIDC callback against the value
 * stored in the PKCE cookie. `state` isn't itself secret (the PKCE verifier
 * is the actual CSRF-binding secret), so a length-matched comparison is
 * sufficient here.
 */
export function validateState(expected: string | undefined, received: string | undefined): boolean {
  if (!expected || !received) return false;
  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(received);
  if (expectedBuf.length !== receivedBuf.length) return false;
  return timingSafeEqual(expectedBuf, receivedBuf);
}
