"use server";

import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { revalidateTag } from "next/cache";

export async function likePhoto(id: number) {
  const session = await getSession();
  if (!session.id) return;

  await prisma.like.create({
    data: { photoId: id, userId: session.id },
  });

  revalidateTag(`like-status-${id}`);
}

export async function dislikePhoto(id: number) {
  const session = await getSession();
  if (!session.id) return;

  await prisma.like.delete({
    where: { id: { photoId: id, userId: session.id } },
  });

  revalidateTag(`like-status-${id}`);
}
