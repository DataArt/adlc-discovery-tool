/**
 * Validates a post-login redirect target as a same-origin relative path (D2's
 * open-redirect fix). Anything else — absolute URLs, protocol-relative URLs,
 * backslash tricks, or a missing value — falls back to the site root.
 */
export function sanitizeRedirectTarget(candidate?: string): string {
  if (!candidate) return '/';
  // Reject anything that isn't a single leading slash followed by a non-slash,
  // non-backslash character (or nothing) — this excludes protocol-relative
  // (`//host`), backslash variants (`/\evil.com`, used by some browsers as a
  // slash equivalent), and absolute URLs (which never start with `/`).
  if (!/^\/(?!\/|\\)/.test(candidate)) return '/';
  // Reject embedded control characters (CR, LF, NUL, and other C0 controls) —
  // this value flows directly into a `Location` response header, so an
  // unfiltered CR/LF would allow header/response-splitting.
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f\x7f]/.test(candidate)) return '/';
  return candidate;
}
