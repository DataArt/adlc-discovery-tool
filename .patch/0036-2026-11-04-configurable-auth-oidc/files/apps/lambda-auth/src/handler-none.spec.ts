import type { CloudFrontRequestEvent } from 'aws-lambda';
import { describe, expect, it } from 'vitest';
import { handler } from './handler-none';

function cfEvent(
  headers: Record<string, { key: string; value: string }[]> = {}
): CloudFrontRequestEvent {
  return {
    Records: [{ cf: { request: { headers } } }],
  } as unknown as CloudFrontRequestEvent;
}

describe('handler-none', () => {
  it('passes through a request with no headers', async () => {
    const event = cfEvent();
    const result = await handler(event);
    expect(result).toBe(event.Records[0].cf.request);
  });

  it('passes through a request with an Authorization header, unmodified', async () => {
    const event = cfEvent({ authorization: [{ key: 'Authorization', value: 'Basic abc' }] });
    const result = await handler(event);
    expect(result).toBe(event.Records[0].cf.request);
  });

  it('passes through a request with a session cookie, unmodified', async () => {
    const event = cfEvent({ cookie: [{ key: 'Cookie', value: '__Host-docs_session=abc' }] });
    const result = await handler(event);
    expect(result).toBe(event.Records[0].cf.request);
  });
});
