import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME;

/**
 * Upload a file to S3
 * @param {string} key - S3 object key (e.g. "contracts/2026-01-31/contract-abc.pdf")
 * @param {Buffer} buffer - File content
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} The key that was uploaded
 */
export async function uploadObject(key, buffer, contentType) {
  console.log(
    `[S3] UPLOAD → key: ${key} | size: ${buffer.length} bytes | type: ${contentType}`
  );
  const start = Date.now();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  console.log(`[S3] UPLOAD ✓ → key: ${key} | took: ${Date.now() - start}ms`);
  return key;
}

/**
 * Download a file from S3 as a Buffer
 * @param {string} key - S3 object key
 * @returns {Promise<Buffer>} File content
 */
export async function getObject(key) {
  console.log(`[S3] DOWNLOAD → key: ${key}`);
  const start = Date.now();

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );

  // SDK v3 returns a ReadableStream — consume it into a Buffer
  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);

  console.log(
    `[S3] DOWNLOAD ✓ → key: ${key} | size: ${buffer.length} bytes | took: ${
      Date.now() - start
    }ms`
  );
  return buffer;
}

/**
 * Generate a presigned URL for downloading an object
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Expiry in seconds (default 15 minutes)
 * @returns {Promise<string>} Presigned URL
 */
export async function getPresignedUrl(key, expiresIn = 900) {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
    { expiresIn }
  );
}

/**
 * Delete a file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export async function deleteObject(key) {
  console.log(`[S3] DELETE → key: ${key}`);
  const start = Date.now();

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );

  console.log(`[S3] DELETE ✓ → key: ${key} | took: ${Date.now() - start}ms`);
}
