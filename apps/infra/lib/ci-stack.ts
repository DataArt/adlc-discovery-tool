import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { naming } from './conventions';

interface CiStackProps extends cdk.StackProps {
  environment: string;
  workload: string;
  locationShort: string;
  orgPrefix: string;
  githubOrg: string;
  githubOrgId: string;
  githubRepo: string;
  githubRepoId: string;
}

export class CiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CiStackProps) {
    super(scope, id, props);
    const {
      environment,
      workload,
      locationShort,
      orgPrefix,
      githubOrg,
      githubOrgId,
      githubRepo,
      githubRepoId,
    } = props;
    const names = naming({ orgPrefix, environment, workload, locationShort });

    const oidcProvider = this.createOidcProvider();
    const deployRole = this.createDeployRole(
      oidcProvider,
      names,
      environment,
      workload,
      orgPrefix,
      githubOrg,
      githubOrgId,
      githubRepo,
      githubRepoId
    );

    new cdk.CfnOutput(this, 'DeployRoleArn', {
      value: deployRole.roleArn,
      description: 'Set as IAM_ROLE_ARN GitHub Actions variable',
    });
  }

  private createOidcProvider(): iam.OpenIdConnectProvider {
    return new iam.OpenIdConnectProvider(this, 'GitHubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      // Both thumbprints cover GitHub's current and previous TLS cert chains.
      thumbprints: [
        '6938fd4d98bab03faadb97b34396831e3780aea1',
        '1c58a3a8518e8759bf075b76b750d4f2df264fcd',
      ],
    });
  }

  private createDeployRole(
    oidcProvider: iam.OpenIdConnectProvider,
    names: ReturnType<typeof naming>,
    environment: string,
    workload: string,
    orgPrefix: string,
    githubOrg: string,
    githubOrgId: string,
    githubRepo: string,
    githubRepoId: string
  ): iam.Role {
    return new iam.Role(this, 'DeployRole', {
      roleName: names.ciDeployRole,
      assumedBy: new iam.WebIdentityPrincipal(oidcProvider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        StringLike: {
          // Immutable subject claim — repos created after Jun 2026 include numeric org/repo IDs.
          // Find these at https://api.github.com/repos/{org}/{repo}
          'token.actions.githubusercontent.com:sub': `repo:${githubOrg}@${githubOrgId}/${githubRepo}@${githubRepoId}:*`,
        },
      }),
      inlinePolicies: {
        S3Deploy: this.buildS3Policy(names.siteBucket),
        CloudFrontDeploy: this.buildCloudFrontPolicy(),
        LambdaDeploy: this.buildLambdaPolicy(names.authFn),
        SsmRead: this.buildSsmPolicy(environment, workload, orgPrefix),
      },
    });
  }

  private buildS3Policy(bucketName: string): iam.PolicyDocument {
    return new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['s3:PutObject', 's3:DeleteObject', 's3:GetObject'],
          resources: [`arn:aws:s3:::${bucketName}/*`],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['s3:ListBucket'],
          resources: [`arn:aws:s3:::${bucketName}`],
        }),
      ],
    });
  }

  private buildCloudFrontPolicy(): iam.PolicyDocument {
    return new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'cloudfront:CreateInvalidation',
            'cloudfront:GetInvalidation',
            'cloudfront:GetDistributionConfig',
            'cloudfront:UpdateDistribution',
            'cloudfront:GetDistribution',
          ],
          resources: [`arn:aws:cloudfront::${this.account}:distribution/*`],
        }),
      ],
    });
  }

  private buildLambdaPolicy(fnName: string): iam.PolicyDocument {
    return new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'lambda:UpdateFunctionCode',
            'lambda:PublishVersion',
            'lambda:ListVersionsByFunction',
            'lambda:GetFunctionConfiguration',
          ],
          resources: [`arn:aws:lambda:*:${this.account}:function:${fnName}`],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'lambda:AddPermission',
            'lambda:RemovePermission',
            'lambda:GetFunction',
            'lambda:EnableReplication*',
          ],
          // These actions are called on versioned ARNs (function:name:version)
          resources: [`arn:aws:lambda:*:${this.account}:function:${fnName}:*`],
        }),
      ],
    });
  }

  private buildSsmPolicy(
    environment: string,
    workload: string,
    orgPrefix: string
  ): iam.PolicyDocument {
    return new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ssm:GetParameter'],
          resources: [
            `arn:aws:ssm:${this.region}:${this.account}:parameter/${orgPrefix}/${environment}/${workload}/*`,
          ],
        }),
      ],
    });
  }
}
