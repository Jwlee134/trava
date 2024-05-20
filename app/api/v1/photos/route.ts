import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";

export type GetPhotosResponse = Prisma.PromiseReturnType<typeof getPhotos>;

async function getPhotos() {
  console.log("GET PHOTOS HIT");
  return await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true },
  });
}

export async function GET() {
  const photos = await getPhotos();

  return Response.json(photos);
}
