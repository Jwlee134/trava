import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_TRAVA!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TRAVA!,
  },
  region: process.env.AWS_REGION!,
});

export async function uploadPhoto(buffer: Buffer, key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ACL: "public-read",
    Body: buffer,
  });
  await client.send(command);
  return `https://${process.env.AWS_S3_BUCKET!}.s3.${process.env
    .AWS_REGION!}.amazonaws.com/${key}`;
}

export async function deletePhoto(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  });
  await client.send(command);
}
