"use server";

import { uploadAwsPhoto } from "@/libs/aws";
import prisma from "@/libs/db";
import getSession from "@/libs/session";
import sharp from "sharp";
import { z } from "zod";
import ExifReader from "exifreader";
import { revalidateTag } from "next/cache";

const MAX_FILE_SIZE = 5_242_880;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const uploadPhotoSchema = z.object({
  photo: z
    .any({ required_error: "Photo is required." })
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  title: z.string({ invalid_type_error: "Title must be string." }),
  caption: z.string({ invalid_type_error: "Caption must be string." }),
});

export async function uploadPhoto(prevState: any, formData: FormData) {
  const result = uploadPhotoSchema.safeParse({
    photo: formData.get("photo"),
    title: formData.get("title"),
    caption: formData.get("caption"),
  });

  if (!result.success) {
    return { errors: result.error.flatten() };
  }

  let id;

  try {
    const photo = result.data.photo;
    const title = result.data.title;
    const caption = result.data.caption;

    const buffer = await (photo as File).arrayBuffer();
    const exif = ExifReader.load(buffer);

    let date = null;
    if (exif.DateTimeOriginal?.description) {
      const dateArr = exif.DateTimeOriginal?.description.split(" ");
      const yyyymmdd = dateArr[0].replaceAll(":", "-");
      date = new Date(`${yyyymmdd}T${dateArr[1]}`).toISOString();
    }
    const width = exif["Image Width"]?.value ?? 0;
    const height = exif["Image Height"]?.value ?? 0;
    let resolution = Math.round(((width * height) / 1000000) * 10) / 10;
    resolution = resolution >= 1 ? Number(resolution.toFixed()) : resolution;
    const exposure = Number(
      (
        Math.round(Number(exif.ExposureBiasValue?.description) * 10) / 10
      ).toFixed(1)
    );

    const exifObj = {
      format: exif["FileType"].description,
      deviceModel: exif.Model?.description ?? null,
      lensModel: exif.LensModel?.description ?? null,
      width,
      height,
      resolution: `${resolution} MP`,
      dimensions: `${width} × ${height}`,
      iso: exif.ISOSpeedRatings?.description
        ? `ISO ${exif.ISOSpeedRatings?.description}`
        : null,
      focalLength: exif.FocalLength?.description ?? null,
      exposure: exif.ExposureBiasValue?.description
        ? `${exposure || 0} ev`
        : null,
      aperture: exif.FNumber?.description ?? null,
      shutterSpeed: exif.ShutterSpeedValue?.description
        ? `${exif.ShutterSpeedValue?.description} s`
        : null,
      latitude: exif.GPSLatitude?.description
        ? parseFloat(exif.GPSLatitude?.description)
        : null,
      longitude: exif.GPSLongitude?.description
        ? parseFloat(exif.GPSLongitude?.description)
        : null,
    };

    const key = `photos/${photo.size}-${Date.now()}-${
      photo.name.split(".")[0]
    }.webp`;
    const compressedBuffer = await sharp(buffer)
      .resize(1280)
      .withMetadata()
      .toBuffer();

    const session = await getSession();

    await prisma.$transaction(async (tx) => {
      const url = await uploadAwsPhoto(compressedBuffer, key);

      const newPhoto = await tx.photo.create({
        data: {
          url,
          user: { connect: { id: session.id } },
          title,
          caption,
          date,
          ...exifObj,
        },
        select: { id: true },
      });

      id = newPhoto.id;
    });
  } catch {
    return { success: false, message: "Failed to create a photo." };
  }

  revalidateTag("photos");
  return {
    success: true,
    message: "Photo has created successfully.",
    data: { id },
  };
}
