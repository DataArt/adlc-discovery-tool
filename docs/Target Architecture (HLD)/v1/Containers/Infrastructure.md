# Infrastructure Container

AWS CDK definitions for all cloud resources.

## Baseline diagram

```mermaid
flowchart LR
    Browser(["🌐 Browser"]):::client

    subgraph EDGE_BOX ["  CloudFront Edge  "]
        CF["☁️ CloudFront"]:::cf
        LAE["🔐 Lambda@Edge\nconfigurable auth"]:::lae
    end

    S3["🪣 S3 Bucket\nstatic site · OAC"]:::s3

    subgraph EDGE_STACK ["  EdgeStack — us-east-1  "]
        LAE_PH["📦 Placeholder Lambda\n(viewer-request)"]:::cdk
    end

    subgraph DOCS_STACK ["  DocsStack — {region}  "]
        CF_DEF["☁️ CloudFront distribution"]:::cf
        S3_DEF["🪣 S3 bucket · IAM · OAC"]:::s3
        LOGS["📜 Logs bucket\nCF access logs · S3 access logs"]:::s3
    end

    subgraph CI_STACK ["  CiStack — {region}  "]
        OIDC["🔑 GitHub OIDC Provider"]:::iam
        DEPLOY_ROLE["🛡️ Deploy Role\nS3 · CF · Lambda · SSM\nsub: push to main"]:::iam
        CI_ROLE["🔎 CI Read Role\nSSM only\nsub: pull_request"]:::iam
    end

    GH_CD(["⚙️ GitHub Actions\ncd.yml — push to main"]):::ci
    GH_CI(["⚙️ GitHub Actions\nci.yml — pull_request"]):::ci

    GH_CD -->|"AssumeRoleWithWebIdentity"| DEPLOY_ROLE
    GH_CI -->|"AssumeRoleWithWebIdentity"| CI_ROLE
    DEPLOY_ROLE -.->|"scoped to"| OIDC
    CI_ROLE -.->|"scoped to"| OIDC

    LAE_PH -.->|"cross-stack ref\n(Lambda version ARN)"| CF_DEF

    Browser -->|"HTTPS"| CF
    CF --> LAE
    LAE -->|"pass-through"| S3

    LAE_PH -.->|"provisions viewer-request"| LAE
    CF_DEF -.->|"defines"| CF
    S3_DEF -.->|"defines"| S3
    CF -.->|"access logs"| LOGS
    S3 -.->|"access logs"| LOGS

    classDef client fill:#2C3E50,stroke:#1A252F,color:#fff
    classDef cdk    fill:#065F46,stroke:#064e3b,color:#fff
    classDef cf     fill:#1D4ED8,stroke:#1e3a8a,color:#fff
    classDef lae    fill:#7C3AED,stroke:#5B21B6,color:#fff
    classDef s3     fill:#0E7490,stroke:#0c4a6e,color:#fff
    classDef iam    fill:#581c87,stroke:#a855f7,color:#f3e8ff
    classDef ci     fill:#1e293b,stroke:#475569,color:#f8fafc,font-weight:bold

    style EDGE_STACK fill:#064e3b,stroke:#065F46,color:#fff
    style DOCS_STACK fill:#0c4a6e,stroke:#0E7490,color:#fff
    style EDGE_BOX   fill:#1e1b4b,stroke:#4338ca,color:#fff
    style CI_STACK   fill:#2d1b69,stroke:#581c87,color:#f3e8ff
```

_Auth decision path (401 challenge vs pass-through) is shown in `Containers/Auth.md`._

## Responsibilities

- CloudFront distribution configured with `defaultRootObject: index.html`; an `errorResponses` entry remaps S3 403 → HTTP 404 (private S3 buckets return 403 for missing objects, not 404)
- `ResponseHeadersPolicy` attached to the default behavior adds HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, and a CSP scoped to `'self'` plus `https://giscus.app` to every response — see [NFR-9](../Non-Functional%20Concerns/Requirements.md)
- S3 bucket as static site origin (Origin Access Control)
- IAM roles and resource policies
- All resources defined as CDK constructs — no manual provisioning
- Secrets Manager secret provisioned as an empty placeholder (`{}`); value is populated post-deploy by `lambda-auth:sm-push` — never set by CDK; the populated payload's shape varies by `AUTH_MODE`, but the CDK-provisioned secret container itself is unchanged
- Dedicated, private logs bucket captures both CloudFront standard access logs (every viewer request — IP, path, status, edge location) and the site bucket's own S3 server-access logs, with a 180-day expiration lifecycle rule; previously neither existed
- GitHub OIDC provider (`CiStack`) enabling GitHub Actions to authenticate via short-lived credentials; two roles, each trusted for exactly one triggering event — a pull_request-only read role (SSM only) and a push-to-main-only deploy role (S3, CloudFront, Lambda, SSM) — so a PR can never assume deploy-grade credentials before human review
- The Lambda code shipped into `EdgeStack`'s placeholder via `lambda-auth:deploy` varies by the build-time `AUTH_MODE` selector in `apps/lambda-auth`; `EdgeStack`'s and `DocsStack`'s CDK-managed resources (placeholder Lambda, IAM role, secret container) are unchanged by this selector

## Technology

| Component     | Choice      |
| ------------- | ----------- |
| IaC framework | AWS CDK     |
| Language      | TypeScript  |
| Distribution  | CloudFront  |
| Origin        | S3 (static) |
| Edge auth     | Lambda@Edge |

## Key paths

| Path          | Purpose                   |
| ------------- | ------------------------- |
| `apps/infra/` | CDK stacks and constructs |

## Constraints

- Region is deployment configuration — never hardcoded in source or documentation
- All stateful resources (S3 buckets, log groups) must have explicit removal policies
- IAM policies must follow least-privilege — no `*` actions or resources without justification

## Naming conventions

| Name                 | Pattern                                           |
| -------------------- | ------------------------------------------------- |
| AWS resources        | `{org}-{env}-{wl}-{locationShort}-{type}-{index}` |
| Secrets Manager path | `{org}/{env}/{wl}/lambda-auth`                    |
| SSM Parameter Store  | `/{org}/{env}/{wl}/{app}/env`                     |

All naming logic is centralised in `apps/infra/lib/conventions.ts`.
