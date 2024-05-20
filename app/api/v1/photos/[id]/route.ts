import { deletePhoto } from "@/libs/aws";
import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";

export type GetPhotoResponse = Prisma.PromiseReturnType<typeof getPhoto>;

async function getPhoto(id: number) {
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { title, caption }: { title: string; caption: string } =
    await request.json();

  await prisma.photo.update({
    data: { title, caption },
    where: { id: +params.id },
  });

  revalidateTag(`photo-${params.id}`);

  return Response.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const photo = await prisma.photo.delete({
    where: { id: +params.id },
    select: { url: true },
  });
  await deletePhoto(photo.url.split("amazonaws.com/")[1]);

  revalidateTag("photos");
  revalidateTag("photo-detail");

  return Response.json({ success: true });
}
