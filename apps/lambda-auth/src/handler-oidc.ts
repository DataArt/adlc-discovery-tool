import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import type {
  CloudFrontHeaders,
  CloudFrontRequestEvent,
  CloudFrontRequestResult,
} from 'aws-lambda';
import {
  AuthorizationResponseError,
  authorizationCodeGrant,
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  type Configuration,
  discovery,
  randomPKCECodeVerifier,
  randomState,
  refreshTokenGrant,
} from 'openid-client';
import {
  IDENTITY_COOKIE_NAME,
  PKCE_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  type SessionPayload,
  clearPkceCookie,
  signPkceCookie,
  signSessionCookie,
  verifyPkceCookie,
  verifySessionCookie,
} from './lib/cookie';
import { sanitizeRedirectTarget } from './lib/redirect';

const CALLBACK_PATH = '/_auth/callback';
const SCOPE = 'openid profile email offline_access';

// process.env.AWS_REGION and SM_SECRET_NAME are build-time constants injected via
// esbuild --define, same pattern as handler-basic.ts.
const client = new SecretsManagerClient({ region: process.env.AWS_REGION });

interface OidcSecrets {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  signingKey: Buffer;
}

interface Claims {
  sub?: string;
  upn?: string;
  preferred_username?: string;
  email?: string;
}

// Cached per cold start, mirroring handler-basic.ts's cachedHash pattern.
let cachedSecrets: OidcSecrets | null = null;
// Cached per cold start — discovery() performs a network call to Entra's
// well-known metadata endpoint; its Configuration also owns the JWKS cache
// that authorizationCodeGrant/refreshTokenGrant use internally to verify the
// ID token's signature, so there's no separate JWKS module to manage here.
let cachedConfig: Configuration | null = null;

async function getSecrets(): Promise<OidcSecrets> {
  if (cachedSecrets) return cachedSecrets;
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: process.env.SM_SECRET_NAME })
  );
  const secret = JSON.parse(response.SecretString ?? '{}') as Record<string, string | undefined>;
  const clientId = secret.OIDC_CLIENT_ID;
  const clientSecret = secret.OIDC_CLIENT_SECRET;
  const tenantId = secret.OIDC_TENANT_ID;
  const signingKeyB64 = secret.OIDC_SESSION_SIGNING_KEY;
  if (!clientId || !clientSecret || !tenantId || !signingKeyB64) {
    throw new Error('OIDC secret fields are missing or malformed');
  }
  const signingKey = Buffer.from(signingKeyB64, 'base64');
  if (signingKey.length < 32) {
    throw new Error('OIDC_SESSION_SIGNING_KEY must decode to at least 32 bytes');
  }
  cachedSecrets = { clientId, clientSecret, tenantId, signingKey };
  return cachedSecrets;
}

async function getConfig(secrets: OidcSecrets): Promise<Configuration> {
  if (cachedConfig) return cachedConfig;
  // Passing clientSecret as the `metadata` shorthand defaults the client's
  // authentication method to ClientSecretPost — the same `client_secret` in
  // the POST body this handler used before migrating to openid-client.
  cachedConfig = await discovery(
    new URL(`https://login.microsoftonline.com/${secrets.tenantId}/v2.0`),
    secrets.clientId,
    secrets.clientSecret
  );
  return cachedConfig;
}

function parseCookies(headers: CloudFrontHeaders): Record<string, string> {
  const header = headers['cookie']?.map((h) => h.value).join('; ') ?? '';
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) out[name] = value;
  }
  return out;
}

function claimsToIdentity(claims: Claims | undefined, fallbackSub = '', fallbackUpn = '') {
  return {
    sub: claims?.sub ?? fallbackSub,
    upn: claims?.upn ?? claims?.preferred_username ?? claims?.email ?? fallbackUpn,
  };
}

