import { SignJWT, createLocalJWKSet, exportJWK, generateKeyPair } from 'jose';
import { beforeAll, describe, expect, it } from 'vitest';
import { verifySignature } from './jwks';

describe('verifySignature', () => {
  let goodJwks: ReturnType<typeof createLocalJWKSet>;
  let otherJwks: ReturnType<typeof createLocalJWKSet>;
  let validToken: string;
  let wrongKeyToken: string;

  beforeAll(async () => {
    const { publicKey, privateKey } = await generateKeyPair('RS256');
    const { publicKey: otherPublicKey, privateKey: otherPrivateKey } =
      await generateKeyPair('RS256');

    const jwk = { ...(await exportJWK(publicKey)), kid: 'key-1', alg: 'RS256', use: 'sig' };
    const otherJwk = {
      ...(await exportJWK(otherPublicKey)),
      kid: 'key-2',
      alg: 'RS256',
      use: 'sig',
    };

    goodJwks = createLocalJWKSet({ keys: [jwk] });
    otherJwks = createLocalJWKSet({ keys: [otherJwk] });

    validToken = await new SignJWT({ sub: 'user-1' })
      .setProtectedHeader({ alg: 'RS256', kid: 'key-1' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(privateKey);

    wrongKeyToken = await new SignJWT({ sub: 'user-1' })
      .setProtectedHeader({ alg: 'RS256', kid: 'key-2' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(otherPrivateKey);
  });

  it('accepts a validly-signed token against its own JWKS', async () => {
    await expect(verifySignature(validToken, goodJwks)).resolves.toBe(true);
  });

  it('rejects a token signed with a different key (wrong kid)', async () => {
    await expect(verifySignature(wrongKeyToken, goodJwks)).resolves.toBe(false);
  });

  it('rejects a tampered token', async () => {
    const tampered = validToken.slice(0, -2) + 'xx';
    await expect(verifySignature(tampered, goodJwks)).resolves.toBe(false);
  });

  it('rejects a well-formed-but-garbage token', async () => {
    await expect(verifySignature('not.a.jwt', goodJwks)).resolves.toBe(false);
  });

  it('accepts a different valid token against its matching JWKS', async () => {
    await expect(verifySignature(wrongKeyToken, otherJwks)).resolves.toBe(true);
  });
});
