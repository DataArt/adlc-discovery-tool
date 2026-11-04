import type { CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';

// AUTH_MODE=none: unconditional pass-through. No auth check, no Secrets Manager
// call, no cookie — imports nothing beyond the aws-lambda types.
export const handler = async (event: CloudFrontRequestEvent): Promise<CloudFrontRequestResult> => {
  return event.Records[0].cf.request;
};
