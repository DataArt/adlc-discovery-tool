import { createHash } from 'node:crypto';
import type { CloudFrontRequestEvent } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const PASSWORD = 'correct-horse-battery-staple';
const STORED_HASH = createHash('sha256').update(PASSWORD).digest('hex');

const sendMock = vi.fn();

vi.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: vi.fn().mockImplementation(() => ({ send: sendMock })),
  GetSecretValueCommand: vi.fn((input: unknown) => input),
}));

function basicAuthHeader(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

function cfEvent(authHeader?: string): CloudFrontRequestEvent {
  return {
    Records: [
      {
        cf: {
          request: {
            headers: authHeader
              ? { authorization: [{ key: 'Authorization', value: authHeader }] }
              : {},
          },
        },
      },
    ],
  } as unknown as CloudFrontRequestEvent;
}

beforeEach(() => {
  vi.resetModules();
  sendMock.mockReset();
});

describe('lambda-auth handler', () => {
  it('rejects requests with no Authorization header', async () => {
    const { handler } = await import('./handler');
    const result = await handler(cfEvent());
    expect(result).toMatchObject({ status: '401' });
  });

  it('rejects non-Basic auth schemes', async () => {
    const { handler } = await import('./handler');
    const result = await handler(cfEvent('Bearer sometoken'));
    expect(result).toMatchObject({ status: '401' });
  });

  it('rejects malformed Basic credentials with no colon', async () => {
    const { handler } = await import('./handler');
    const header = `Basic ${Buffer.from('nocolonhere').toString('base64')}`;
    const result = await handler(cfEvent(header));
    expect(result).toMatchObject({ status: '401' });
  });

  it('rejects an incorrect password', async () => {
    sendMock.mockResolvedValue({
      SecretString: JSON.stringify({ DOCS_BASIC_AUTH_HASH: STORED_HASH }),
    });
    const { handler } = await import('./handler');
    const result = await handler(cfEvent(basicAuthHeader('user', 'wrong-password')));
    expect(result).toMatchObject({ status: '401' });
  });

  it('passes the original request through on a correct password', async () => {
    sendMock.mockResolvedValue({
      SecretString: JSON.stringify({ DOCS_BASIC_AUTH_HASH: STORED_HASH }),
    });
    const { handler } = await import('./handler');
    const event = cfEvent(basicAuthHeader('user', PASSWORD));
    const result = await handler(event);
    expect(result).toBe(event.Records[0].cf.request);
  });

  it('rejects when the Secrets Manager lookup fails', async () => {
    sendMock.mockRejectedValue(new Error('boom'));
    const { handler } = await import('./handler');
    const result = await handler(cfEvent(basicAuthHeader('user', PASSWORD)));
    expect(result).toMatchObject({ status: '401' });
  });

  it('rejects a malformed stored hash instead of throwing', async () => {
    sendMock.mockResolvedValue({
      SecretString: JSON.stringify({ DOCS_BASIC_AUTH_HASH: 'not-a-hex-hash' }),
    });
    const { handler } = await import('./handler');
    const result = await handler(cfEvent(basicAuthHeader('user', PASSWORD)));
    expect(result).toMatchObject({ status: '401' });
  });
});
