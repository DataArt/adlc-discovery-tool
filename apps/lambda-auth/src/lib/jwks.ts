import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JWTVerifyGetKey } from 'jose';

type RemoteJwks = ReturnType<typeof createRemoteJWKSet>;

// Cached per cold start, mirroring handler-basic.ts's cachedHash pattern — one
// fetch per Lambda@Edge execution environment, no TTL re-fetch policy.
const cache = new Map<string, RemoteJwks>();

/** Returns the cached remote JWKS for `issuerUrl`, fetching (and caching) it on
 * first use within this execution environment. */
export function getJwks(issuerUrl: string): RemoteJwks {
  let jwks = cache.get(issuerUrl);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(issuerUrl));
    cache.set(issuerUrl, jwks);
  }
  return jwks;
}

/** Verifies `token`'s signature against `jwks`. Returns `false` on any failure
 * (tampered, wrong `kid`, unreachable JWKS endpoint) — never throws. Expiry is
 * intentionally tolerated loosely here; the caller branches on expiry itself
 * (silent refresh vs. fail-closed), so this only answers "was this signed by
 * a key Entra controls," not "is it still valid right now." */
const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

export async function verifySignature(token: string, jwks: JWTVerifyGetKey): Promise<boolean> {
  try {
    await jwtVerify(token, jwks, { clockTolerance: TEN_YEARS_SECONDS });
    return true;
  } catch {
    return false;
  }
}
