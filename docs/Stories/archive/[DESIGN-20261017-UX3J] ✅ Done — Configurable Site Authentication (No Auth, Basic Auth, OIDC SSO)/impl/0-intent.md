# DESIGN-20261017-UX3J: Configurable Site Authentication — Intent

| Field   | Value                |
| ------- | -------------------- |
| Ticket  | DESIGN-20261017-UX3J |
| Created | 2026-11-03           |

## Problem

The docs site today has a single hardcoded Basic Auth handler with no per-user
identity, attribution, or password policy (BSIMM findings). The approved design
(`solution/Architecture.md` D1–D10) specifies a deploy-time-configurable `AUTH_MODE`
(`none`/`basic`/`oidc`) so each deployed instance can run no auth, the existing
shared-password Basic Auth, or direct Entra ID OIDC SSO with per-user identity,
silent refresh, and attribution logging — without shipping dead auth-protocol code
for modes an instance doesn't use.

Separately, Entra ID app registrations now exist for two instances: the canonical
(template) `[DataArt] [Prod] ADLC_Discovery_Tool` and the Collinson instance
`[DataArt] [Prod] ADLC_Discovery_Tool_Collinson`. This repo is the canonical
instance.

## Proposed outcome

1. `apps/lambda-auth` implements all three modes exactly per `solution/Design.md`:
   `handler-none.ts`, `handler-basic.ts` (relocated, unchanged behavior),
   `handler-oidc.ts` (full OIDC flow), and shared `lib/` (cookie, jwks, pkce,
   redirect). `build.ts` selects the entry point via `AUTH_MODE`, defaulting to
   `basic` when unset (migration-safe default, per D1), with a stdout warning on
   `AUTH_MODE=none` (D10).
2. Full verification coverage per Design.md's obligations table (one test per
   error-handling row, cookie/JWKS/PKCE unit tests, build.ts selection tests).
3. This canonical repo is configured to default to `AUTH_MODE=oidc`, wired to the
   canonical Entra app registration (`3a5f31e9-f173-4f57-9caa-17cff938af2f`, tenant
   `e26666fd-a875-4064-b4ca-775ea917529a`), with real secrets placed only in the
   gitignored `.secrets.dev` and never committed.
4. The Collinson instance's app-registration details are recorded for later use in
   that separate repo — out of scope for this implementation.

## Affected users and systems

- **Container**: Auth (`apps/lambda-auth`) — new handlers, shared lib, build
  selector, secret schema.
- **Indirectly touched**: none in `apps/infra` (Architecture.md confirms CDK-managed
  resources are unchanged) — only the content of the bundle `lambda-auth:deploy`
  ships and the shape of the secret `lambda-auth:sm-push` populates.
- **Users**: ~10 internal DataArt reviewers (canonical instance, open to all DataArt
  employees per this request); the specific individuals who will sign in are
  recorded in the engagement correspondence, not in code.

## Constraints

- No new AWS service (no Cognito) — direct Entra ID OIDC per D2.
- No server-side session store/revocation (D5) — accepted, confirmed design limit.
- Session cookie byte budget ~4KB (D3); dedicated `OIDC_SESSION_SIGNING_KEY`
  independent of the Entra client secret's rotation lifecycle (D6).
- `AUTH_MODE` unset must still default to `basic` — zero required action for
  already-deployed instances (D1 migration default). This default is build-time
  only; it is not changed by this ticket's "default to oidc for this repo" request,
  which is a deploy-config change (`.env.dev`/`.env.prod`) for this instance only.
- Real Entra client secrets must never be committed — only `.secrets.dev` (gitignored)
  locally, and Secrets Manager via `sm-push`, run by the developer (guarded
  command — never run directly by the agent).
- Independent security review of the hand-rolled OIDC/PKCE/JWT code (Efforts.md
  Ticket #3) is a pre-production gate, not a blocker for this implementation.

## Open questions

<!-- None outstanding after Context Gathering Step 4 sign-off. -->
