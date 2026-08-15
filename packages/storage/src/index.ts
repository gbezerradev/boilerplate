import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@boilerplate/env/server";

export const maxUploadBytes = 25 * 1024 * 1024;
let client: S3Client | undefined;

export function isStorageEnabled() {
  return env.STORAGE_PROVIDER === "s3";
}

export function assertStorageConfiguration() {
  if (!isStorageEnabled()) return;
  if (!env.S3_BUCKET) throw new Error("S3_BUCKET is required when storage is enabled");
  if (Boolean(env.S3_ACCESS_KEY_ID) !== Boolean(env.S3_SECRET_ACCESS_KEY)) {
    throw new Error("S3 access key id and secret must be configured together");
  }
}

export function buildObjectKey(organizationId: string, objectId: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(organizationId) || !/^[a-zA-Z0-9-]+$/.test(objectId)) {
    throw new Error("Invalid storage identifier");
  }
  return `organizations/${organizationId}/objects/${objectId}`;
}

function getClient() {
  assertStorageConfiguration();
  if (!isStorageEnabled()) throw new Error("Storage is disabled");
  client ??= new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: Boolean(env.S3_ENDPOINT),
    credentials:
      env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
        ? { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY }
        : undefined,
  });
  return client;
}

function bucket() {
  if (!env.S3_BUCKET) throw new Error("S3_BUCKET is required");
  return env.S3_BUCKET;
}

export async function createUploadUrl(input: {
  key: string;
  contentType: string;
  organizationId: string;
}) {
  const command = new PutObjectCommand({
    Bucket: bucket(),
    Key: input.key,
    ContentType: input.contentType,
    Metadata: { organizationId: input.organizationId },
  });
  return getSignedUrl(getClient(), command, {
    expiresIn: 10 * 60,
    signableHeaders: new Set(["content-type"]),
  });
}

export async function inspectObject(key: string) {
  const result = await getClient().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
  return { size: result.ContentLength ?? 0, contentType: result.ContentType ?? null };
}

export function createDownloadUrl(key: string, downloadName: string) {
  return getSignedUrl(
    getClient(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: key,
      ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
    }),
    { expiresIn: 5 * 60 },
  );
}

export async function deleteObject(key: string) {
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
