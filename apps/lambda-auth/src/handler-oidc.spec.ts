import { randomBytes } from 'node:crypto';
import type { CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const SIGNING_KEY = randomBytes(32);
const SIGNING_KEY_B64 = SIGNING_KEY.toString('base64');
const CLIENT_ID = 'client-id-123';
const CLIENT_SECRET = 'client-secret-abc';
const TENANT_ID = 'tenant-id-xyz';
const HOST = 'd2dn3olm9x55r4.cloudfront.net';

const VALID_SECRET_PAYLOAD = JSON.stringify({
  OIDC_CLIENT_ID: CLIENT_ID,
  OIDC_CLIENT_SECRET: CLIENT_SECRET,
  OIDC_TENANT_ID: TENANT_ID,
  OIDC_SESSION_SIGNING_KEY: SIGNING_KEY_B64,
});

const sendMock = vi.fn();
vi.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: vi.fn().mockImplementation(function () {
    return { send: sendMock };
  }),
  GetSecretValueCommand: vi.fn(function (input: unknown) {
    return input;
  }),
}));

class MockAuthorizationResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationResponseError';
  }
}

const discoveryMock = vi.fn();
const buildAuthorizationUrlMock = vi.fn();
const authorizationCodeGrantMock = vi.fn();
const refreshTokenGrantMock = vi.fn();
const calculatePKCECodeChallengeMock = vi.fn();
const randomPKCECodeVerifierMock = vi.fn();
const randomStateMock = vi.fn();

vi.mock('openid-client', () => ({
  AuthorizationResponseError: MockAuthorizationResponseError,
  discovery: (...args: unknown[]) => discoveryMock(...args),
  buildAuthorizationUrl: (...args: unknown[]) => buildAuthorizationUrlMock(...args),
  authorizationCodeGrant: (...args: unknown[]) => authorizationCodeGrantMock(...args),
  refreshTokenGrant: (...args: unknown[]) => refreshTokenGrantMock(...args),
  calculatePKCECodeChallenge: (...args: unknown[]) => calculatePKCECodeChallengeMock(...args),
  randomPKCECodeVerifier: (...args: unknown[]) => randomPKCECodeVerifierMock(...args),
  randomState: (...args: unknown[]) => randomStateMock(...args),
}));

/** Builds a fake `openid-client` token-endpoint response, matching the shape
 * `authorizationCodeGrant`/`refreshTokenGrant` resolve to — raw fields plus
 * the `claims()`/`expiresIn()` helper methods the real library attaches. */
function tokenResponse(opts: {
  access_token?: string;
  refresh_token?: string;
  claims?: Record<string, unknown> | undefined;
  expiresIn?: number;
}) {
  const {
    access_token = 'at',
    refresh_token = 'rt',
    claims = { sub: 'user-1', upn: 'jane@dataart.com' },
    expiresIn = 3600,
  } = opts;
  return {
    access_token,
    refresh_token,
    claims: () => claims,
    expiresIn: () => expiresIn,
  };
}

function cfEvent(opts: {
  uri?: string;
  querystring?: string;
  cookie?: string;
  host?: string;
}): CloudFrontRequestEvent {
  const { uri = '/page', querystring = '', cookie, host = HOST } = opts;
  const headers: Record<string, { key: string; value: string }[]> = {
    host: [{ key: 'Host', value: host }],
  };
  if (cookie) headers.cookie = [{ key: 'Cookie', value: cookie }];
  return {
    Records: [
      {
        cf: {
          config: {
            distributionDomainName: HOST,
            distributionId: 'DIST123',
            eventType: 'viewer-request',
            requestId: 'req-abc-123',
          },
          request: { uri, querystring, headers, method: 'GET', clientIp: '1.2.3.4' },
        },
      },
    ],
  } as unknown as CloudFrontRequestEvent;
}

function getSetCookies(result: CloudFrontRequestResult): string[] {
  const headers = (result as { headers?: Record<string, { value: string }[]> }).headers;
  return headers?.['set-cookie']?.map((h) => h.value) ?? [];
}

function getLocation(result: CloudFrontRequestResult): string | undefined {
  const headers = (result as { headers?: Record<string, { value: string }[]> }).headers;
  return headers?.['location']?.[0]?.value;
}

