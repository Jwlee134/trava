"use server";

import { uploadPhoto } from "@/libs/aws";
import prisma from "@/libs/db";
import getSession from "@/libs/session";
import ExifReader from "exifreader";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function upload(data: FormData) {
  const photo = data.get("photo") as File;
  const title = data.get("title")?.toString() ?? null;
  const caption = data.get("caption")?.toString() ?? null;
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
    (Math.round(Number(exif.ExposureBiasValue?.description) * 10) / 10).toFixed(
      1
    )
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

  const url = await uploadPhoto("photos", photo);
  const session = await getSession();

  const newPhoto = await prisma.photo.create({
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

  revalidateTag("photos");

  redirect(`/photos/${newPhoto.id}`);
}
