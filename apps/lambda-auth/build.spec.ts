import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const buildMock = vi.fn();

vi.mock('esbuild', () => ({
  build: (...args: unknown[]) => buildMock(...args),
}));

const BASE_ENV = {
  SM_SECRET_NAME: 'test/secret',
  AWS_REGION: 'us-east-1',
};

let originalEnv: NodeJS.ProcessEnv;

beforeEach(() => {
  originalEnv = process.env;
  process.env = { ...BASE_ENV };
  vi.resetModules();
  buildMock.mockReset();
  buildMock.mockResolvedValue(undefined);
});

afterEach(() => {
  process.env = originalEnv;
});

describe('resolveAuthMode', () => {
  it('defaults to basic when unset', async () => {
    const { resolveAuthMode } = await import('./build');
    expect(resolveAuthMode(undefined)).toBe('basic');
  });

  it('accepts none/basic/oidc', async () => {
    const { resolveAuthMode } = await import('./build');
    expect(resolveAuthMode('none')).toBe('none');
    expect(resolveAuthMode('basic')).toBe('basic');
    expect(resolveAuthMode('oidc')).toBe('oidc');
  });

  it('throws on an invalid value', async () => {
    const { resolveAuthMode } = await import('./build');
    expect(() => resolveAuthMode('bogus')).toThrow(/AUTH_MODE must be one of/);
  });
});

describe('build.ts module (AUTH_MODE selection + warning)', () => {
  it('unset AUTH_MODE selects handler-basic.ts, no warning', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    await import('./build');
    expect(buildMock).toHaveBeenCalledWith(
      expect.objectContaining({ entryPoints: ['src/handler-basic.ts'] })
    );
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('AUTH_MODE=none selects handler-none.ts and prints the no-access-control warning', async () => {
    process.env.AUTH_MODE = 'none';
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    await import('./build');
    expect(buildMock).toHaveBeenCalledWith(
      expect.objectContaining({ entryPoints: ['src/handler-none.ts'] })
    );
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('NO access control'));
  });

  it('AUTH_MODE=basic selects handler-basic.ts, no warning', async () => {
    process.env.AUTH_MODE = 'basic';
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    await import('./build');
    expect(buildMock).toHaveBeenCalledWith(
      expect.objectContaining({ entryPoints: ['src/handler-basic.ts'] })
    );
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('AUTH_MODE=oidc selects handler-oidc.ts, no warning', async () => {
    process.env.AUTH_MODE = 'oidc';
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    await import('./build');
    expect(buildMock).toHaveBeenCalledWith(
      expect.objectContaining({ entryPoints: ['src/handler-oidc.ts'] })
    );
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('an invalid AUTH_MODE throws before esbuild.build is ever called', async () => {
    process.env.AUTH_MODE = 'bogus';
    await expect(import('./build')).rejects.toThrow(/AUTH_MODE must be one of/);
    expect(buildMock).not.toHaveBeenCalled();
  });

  it('keeps @aws-sdk/client-secrets-manager external and injects SM_SECRET_NAME/AWS_REGION for every mode', async () => {
    await import('./build');
    expect(buildMock).toHaveBeenCalledWith(
      expect.objectContaining({
        external: ['@aws-sdk/client-secrets-manager'],
        define: {
          'process.env.SM_SECRET_NAME': JSON.stringify(BASE_ENV.SM_SECRET_NAME),
          'process.env.AWS_REGION': JSON.stringify(BASE_ENV.AWS_REGION),
        },
      })
    );
  });
});
