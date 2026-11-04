import { describe, expect, it } from 'vitest';
import { sanitizeRedirectTarget } from './redirect';

describe('sanitizeRedirectTarget', () => {
  it('passes through a valid relative path', () => {
    expect(sanitizeRedirectTarget('/docs/intro')).toBe('/docs/intro');
  });

  it('passes through the root path', () => {
    expect(sanitizeRedirectTarget('/')).toBe('/');
  });

  it('rejects an absolute URL', () => {
    expect(sanitizeRedirectTarget('https://evil.com/phish')).toBe('/');
  });

  it('rejects a protocol-relative URL', () => {
    expect(sanitizeRedirectTarget('//evil.com')).toBe('/');
  });

  it('rejects a backslash variant', () => {
    expect(sanitizeRedirectTarget('/\\evil.com')).toBe('/');
  });

  it('rejects a path with no leading slash', () => {
    expect(sanitizeRedirectTarget('evil.com')).toBe('/');
  });

  it('rejects an embedded CRLF (header-injection attempt)', () => {
    expect(sanitizeRedirectTarget('/page\r\nSet-Cookie: evil=1')).toBe('/');
  });

  it('rejects an embedded NUL byte', () => {
    expect(sanitizeRedirectTarget('/page\x00ignored')).toBe('/');
  });

  it('rejects an empty string', () => {
    expect(sanitizeRedirectTarget('')).toBe('/');
  });

  it('rejects undefined', () => {
    expect(sanitizeRedirectTarget(undefined)).toBe('/');
  });
});
