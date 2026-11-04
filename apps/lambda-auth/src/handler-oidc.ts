import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import type {
  CloudFrontHeaders,
  CloudFrontRequestEvent,
  CloudFrontRequestResult,
} from 'aws-lambda';
import { decodeJwt } from 'jose';
import {
  IDENTITY_COOKIE_NAME,
  PKCE_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  type SessionPayload,
  clearPkceCookie,
  signPkceCookie,
  signSessionCookie,
  verifyPkceCookie,
  verifySessionCookie,
} from './lib/cookie';
import { getJwks, verifySignature } from './lib/jwks';
import { generatePkce, validateState } from './lib/pkce';
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

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
}

interface Claims {
  sub?: string;
  upn?: string;
  preferred_username?: string;
  email?: string;
}

// Cached per cold start, mirroring handler-basic.ts's cachedHash pattern.
let cachedSecrets: OidcSecrets | null = null;

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

function authorizeUrl(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
}

function tokenUrl(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
}

function jwksUrl(tenantId: string): string {
  return `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
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

function decodeClaims(token: string): Claims {
  try {
    return decodeJwt(token) as Claims;
  } catch {
    return {};
  }
}

function claimsToIdentity(claims: Claims, fallbackSub = '', fallbackUpn = '') {
  return {
    sub: claims.sub ?? fallbackSub,
    upn: claims.upn ?? claims.preferred_username ?? claims.email ?? fallbackUpn,
  };
}

async function exchangeCodeForTokens(
  code: string,
  verifier: string,
  redirectUri: string,
  secrets: OidcSecrets
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: secrets.clientId,
    client_secret: secrets.clientSecret,
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
    scope: SCOPE,
  });
  const response = await fetch(tokenUrl(secrets.tenantId), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!response.ok) throw new Error(`Token exchange failed with status ${response.status}`);
  const json = (await response.json()) as TokenResponse;
  if (!json.access_token || !json.refresh_token) throw new Error('Malformed token response');
  return json;
}

async function refreshTokens(refreshToken: string, secrets: OidcSecrets): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: secrets.clientId,
    client_secret: secrets.clientSecret,
    refresh_token: refreshToken,
    scope: SCOPE,
  });
  const response = await fetch(tokenUrl(secrets.tenantId), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!response.ok) throw new Error(`Refresh failed with status ${response.status}`);
  const json = (await response.json()) as TokenResponse;
  if (!json.access_token) throw new Error('Malformed refresh response');
  return json;
}

function redirectToLogin(
  host: string,
  originalUri: string,
  originalQuerystring: string,
  secrets: OidcSecrets
): CloudFrontRequestResult {
  const { verifier, challenge, state } = generatePkce();
  const originalPath = originalQuerystring ? `${originalUri}?${originalQuerystring}` : originalUri;
  const packedState = `${state}.${Buffer.from(originalPath, 'utf-8').toString('base64url')}`;
  const redirectUri = `https://${host}${CALLBACK_PATH}`;

  const url = new URL(authorizeUrl(secrets.tenantId));
  url.searchParams.set('client_id', secrets.clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_mode', 'query');
  url.searchParams.set('scope', SCOPE);
  url.searchParams.set('state', packedState);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  const pkceSetCookie = signPkceCookie({ v: verifier, s: state }, secrets.signingKey);

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
  try {
    secrets = await getSecrets();
  } catch (err) {
    console.error('OIDC secrets fetch failed:', err);
    return errorResponse();
  }

  // Callback route — authorization-code exchange.
  if (request.uri === CALLBACK_PATH) {
    const params = new URLSearchParams(request.querystring);
    const code = params.get('code');
    const receivedState = params.get('state');

    if (!code || !receivedState) {
      return redirectToLogin(host, '/', '', secrets);
    }

    const [receivedStatePart, encodedPath] = receivedState.split('.');
    const pkceCookieValue = parseCookies(request.headers)[PKCE_COOKIE_NAME];
    const pkce = pkceCookieValue ? verifyPkceCookie(pkceCookieValue, secrets.signingKey) : null;

    if (!pkce || !validateState(pkce.s, receivedStatePart)) {
      // CSRF/state-replay failure: fail closed, restart Flow 1 (a fresh PKCE
      // cookie below replaces the stale one).
      return redirectToLogin(host, '/', '', secrets);
    }

    let tokens: TokenResponse;
    try {
      tokens = await exchangeCodeForTokens(
        code,
        pkce.v,
        `https://${host}${CALLBACK_PATH}`,
        secrets
      );
    } catch (err) {
      console.error('Initial token exchange failed:', err);
      return errorResponse();
    }

    const claims = decodeClaims(tokens.id_token ?? tokens.access_token);
    const identity = claimsToIdentity(claims);
    const exp = Math.floor(Date.now() / 1000) + (tokens.expires_in ?? 3600);
    const sessionPayload: SessionPayload = {
      at: tokens.access_token,
      rt: tokens.refresh_token!,
      sub: identity.sub,
      upn: identity.upn,
      exp,
    };

    let sessionSetCookies: [string, string, string];
    try {
      sessionSetCookies = signSessionCookie(sessionPayload, secrets.signingKey);
    } catch (err) {
      console.error('Session cookie exceeded byte budget:', err);
      return errorResponse();
    }

    let redirectPath = '/';
    if (encodedPath) {
      try {
        redirectPath = sanitizeRedirectTarget(
          Buffer.from(encodedPath, 'base64url').toString('utf-8')
        );
      } catch {
        redirectPath = '/';
      }
    }

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
  // to share a cookie with each other or with the identity claims).
  const requestCookies = parseCookies(request.headers);
  const session = verifySessionCookie(
    requestCookies[SESSION_COOKIE_NAME],
    requestCookies[REFRESH_COOKIE_NAME],
    requestCookies[IDENTITY_COOKIE_NAME],
    secrets.signingKey
  );
  if (!session) {
    return redirectToLogin(host, request.uri, request.querystring, secrets);
  }

  const jwks = getJwks(jwksUrl(secrets.tenantId));
  const signatureValid = await verifySignature(
    session.at,
    jwks,
    `https://login.microsoftonline.com/${secrets.tenantId}/v2.0`
  );
  if (!signatureValid) {
    // Fail closed — tampered, wrong kid, wrong issuer, or JWKS rotation
    // mismatch. Never passed through, never silently retried (D3).
    return redirectToLogin(host, request.uri, request.querystring, secrets);
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
  let refreshed: TokenResponse;
  try {
    refreshed = await refreshTokens(session.rt, secrets);
  } catch (err) {
    console.error('Silent refresh failed, re-entering login flow:', err);
    return redirectToLogin(host, request.uri, request.querystring, secrets);
  }

  const claims = decodeClaims(refreshed.id_token ?? refreshed.access_token);
  const identity = claimsToIdentity(claims, session.sub, session.upn);
  const newExp = Math.floor(Date.now() / 1000) + (refreshed.expires_in ?? 3600);
  const newSessionPayload: SessionPayload = {
    at: refreshed.access_token,
    rt: refreshed.refresh_token ?? session.rt,
    sub: identity.sub,
    upn: identity.upn,
    exp: newExp,
  };

  let updatedSetCookies: [string, string, string];
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
