"use server";

import prisma from "@/libs/db";

export async function getPhotos() {
  console.log("GET PHOTOS HIT");
  return await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true },
  });
}
