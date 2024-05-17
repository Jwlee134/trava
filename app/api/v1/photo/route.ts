import { NextRequest } from "next/server";
import ExifReader from "exifreader";
import { uploadPhoto } from "@/libs/aws";
import prisma from "@/libs/db";
import getSession from "@/libs/session";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const photo = formData.get("photo") as File;
  const title = formData.get("title")?.toString() ?? null;
  const caption = formData.get("caption")?.toString() ?? null;
  const buffer = await photo.arrayBuffer();
  const exif = ExifReader.load(buffer);

  let date = null;
  if (exif.DateTimeOriginal?.description) {
    const dateArr = exif.DateTimeOriginal?.description.split(" ");
    const yyyymmdd = dateArr[0].replaceAll(":", "-");
    date = new Date(`${yyyymmdd}T${dateArr[1]}`).toISOString();
  }
  const exifObj = {
    format: exif["FileType"].description,
    deviceModel: exif.Model?.description ?? null,
    lensModel: exif.LensModel?.description ?? null,
    dimensions:
      exif["Image Height"]?.value && exif["Image Width"]?.value
        ? `${exif["Image Width"]?.value} × ${exif["Image Height"]?.value}`
        : null,
    iso: exif.ISOSpeedRatings?.description
      ? parseInt(exif.ISOSpeedRatings?.description)
      : null,
    focalLength: exif.FocalLength?.description ?? null,
    exposure: exif.ExposureBiasValue?.description
      ? `${
          (
            Math.round(Number(exif.ExposureBiasValue?.description) * 10) / 10
          ).toFixed(1) || 0
        } ev`
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

  return Response.json({ id: newPhoto.id });
}
