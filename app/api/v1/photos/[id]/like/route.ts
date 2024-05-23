import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export type GetLikeStatusReturnType = Prisma.PromiseReturnType<
  typeof getLikeStatus
>;

async function getLikeStatus(id: string) {
  let isLiked = false;
  const session = await getSession();
  if (session.id) {
    isLiked = Boolean(
      await prisma.like.findFirst({
        where: { userId: session.id, photoId: id },
      })
    );
  }
  const likeCount = await prisma.like.count({ where: { photo: { id } } });
  return { isLiked, likeCount };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const status = await getLikeStatus(params.id);

  return NextResponse.json(status);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.id)
    return NextResponse.json({ success: false }, { status: 401 });

  await prisma.like.create({
    data: { photoId: params.id, userId: session.id },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.id)
    return NextResponse.json({ success: false }, { status: 401 });

  await prisma.like.deleteMany({
    where: { photoId: params.id, userId: session.id },
  });

  return NextResponse.json({ success: true });
}
