import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type GetLikedPhotosReturnType = Prisma.PromiseReturnType<
  typeof getLikedPhotos
>;

async function getLikedPhotos(id: number) {
  return await prisma.like.findMany({
    where: { userId: id },
    select: { photo: { select: { id: true, url: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id")!;
  const likedPhotos = await getLikedPhotos(+id);

  return NextResponse.json(likedPhotos);
}
