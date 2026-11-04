import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { naming } from './conventions';
import { EdgeStack } from './edge-stack';

const PRICE_CLASS_MAP: Record<string, cloudfront.PriceClass> = {
  PriceClass_100: cloudfront.PriceClass.PRICE_CLASS_100,
  PriceClass_200: cloudfront.PriceClass.PRICE_CLASS_200,
  PriceClass_All: cloudfront.PriceClass.PRICE_CLASS_ALL,
};

interface DocsStackProps extends cdk.StackProps {
  environment: string;
  workload: string;
  locationShort: string;
  orgPrefix: string;
  cfPriceClass: string;
  edgeStack: EdgeStack;
}

export class DocsStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: DocsStackProps) {
    super(scope, id, props);
    const { environment, workload, locationShort, orgPrefix, cfPriceClass, edgeStack } = props;
    const names = naming({ orgPrefix, environment, workload, locationShort });

    const logsBucket = this.createLogsBucket(names.logsBucket);
    const siteBucket = this.createSiteBucket(names.siteBucket, logsBucket);
    const secret = this.createAuthSecret(names.authSecret);
    const distribution = this.createDistribution(siteBucket, logsBucket, edgeStack, cfPriceClass);
    this.distribution = distribution;

    new cdk.CfnOutput(this, 'CloudFrontDomain', { value: distribution.distributionDomainName });
    new cdk.CfnOutput(this, 'CloudFrontDistributionId', { value: distribution.distributionId });
    new cdk.CfnOutput(this, 'SiteBucketName', { value: siteBucket.bucketName });
    new cdk.CfnOutput(this, 'LogsBucketName', { value: logsBucket.bucketName });
    new cdk.CfnOutput(this, 'AuthSecretArn', { value: secret.secretArn });
    new cdk.CfnOutput(this, 'AuthSecretName', { value: secret.secretName });
    new cdk.CfnOutput(this, 'AuthLambdaFunctionName', { value: edgeStack.authFnName });
  }

  // Shared by both S3 server-access logs (site bucket reads) and CloudFront
  // standard logs (viewer requests). OBJECT_WRITER ownership is required for
  // CloudFront's log delivery, which writes via an ACL grant, not a bucket policy —
  // BucketOwnerEnforced (the CDK default) disables ACLs entirely and would silently
  // break CloudFront log delivery. S3's own server-access-log delivery uses a bucket
  // policy instead (wired automatically by `serverAccessLogsBucket` below), so it
  // works under either ownership setting.
  private createLogsBucket(bucketName: string): s3.Bucket {
    return new s3.Bucket(this, 'LogsBucket', {
      bucketName,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
      lifecycleRules: [{ expiration: cdk.Duration.days(180) }],
    });
  }

  private createSiteBucket(bucketName: string, logsBucket: s3.Bucket): s3.Bucket {
    return new s3.Bucket(this, 'SiteBucket', {
      bucketName,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      serverAccessLogsBucket: logsBucket,
      serverAccessLogsPrefix: 's3-access-logs/',
    });
  }

  private createAuthSecret(secretName: string): secretsmanager.Secret {
    return new secretsmanager.Secret(this, 'AuthSecret', {
      secretName,
      description: 'Basic auth credentials for Lambda@Edge — managed via lambda-auth:sm-push',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
  }

  // Giscus (NFR-6 comments) loads https://giscus.app/client.js and renders its
  // comment widget in an iframe from the same origin — script-src, style-src
  // and frame-src all need an explicit CSP allowance (style-src too: giscus's
  // client.js sets styles on the host page, not just inside the iframe).
  // VitePress itself injects small inline bootstrap scripts (dark-mode/OS
  // detection) and a few inline style attributes, so script-src and style-src
  // also need 'unsafe-inline' until those are moved to nonces/hashes.
  // frame-ancestors 'none' restates X-Frame-Options: DENY as CSP, which
  // browsers prioritize over the legacy header when both are present.
  private createResponseHeadersPolicy(): cloudfront.ResponseHeadersPolicy {
    return new cloudfront.ResponseHeadersPolicy(this, 'SecurityHeadersPolicy', {
      securityHeadersBehavior: {
        strictTransportSecurity: {
          accessControlMaxAge: cdk.Duration.days(365),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          override: true,
        },
        contentSecurityPolicy: {
          contentSecurityPolicy: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://giscus.app",
            "style-src 'self' 'unsafe-inline' https://giscus.app",
            'frame-src https://giscus.app',
            "connect-src 'self' https://giscus.app",
            "img-src 'self' data: https://giscus.app",
            "font-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-ancestors 'none'",
          ].join('; '),
          override: true,
        },
      },
    });
  }

  private createDistribution(
    siteBucket: s3.Bucket,
    logsBucket: s3.Bucket,
    edgeStack: EdgeStack,
    cfPriceClass: string
  ): cloudfront.Distribution {
    const responseHeadersPolicy = this.createResponseHeadersPolicy();
    return new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      enableLogging: true,
      logBucket: logsBucket,
      logFilePrefix: 'cf-access-logs/',
      // S3 returns 403 (not 404) for missing objects on private buckets.
      // Remap to the VitePress 404 page so browsers get a proper not-found response.
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy,
        edgeLambdas: [
          {
            functionVersion: edgeStack.authFnVersion,
            eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
          },
        ],
      },
      priceClass: PRICE_CLASS_MAP[cfPriceClass] ?? cloudfront.PriceClass.PRICE_CLASS_100,
    });
  }
}
