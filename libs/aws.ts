import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
  region: process.env.AWS_REGION!,
});

export async function uploadPhoto(folder: string, file: File) {
  const key = `${folder}/${file.size}-${Date.now()}-${file.name}`;
  const buffer = await file.arrayBuffer();
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ACL: "public-read",
    Body: Buffer.from(buffer),
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