function extractCookieValue(setCookie: string): string {
  const eq = setCookie.indexOf('=');
  const semi = setCookie.indexOf(';');
  return setCookie.slice(eq + 1, semi < 0 ? undefined : semi);
}

/** Builds a request `Cookie:` header value from one or more `Set-Cookie`
 * strings (e.g. the tuple `signSessionCookie` returns). */
function cookieHeader(setCookies: string[]): string {
  return setCookies.map((sc) => sc.split(';')[0]).join('; ');
}

beforeEach(() => {
  vi.resetModules();
  sendMock.mockReset();
  sendMock.mockResolvedValue({ SecretString: VALID_SECRET_PAYLOAD });

  discoveryMock.mockReset();
  discoveryMock.mockResolvedValue('fake-config');

  buildAuthorizationUrlMock.mockReset();
  buildAuthorizationUrlMock.mockImplementation(
    (_config: unknown, params: Record<string, string>) => {
      const url = new URL(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`);
      for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
      return url;
    }
  );

  authorizationCodeGrantMock.mockReset();
  authorizationCodeGrantMock.mockResolvedValue(tokenResponse({}));

  refreshTokenGrantMock.mockReset();
  refreshTokenGrantMock.mockResolvedValue(
    tokenResponse({ access_token: 'new-access-token', refresh_token: 'new-refresh-token' })
  );

  calculatePKCECodeChallengeMock.mockReset();
  calculatePKCECodeChallengeMock.mockResolvedValue('fake-challenge');

  randomPKCECodeVerifierMock.mockReset();
  randomPKCECodeVerifierMock.mockReturnValue('fake-verifier');

  randomStateMock.mockReset();
  randomStateMock.mockReturnValue('fake-state');
});

describe('handler-oidc: missing/malformed session cookie', () => {
  it('redirects to /authorize when no session cookie is present', async () => {
    const { handler } = await import('./handler-oidc');
    const result = await handler(cfEvent({ uri: '/page' }));
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain(
      `login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`
    );
    const setCookies = getSetCookies(result);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_pkce='))).toBe(true);
  });

  it('redirects to /authorize when the session cookie is malformed', async () => {
    const { handler } = await import('./handler-oidc');
    const result = await handler(
      cfEvent({ uri: '/page', cookie: '__Host-docs_session=not-a-valid-token' })
    );
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain('/authorize');
  });
});

describe('handler-oidc: steady state and silent refresh', () => {
  it('passes through unchanged for a valid, unexpired session', async () => {
    const { handler } = await import('./handler-oidc');
    const { signSessionCookie } = await import('./lib/cookie');
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const setCookies = signSessionCookie(
      {
        at: 'access-token',
        rt: 'refresh-token',
        sub: 'user-1',
        upn: 'jane@dataart.com',
        exp: futureExp,
      },
      SIGNING_KEY
    );
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const event = cfEvent({
      uri: '/page',
      cookie: cookieHeader(setCookies),
    });
    const result = await handler(event);
    expect(result).toBe(event.Records[0].cf.request);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('jane@dataart.com'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('req-abc-123'));
    // The session cookie (raw access/refresh tokens) must not be forwarded to
    // the S3 origin.
    expect((result as { headers: Record<string, unknown> }).headers['cookie']).toBeUndefined();
    // Steady-state trusts the cookie's own HMAC — no Entra round-trip needed.
    expect(authorizationCodeGrantMock).not.toHaveBeenCalled();
    expect(refreshTokenGrantMock).not.toHaveBeenCalled();
  });

  it('silently refreshes an expired access token and redirects to the same URI with an updated Set-Cookie (no visible re-login)', async () => {
    const { handler } = await import('./handler-oidc');
    const { signSessionCookie } = await import('./lib/cookie');
    const pastExp = Math.floor(Date.now() / 1000) - 10;
    const sessionSetCookies = signSessionCookie(
      {
        at: 'old-access-token',
        rt: 'valid-refresh-token',
        sub: 'user-1',
        upn: 'jane@dataart.com',
        exp: pastExp,
      },
      SIGNING_KEY
    );
    const event = cfEvent({
      uri: '/page',
      querystring: 'x=1',
      cookie: cookieHeader(sessionSetCookies),
    });
    const result = await handler(event);
    // D4: no visible re-login. Note: this redirects to the same URI rather than
    // literally "passing through" — a CloudFront viewer-request trigger cannot
    // attach a Set-Cookie to a response it also forwards to origin (see the
    // implementation comment in handler-oidc.ts). The redirect is instant and
    // transparent, satisfying D4's intent without a second user-visible login.
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toBe('/page?x=1');
    expect(refreshTokenGrantMock).toHaveBeenCalledWith('fake-config', 'valid-refresh-token');
    const setCookies = getSetCookies(result);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_session='))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_refresh='))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_identity='))).toBe(true);
  });

  it('re-enters Flow 1 when the refresh token is expired/invalid', async () => {
    const { handler } = await import('./handler-oidc');
    const { signSessionCookie } = await import('./lib/cookie');
    const pastExp = Math.floor(Date.now() / 1000) - 10;
    const setCookies = signSessionCookie(
      {
        at: 'old-access-token',
        rt: 'expired-refresh-token',
        sub: 'user-1',
        upn: 'jane@dataart.com',
        exp: pastExp,
      },
      SIGNING_KEY
    );
    refreshTokenGrantMock.mockRejectedValueOnce(new Error('invalid_grant'));
    const event = cfEvent({
      uri: '/page',
      cookie: cookieHeader(setCookies),
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain('/authorize');
  });

  it('passes through on a valid, non-expired session without ever contacting Entra (opaque Graph access token)', async () => {
    // Entra's access token for this app is not guaranteed to be a verifiable
    // JWS (Microsoft Graph tokens may be opaque) — steady-state trusts the
    // session cookie's own HMAC instead of re-verifying anything against
    // Entra on every request. Signature verification only ever happens once,
    // at token issuance, internally inside authorizationCodeGrant/
    // refreshTokenGrant against the ID token.
    const { handler } = await import('./handler-oidc');
    const { signSessionCookie } = await import('./lib/cookie');
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const setCookies = signSessionCookie(
      {
        at: 'opaque-access-token',
        rt: 'refresh-token',
        sub: 'user-1',
        upn: 'jane@dataart.com',
        exp: futureExp,
      },
      SIGNING_KEY
    );
    const event = cfEvent({
      uri: '/page',
      cookie: cookieHeader(setCookies),
    });
    const result = await handler(event);
    expect(result).toMatchObject({ uri: '/page' });
    expect(authorizationCodeGrantMock).not.toHaveBeenCalled();
    expect(refreshTokenGrantMock).not.toHaveBeenCalled();
  });

  it('fails closed when the session cookie trio is tampered, even when not expired', async () => {
    const { handler } = await import('./handler-oidc');
    const { signSessionCookie } = await import('./lib/cookie');
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const setCookies = signSessionCookie(
      {
        at: 'tampered-access-token',
        rt: 'refresh-token',
        sub: 'user-1',
        upn: 'jane@dataart.com',
        exp: futureExp,
      },
      SIGNING_KEY
    );
    const [accessCookie, refreshCookie, identityCookie] = setCookies;
    const tamperedAccessCookie = accessCookie.replace(/^([^=]+)=[^;]+/, '$1=tampered.value');
    const event = cfEvent({
      uri: '/page',
      cookie: cookieHeader([tamperedAccessCookie, refreshCookie, identityCookie]),
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain('/authorize');
    expect(refreshTokenGrantMock).not.toHaveBeenCalled();
  });
});

describe('handler-oidc: callback route', () => {
  async function pkceCookieFor(state: string, verifier = 'test-verifier', redirectPath = '/page') {
    const { signPkceCookie } = await import('./lib/cookie');
    const setCookie = signPkceCookie({ v: verifier, s: state, p: redirectPath }, SIGNING_KEY);
    return extractCookieValue(setCookie);
  }

  it('redirects to /authorize restarting Flow 1 when the PKCE cookie is missing', async () => {
    const { handler } = await import('./handler-oidc');
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=some-state`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain('/authorize');
    expect(authorizationCodeGrantMock).not.toHaveBeenCalled();
  });

  it('fails closed restarting Flow 1 when authorizationCodeGrant rejects with AuthorizationResponseError (state/response validation failure)', async () => {
    const { handler } = await import('./handler-oidc');
    const pkceCookie = await pkceCookieFor('expected-state');
    authorizationCodeGrantMock.mockRejectedValueOnce(
      new MockAuthorizationResponseError('state mismatch')
    );
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=expected-state`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain('/authorize');
    // A fresh PKCE cookie replaces the stale one.
    const setCookies = getSetCookies(result);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_pkce='))).toBe(true);
  });

  it('returns an error response on initial token-exchange failure, no pass-through, no retry', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state';
    const pkceCookie = await pkceCookieFor(state);
    authorizationCodeGrantMock.mockRejectedValueOnce(new Error('network error'));
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${state}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '502' });
  });

  it('falls back to / for a crafted absolute redirect target stored in the PKCE cookie', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state-2';
    const pkceCookie = await pkceCookieFor(state, 'test-verifier', 'https://evil.com/phish');
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${state}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toBe('/');
  });

  it('falls back to / for a crafted protocol-relative redirect target stored in the PKCE cookie', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state-3';
    const pkceCookie = await pkceCookieFor(state, 'test-verifier', '//evil.com');
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${state}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(getLocation(result)).toBe('/');
  });

  it('completes Flow 1 on a successful exchange: sets session cookie, clears PKCE cookie, redirects to the original path', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state-4';
    const pkceCookie = await pkceCookieFor(state, 'test-verifier', '/docs/intro');
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${state}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(authorizationCodeGrantMock).toHaveBeenCalledWith('fake-config', expect.any(URL), {
      pkceCodeVerifier: 'test-verifier',
      expectedState: state,
    });
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toBe('/docs/intro');
    const setCookies = getSetCookies(result);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_session='))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_refresh='))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_identity='))).toBe(true);
    expect(
      setCookies.some((c) => c.startsWith('__Host-docs_pkce=') && c.includes('Max-Age=0'))
    ).toBe(true);
  });

  it('returns an error response when the token response is missing a refresh_token', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state-5';
    const pkceCookie = await pkceCookieFor(state);
    authorizationCodeGrantMock.mockResolvedValueOnce({
      access_token: 'at',
      refresh_token: undefined,
      claims: () => ({ sub: 'user-1', upn: 'jane@dataart.com' }),
      expiresIn: () => 3600,
    });
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${state}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '502' });
  });
});

describe('handler-oidc: cold-start secret validation', () => {
  it('fails closed when OIDC_CLIENT_SECRET is missing/malformed', async () => {
    sendMock.mockResolvedValue({
      SecretString: JSON.stringify({ OIDC_CLIENT_ID: CLIENT_ID, OIDC_TENANT_ID: TENANT_ID }),
    });
    const { handler } = await import('./handler-oidc');
    const result = await handler(cfEvent({ uri: '/page' }));
    expect(result).toMatchObject({ status: '502' });
    expect(discoveryMock).not.toHaveBeenCalled();
  });

  it('fails closed when discovery() rejects', async () => {
    discoveryMock.mockRejectedValueOnce(new Error('metadata fetch failed'));
    const { handler } = await import('./handler-oidc');
    const result = await handler(cfEvent({ uri: '/page' }));
    expect(result).toMatchObject({ status: '502' });
  });
});

describe('handler-oidc: cookie attributes', () => {
  it('sets HttpOnly, Secure, SameSite=Lax on every Set-Cookie, and Max-Age=600 on the PKCE cookie', async () => {
    const { handler } = await import('./handler-oidc');
    const result = await handler(cfEvent({ uri: '/page' }));
    const setCookies = getSetCookies(result);
    expect(setCookies.length).toBeGreaterThan(0);
    for (const cookie of setCookies) {
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('Secure');
      expect(cookie).toContain('SameSite=Lax');
    }
    const pkceCookie = setCookies.find((c) => c.startsWith('__Host-docs_pkce='));
    expect(pkceCookie).toContain('Max-Age=600');
  });
});
