"use server";

import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { notFound } from "next/navigation";

export async function getMyPhotos() {
  const session = await getSession();
  if (!session.id) return notFound();
  console.log("GET MYPHOTOS HIT");
  return await prisma.photo.findMany({
    where: { userId: session.id },
    select: { id: true, url: true },
    orderBy: { createdAt: "desc" },
  });
}
