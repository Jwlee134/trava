import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { notFound } from "next/navigation";

export async function getLikedPhotos() {
  const session = await getSession();
  if (!session.id) return notFound();

  return await prisma.like.findMany({
    where: { userId: session.id },
    select: { photo: { select: { id: true, url: true } } },
  });
}
