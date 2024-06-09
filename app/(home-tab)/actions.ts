"use server";

import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";

export type GetPhotosType = typeof getPhotos;
export type GetPhotosReturnType = Prisma.PromiseReturnType<GetPhotosType>;

export async function getPhotos(cursor?: string | null) {
  console.log("GETPHOTOS HIT");
  const data = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true },
    take: 30,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
  });
  const nextCursor = data.length < 30 ? null : data[data.length - 1].id;
  return { data, nextCursor };
}
