import prisma from "@/libs/db";
import { protectedHandler } from "@/libs/server";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type GetLikeStatusReturnType = Prisma.PromiseReturnType<
  typeof getLikeStatus
>;

async function getLikeStatus(id: string, userId: string | null) {
  let isLiked = false;
  if (userId) {
    isLiked = Boolean(
      await prisma.like.findFirst({
        where: { userId, photoId: id },
      })
    );
  }
  const likeCount = await prisma.like.count({ where: { photo: { id } } });
  return { isLiked, likeCount };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const status = await getLikeStatus(params.id, userId);

  return NextResponse.json(status);
}

export const POST = protectedHandler(
  async (request: Request, { params }: { params: { id: string } }, session) => {
    try {
      await prisma.like.create({
        data: { photoId: params.id, userId: session.id },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to like the photo.",
          timestamp: Date.now(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully liked the photo.",
      timestamp: Date.now(),
    });
  }
);

export const DELETE = protectedHandler(
  async (request: Request, { params }: { params: { id: string } }, session) => {
    try {
      await prisma.like.deleteMany({
        where: { photoId: params.id, userId: session.id },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to dislike the photo.",
          timestamp: Date.now(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully disliked the photo.",
      timestamp: Date.now(),
    });
  }
);
