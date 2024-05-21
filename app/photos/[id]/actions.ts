"use server";

import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { revalidateTag } from "next/cache";

export async function getPhoto(id: number) {
  console.log("GET PHOTO HIT");
  return await prisma.photo.findUnique({
    where: { id },
    include: { user: { select: { avatar: true, id: true, username: true } } },
  });
}

export async function getIsLiked(id: number, userId: number) {
  return Boolean(
    await prisma.like.findUnique({
      where: { id: { photoId: id, userId } },
    })
  );
}

export async function likePhoto(id: number) {
  const session = await getSession();
  if (!session.id) return;

  await prisma.like.create({
    data: { photoId: id, userId: session.id },
  });

  revalidateTag(`like-status-${session.id}`);
}

export async function dislikePhoto(id: number) {
  const session = await getSession();
  if (!session.id) return;

  await prisma.like.delete({
    where: { id: { photoId: id, userId: session.id } },
  });

  revalidateTag(`like-status-${session.id}`);
}
