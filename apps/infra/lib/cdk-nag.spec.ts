import * as cdk from 'aws-cdk-lib';
import { Annotations, Match } from 'aws-cdk-lib/assertions';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { describe, expect, it } from 'vitest';
import { CiStack } from './ci-stack';
import { DocsStack } from './docs-stack';
import { EdgeStack } from './edge-stack';

// Fixed dummy identity used only to synthesize the stacks for cdk-nag; never deployed.
const shared = { environment: 'dev', workload: 'docs', locationShort: 'ue1', orgPrefix: 'da' };

function synthesizedStacks() {
  const app = new cdk.App();

  const edgeStack = new EdgeStack(app, 'EdgeStackTest', {
    ...shared,
    env: { account: '123456789012', region: 'us-east-1' },
    crossRegionReferences: true,
  });

  const docsStack = new DocsStack(app, 'DocsStackTest', {
    ...shared,
    cfPriceClass: 'PriceClass_100',
    edgeStack,
    crossRegionReferences: true,
    env: { account: '123456789012', region: 'eu-west-1' },
  });

  const ciStack = new CiStack(app, 'CiStackTest', {
    ...shared,
    githubOrg: 'DataArt',
    githubOrgId: '1',
    githubRepo: 'adlc-discovery-tool',
    githubRepoId: '1',
    createOidcProvider: true,
    distribution: docsStack.distribution,
    env: { account: '123456789012', region: 'eu-west-1' },
  });

  for (const stack of [edgeStack, docsStack, ciStack]) {
    cdk.Aspects.of(stack).add(new AwsSolutionsChecks({ verbose: true }));
  }

  // --- Accepted, documented risks — see docs/Target Architecture (HLD)/v1/Non-Functional
  // Concerns/Requirements.md and docs/Engineering Guide/09 Harness Security.md ---
  NagSuppressions.addStackSuppressions(docsStack, [
    {
      id: 'AwsSolutions-CFR1',
      reason: 'No geo restriction required — small internal team (~10 users), NFR Constraints.',
    },
    {
      id: 'AwsSolutions-CFR2',
      reason:
        'WAF not attached — out of scope for this fixed-duration engagement; access is ' +
        'already gated by AUTH_MODE (NFR-1) and this is not a public-facing production service.',
    },
    {
      id: 'AwsSolutions-CFR4',
      reason:
        'Default CloudFront certificate (*.cloudfront.net) is used — no custom domain for ' +
        'this engagement. minimumProtocolVersion cannot be raised without one; tracked as a known ' +
        'gap pending a custom-domain decision.',
    },
    {
      id: 'AwsSolutions-S1',
      reason:
        'SiteBucket is the origin bucket itself, not a log destination — server access logs ' +
        'are written to the dedicated LogsBucket (serverAccessLogsBucket), per NFR-7.',
    },
    {
      id: 'AwsSolutions-SMG4',
      reason:
        'AuthSecret holds a shared basic-auth password hash pushed manually via ' +
        'lambda-auth:sm-push (NFR-2) — there is no automated rotation workflow for this value; ' +
        'rotation is a manual re-push when the shared password changes.',
    },
  ]);
  NagSuppressions.addStackSuppressions(edgeStack, [
    {
      id: 'AwsSolutions-IAM4',
      reason:
        'AWSLambdaBasicExecutionRole (CloudWatch Logs write) is the standard, least-' +
        'privilege-compliant AWS managed policy for this purpose.',
    },
    {
      id: 'AwsSolutions-IAM5',
      reason:
        'The region segment is wildcarded intentionally — Lambda@Edge executes in edge ' +
        'locations globally while the Secret itself lives in one build-time-configured region ' +
        '(see EdgeStack.createRole); the resource name itself is a specific secret, suffixed ' +
        "with Secrets Manager's own random 6-character suffix wildcard.",
    },
    {
      id: 'AwsSolutions-L1',
      reason:
        'Lambda@Edge only supports a restricted runtime allowlist, independent of the ' +
        'latest Lambda runtime overall; NODEJS_22_X is the latest Lambda@Edge-compatible runtime.',
    },
  ]);
  NagSuppressions.addStackSuppressions(ciStack, [
    {
      id: 'AwsSolutions-IAM5',
      reason:
        'S3/Lambda/CloudFront actions require object-prefix or version-suffix wildcards ' +
        'under a single named resource (bucket/*, function:name:*) — not a broad wildcard; see ' +
        'docs/Engineering Guide/09 Harness Security.md for the CloudFront ARN scoping fix.',
    },
  ]);

  app.synth();
  return { edgeStack, docsStack, ciStack };
}

describe('cdk-nag: AwsSolutionsChecks', () => {
  const { edgeStack, docsStack, ciStack } = synthesizedStacks();

  it.each([
    ['EdgeStack', edgeStack],
    ['DocsStack', docsStack],
    ['CiStack', ciStack],
  ])('%s has no unsuppressed errors', (_name, stack) => {
    const errors = Annotations.fromStack(stack).findError('*', Match.anyValue());
    expect(errors.map((e) => `${e.id}: ${e.entry.data}`)).toEqual([]);
  });
});
