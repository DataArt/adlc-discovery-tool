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

/** Verifies `token`'s signature (and, when `issuer` is given, its `iss` claim)
 * against `jwks`. Returns `false` on any failure (tampered, wrong `kid`, wrong
 * issuer, unreachable JWKS endpoint) — never throws. Expiry is intentionally
 * tolerated loosely here; the caller branches on expiry itself (silent refresh
 * vs. fail-closed), so this only answers "was this signed by a key Entra
 * controls for this tenant," not "is it still valid right now."
 *
 * Note: this does not validate the `aud` claim. The access token's audience
 * depends on the Entra app registration's configured API/scopes, which isn't
 * knowable at implementation time without testing against the live tenant —
 * confirming and adding `audience` validation is deferred to the independent
 * security review Architecture.md D2 already requires before production
 * rollout (Efforts.md Ticket #3), rather than guessing a value that could
 * silently break every real login. */
const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

export async function verifySignature(
  token: string,
  jwks: JWTVerifyGetKey,
  issuer?: string
): Promise<boolean> {
  try {
    await jwtVerify(token, jwks, { clockTolerance: TEN_YEARS_SECONDS, issuer });
    return true;
  } catch (err) {
    // Only called against the ID token at issuance (callback/refresh) — see
    // handler-oidc.ts's verifyIdToken — so a failure here is a genuine,
    // infrequent, worth-logging event (Entra's response didn't verify), not
    // per-request noise. Error name/message only, never the token itself.
    const name = err instanceof Error ? err.name : typeof err;
    const message = err instanceof Error ? err.message : String(err);
    console.error(`verifySignature failed: ${name}: ${message}`);
    return false;
  }
}
