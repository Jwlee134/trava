import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export type GetPhotoMetadataReturnType = Prisma.PromiseReturnType<
  typeof getPhotoMetadata
>;

async function getPhotoMetadata(id: string) {
  return await prisma.photo.findUnique({
    where: { id },
    select: { id: true, url: true, title: true, caption: true },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const metadata = await getPhotoMetadata(params.id);

  return NextResponse.json(metadata);
}
