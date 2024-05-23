import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export type GetPhotoReturnType = Prisma.PromiseReturnType<typeof getPhoto>;

async function getPhoto(id: string) {
  return await prisma.photo.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: { user: { select: { avatar: true, id: true, username: true } } },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const photo = await getPhoto(params.id);

  return NextResponse.json(photo);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { title, caption } = await request.json();

  await prisma.photo.update({
    data: { title, caption },
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.photo.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
