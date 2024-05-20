import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";

export type GetPhotoResponse = Prisma.PromiseReturnType<typeof getPhoto>;

async function getPhoto(id: number) {
  console.log("GET PHOTO HIT");
  return await prisma.photo.findUnique({
    where: { id },
    include: { user: { select: { avatar: true, id: true, username: true } } },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const photo = await getPhoto(Number(params.id));

  return Response.json(photo);
}