async function redirectToLogin(
  host: string,
  originalUri: string,
  originalQuerystring: string,
  secrets: OidcSecrets,
  config: Configuration
): Promise<CloudFrontRequestResult> {
  const verifier = randomPKCECodeVerifier();
  const challenge = await calculatePKCECodeChallenge(verifier);
  const state = randomState();
  const originalPath = originalQuerystring ? `${originalUri}?${originalQuerystring}` : originalUri;
  const redirectUri = `https://${host}${CALLBACK_PATH}`;

  const url = buildAuthorizationUrl(config, {
    redirect_uri: redirectUri,
    response_type: 'code',
    response_mode: 'query',
    scope: SCOPE,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  const pkceSetCookie = signPkceCookie(
    { v: verifier, s: state, p: originalPath },
    secrets.signingKey
  );

  return {
    status: '302',
    statusDescription: 'Found',
    headers: {
      location: [{ key: 'Location', value: url.toString() }],
      'set-cookie': [{ key: 'Set-Cookie', value: pkceSetCookie }],
    },
  };
}

function errorResponse(): CloudFrontRequestResult {
  return {
    status: '502',
    statusDescription: 'Bad Gateway',
    headers: {
      'content-type': [{ key: 'Content-Type', value: 'text/plain' }],
    },
    body: 'Authentication failed. Please reload and try again.',
  };
}

function logAttribution(upn: string, sub: string, requestId: string): void {
  console.log(JSON.stringify({ upn, sub, requestId }));
}

export const handler = async (event: CloudFrontRequestEvent): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;
  const host = request.headers['host']?.[0]?.value ?? '';
  const requestId = event.Records[0].cf.config.requestId;

  let secrets: OidcSecrets;
  let config: Configuration;
  try {
    secrets = await getSecrets();
    config = await getConfig(secrets);
  } catch (err) {
    console.error('OIDC secrets/discovery fetch failed:', err);
    return errorResponse();
  }

  // Callback route — authorization-code exchange.
  if (request.uri === CALLBACK_PATH) {
    const params = new URLSearchParams(request.querystring);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      return redirectToLogin(host, '/', '', secrets, config);
    }

    const pkceCookieValue = parseCookies(request.headers)[PKCE_COOKIE_NAME];
    const pkce = pkceCookieValue ? verifyPkceCookie(pkceCookieValue, secrets.signingKey) : null;

    if (!pkce) {
      // Missing/malformed/tampered PKCE cookie: fail closed, restart Flow 1
      // (a fresh PKCE cookie below replaces the stale one).
      return redirectToLogin(host, '/', '', secrets, config);
    }

    const currentUrl = new URL(`https://${host}${CALLBACK_PATH}?${request.querystring}`);

    let tokens: Awaited<ReturnType<typeof authorizationCodeGrant>>;
    try {
      tokens = await authorizationCodeGrant(config, currentUrl, {
        pkceCodeVerifier: pkce.v,
        expectedState: pkce.s,
      });
    } catch (err) {
      if (err instanceof AuthorizationResponseError) {
        // State mismatch/replay/response validation failure — a CSRF-shaped
        // error, not a token-exchange failure. Fail closed, restart Flow 1,
        // same as the missing-PKCE-cookie case above.
        return redirectToLogin(host, '/', '', secrets, config);
      }
      console.error('Initial token exchange failed:', err);
      return errorResponse();
    }

    if (!tokens.refresh_token) {
      console.error('Token response missing refresh_token');
      return errorResponse();
    }

    // tokens.claims() returns the ID token's claims only after
    // authorizationCodeGrant has already verified its signature, issuer, and
    // audience internally — no separate verification step needed here.
    const identity = claimsToIdentity(tokens.claims());
    const exp = Math.floor(Date.now() / 1000) + (tokens.expiresIn() ?? 3600);
    const sessionPayload: SessionPayload = {
      rt: tokens.refresh_token,
      sub: identity.sub,
      upn: identity.upn,
      exp,
    };

    let sessionSetCookies: [string, string];
    try {
      sessionSetCookies = signSessionCookie(sessionPayload, secrets.signingKey);
    } catch (err) {
      console.error('Session cookie exceeded byte budget:', err);
      return errorResponse();
    }

    const redirectPath = sanitizeRedirectTarget(pkce.p);

    return {
      status: '302',
      statusDescription: 'Found',
      headers: {
        location: [{ key: 'Location', value: redirectPath }],
        'set-cookie': [
          ...sessionSetCookies.map((value) => ({ key: 'Set-Cookie', value })),
          { key: 'Set-Cookie', value: clearPkceCookie() },
        ],
      },
    };
  }

  // Steady-state: validate the session cookies (split across three — see
  // lib/cookie.ts — since the access and refresh tokens are each too large
  // to share a cookie with each other or with the identity claims). This
  // trusts the cookie's own HMAC rather than re-verifying anything against
  // Entra — the access token isn't a reliably verifiable JWS for this app's
  // scope (see Design.md deviation note / Post-Archival Incident), and the
  // ID token was already verified once, at issuance, above.
  const requestCookies = parseCookies(request.headers);
  const session = verifySessionCookie(
    requestCookies[REFRESH_COOKIE_NAME],
    requestCookies[IDENTITY_COOKIE_NAME],
    secrets.signingKey
  );
  if (!session) {
    return redirectToLogin(host, request.uri, request.querystring, secrets, config);
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (session.exp > nowSeconds) {
    logAttribution(session.upn, session.sub, requestId);
    // Don't forward the session cookie (raw access/refresh tokens) to the S3
    // origin — nothing downstream needs it, and leaving it in place risks it
    // landing in origin-side access logs.
    delete request.headers['cookie'];
    return request;
  }

  // Access token expired — attempt silent refresh (D4).
  let refreshed: Awaited<ReturnType<typeof refreshTokenGrant>>;
  try {
    refreshed = await refreshTokenGrant(config, session.rt);
  } catch (err) {
    console.error('Silent refresh failed, re-entering login flow:', err);
    return redirectToLogin(host, request.uri, request.querystring, secrets, config);
  }

  // Entra doesn't always re-issue an id_token on a refresh grant; when it
  // does, refreshTokenGrant already verified it the same way as the initial
  // exchange. When it doesn't, tokens.claims() returns undefined and we keep
  // the identity already established at initial login.
  const identity = claimsToIdentity(refreshed.claims(), session.sub, session.upn);
  const newExp = Math.floor(Date.now() / 1000) + (refreshed.expiresIn() ?? 3600);
  const newSessionPayload: SessionPayload = {
    rt: refreshed.refresh_token ?? session.rt,
    sub: identity.sub,
    upn: identity.upn,
    exp: newExp,
  };

  let updatedSetCookies: [string, string];
  try {
    updatedSetCookies = signSessionCookie(newSessionPayload, secrets.signingKey);
  } catch (err) {
    console.error('Refreshed session cookie exceeded byte budget:', err);
    return errorResponse();
  }

  logAttribution(newSessionPayload.upn, newSessionPayload.sub, requestId);

  // A Lambda@Edge viewer-request trigger can only modify the outgoing request
  // to origin, or short-circuit with a full response — it cannot both forward
  // to S3 *and* attach a Set-Cookie the browser will see in the same
  // response (that needs a viewer-response/origin-response association, which
  // this single-trigger design per Architecture.md does not use). A same-URI
  // redirect sets the refreshed cookie and immediately re-requests the page,
  // which then hits the steady-state branch above and passes through to S3 —
  // transparent to the user (D4), at the cost of one extra round trip rather
  // than a visible re-login.
  const target = request.querystring ? `${request.uri}?${request.querystring}` : request.uri;
  return {
    status: '302',
    statusDescription: 'Found',
    headers: {
      location: [{ key: 'Location', value: target }],
      'set-cookie': updatedSetCookies.map((value) => ({ key: 'Set-Cookie', value })),
    },
  };
};
