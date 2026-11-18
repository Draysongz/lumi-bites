import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/** Neon Object Storage bucket for uploaded files (images, documents). */
export const BUCKET = "lumi-bucket";

// Neon uses path-style addressing — forcePathStyle is required.
// Credentials + endpoint + region are read from the standard AWS env vars
// (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3, AWS_REGION).
const s3 = new S3Client({ forcePathStyle: true });

export type UploadedFile = {
  key: string;
  url: string;
};

/**
 * Upload a file buffer to the bucket and return its key + public URL.
 * Key is prefixed with a folder (e.g. "dishes") + a collision-resistant suffix.
 */
export async function uploadFile(
  folder: string,
  filename: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<UploadedFile> {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const key = `${folder}/${Date.now()}-${safe}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: new Uint8Array(body),
      ContentType: contentType,
    }),
  );

  return { key, url: `https://${process.env.AWS_ENDPOINT_URL_S3?.replace(/^https?:\/\//, "")}/${BUCKET}/${key}` };
}

/** Generate a presigned GET URL for an object (default 1 hour). */
export async function presignedUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn },
  );
}

/** Delete an object by key. */
export async function deleteFile(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Build a public URL from an object key. Uses the S3 endpoint host directly;
 * Neon buckets are private by default, so prefer presignedUrl() unless the
 * bucket is set to public read.
 */
export function publicUrl(key: string): string {
  const host = process.env.AWS_ENDPOINT_URL_S3?.replace(/^https?:\/\//, "");
  return `https://${host}/${BUCKET}/${key}`;
}

/**
 * Resolve a stored `Dish.imageUrl` to a *viewable* URL.
 * - If it's a raw Neon bucket URL (or bare key), convert to a presigned URL.
 * - Local `/images/...` paths and other absolute URLs pass through unchanged.
 */
export async function resolveImageUrl(imageUrl: string | null): Promise<string | null> {
  if (!imageUrl) return null;

  // Local assets served from public/ — no signing needed.
  if (imageUrl.startsWith("/")) return imageUrl;

  const host = process.env.AWS_ENDPOINT_URL_S3?.replace(/^https?:\/\//, "");

  // Bare key (e.g. "dishes/foo.jpg") → presign directly.
  if (!imageUrl.includes("://")) {
    return presignedUrl(imageUrl);
  }

  // Full Neon bucket URL → extract the key (path after "/lumi-bucket/") and presign.
  const marker = `/${BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx !== -1) {
    const key = imageUrl.slice(idx + marker.length);
    return presignedUrl(key);
  }

  // Some external host (or already-presigned) — return as-is.
  if (host && imageUrl.includes(host)) return imageUrl;
  return imageUrl;
}
