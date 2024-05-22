import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type GetMyPhotosReturnType = Prisma.PromiseReturnType<
  typeof getMyPhotos
>;

async function getMyPhotos(id: number) {
  return await prisma.photo.findMany({
    where: { userId: id },
    select: { id: true, url: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id")!;
  const likedPhotos = await getMyPhotos(+id);

  return NextResponse.json(likedPhotos);
}
