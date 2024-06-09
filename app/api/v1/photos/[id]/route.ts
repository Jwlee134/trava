import { deletePhoto } from "@/libs/aws";
import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export type GetPhotoReturnType = Prisma.PromiseReturnType<typeof getPhoto>;

async function getPhoto(id: string) {
  return await prisma.photo.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: {
      user: { select: { avatar: true, id: true, username: true } },
    },
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

  try {
    await prisma.photo.update({
      data: { title, caption },
      where: { id: params.id },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update the photo.",
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Successfully updated the photo.",
    timestamp: Date.now(),
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$transaction(async (tx) => {
      const photo = await tx.photo.delete({
        where: { id: params.id },
        select: { url: true },
      });
      await deletePhoto(photo.url.split("amazonaws.com/")[1]);
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete the photo.",
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Successfully deleted the photo.",
    timestamp: Date.now(),
  });
}
