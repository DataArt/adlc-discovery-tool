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

const verifySignatureMock = vi.fn();
const getJwksMock = vi.fn();
vi.mock('./lib/jwks', () => ({
  getJwks: (...args: unknown[]) => getJwksMock(...args),
  verifySignature: (...args: unknown[]) => verifySignatureMock(...args),
}));

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

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
  verifySignatureMock.mockReset();
  verifySignatureMock.mockResolvedValue(true);
  getJwksMock.mockReset();
  getJwksMock.mockReturnValue('fake-jwks');
  fetchMock.mockReset();
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
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
      }),
    });
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
    const setCookies = getSetCookies(result);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_session='))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_refresh='))).toBe(true);
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
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'invalid_grant' }),
    });
    const event = cfEvent({
      uri: '/page',
      cookie: cookieHeader(setCookies),
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain('/authorize');
  });

  it('fails closed on an invalid JWT signature, even when not expired', async () => {
    const { handler } = await import('./handler-oidc');
    const { signSessionCookie } = await import('./lib/cookie');
    verifySignatureMock.mockResolvedValue(false);
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
    const event = cfEvent({
      uri: '/page',
      cookie: cookieHeader(setCookies),
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain('/authorize');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('handler-oidc: callback route', () => {
  async function pkceCookieFor(state: string, verifier = 'test-verifier') {
    const { signPkceCookie } = await import('./lib/cookie');
    const setCookie = signPkceCookie({ v: verifier, s: state }, SIGNING_KEY);
    return extractCookieValue(setCookie);
  }

  it('fails closed on a state mismatch, discarding the PKCE cookie and restarting Flow 1', async () => {
    const { handler } = await import('./handler-oidc');
    const pkceCookie = await pkceCookieFor('expected-state');
    const packedState = `wrong-state.${Buffer.from('/page', 'utf-8').toString('base64url')}`;
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${packedState}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toContain('/authorize');
    // A fresh PKCE cookie replaces the stale one.
    const setCookies = getSetCookies(result);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_pkce='))).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns an error response on initial token-exchange failure, no pass-through, no retry', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state';
    const pkceCookie = await pkceCookieFor(state);
    const packedState = `${state}.${Buffer.from('/page', 'utf-8').toString('base64url')}`;
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${packedState}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '502' });
  });

  it('falls back to / for a crafted absolute redirect target', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state-2';
    const pkceCookie = await pkceCookieFor(state);
    const packedState = `${state}.${Buffer.from('https://evil.com/phish', 'utf-8').toString('base64url')}`;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'at',
        refresh_token: 'rt',
        id_token: undefined,
        expires_in: 3600,
      }),
    });
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${packedState}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toBe('/');
  });

  it('falls back to / for a crafted protocol-relative redirect target', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state-3';
    const pkceCookie = await pkceCookieFor(state);
    const packedState = `${state}.${Buffer.from('//evil.com', 'utf-8').toString('base64url')}`;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'at', refresh_token: 'rt', expires_in: 3600 }),
    });
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${packedState}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(getLocation(result)).toBe('/');
  });

  it('completes Flow 1 on a successful exchange: sets session cookie, clears PKCE cookie, redirects to the original path', async () => {
    const { handler } = await import('./handler-oidc');
    const state = 'matching-state-4';
    const pkceCookie = await pkceCookieFor(state);
    const packedState = `${state}.${Buffer.from('/docs/intro', 'utf-8').toString('base64url')}`;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'at', refresh_token: 'rt', expires_in: 3600 }),
    });
    const event = cfEvent({
      uri: '/_auth/callback',
      querystring: `code=abc123&state=${packedState}`,
      cookie: `__Host-docs_pkce=${pkceCookie}`,
    });
    const result = await handler(event);
    expect(result).toMatchObject({ status: '302' });
    expect(getLocation(result)).toBe('/docs/intro');
    const setCookies = getSetCookies(result);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_session='))).toBe(true);
    expect(setCookies.some((c) => c.startsWith('__Host-docs_refresh='))).toBe(true);
    expect(
      setCookies.some((c) => c.startsWith('__Host-docs_pkce=') && c.includes('Max-Age=0'))
    ).toBe(true);
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
