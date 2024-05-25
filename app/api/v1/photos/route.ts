import { uploadPhoto } from "@/libs/aws";
import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import ExifReader from "exifreader";
import getSession from "@/libs/session";

export type GetPhotosReturnType = Prisma.PromiseReturnType<typeof getPhotos>;

async function getPhotos(cursor: string) {
  const data = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true },
    take: 20,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
  });
  const nextCursor = data.length < 20 ? null : data[data.length - 1].id;
  return { data, nextCursor };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor")!;
  const photos = await getPhotos(cursor);

  return NextResponse.json(photos);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.id)
    return NextResponse.json({ success: false }, { status: 401 });

  const formData = await request.formData();
  const photo = formData.get("photo") as File;
  const title = formData.get("title")?.toString();
  const caption = formData.get("caption")?.toString();

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

  return NextResponse.json({ id: newPhoto.id });
}
