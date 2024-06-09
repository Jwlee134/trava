import prisma from "@/libs/db";
import { protectedHandler } from "@/libs/server";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export type GetCommentsReturnType = Prisma.PromiseReturnType<
  typeof getComments
>;

async function getComments(id: string) {
  const comments = await prisma.comment.findMany({
    where: { photoId: id, parent: { is: null } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, username: true, avatar: true } },
      replies: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { id: true, username: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  const commentsCount = await prisma.comment.count({ where: { photoId: id } });

  return { comments: comments, count: commentsCount };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const comments = await getComments(params.id);

  return NextResponse.json(comments);
}

export const POST = protectedHandler(
  async (request, { params }: { params: { id: string } }, session) => {
    const { content } = await request.json();
    let newComment;

    try {
      newComment = await prisma.comment.create({
        data: {
          content,
          user: { connect: { id: session.id } },
          photo: { connect: { id: params.id } },
        },
        select: { id: true },
      });
    } catch {
      return NextResponse.json(
        {
          success: true,
          message: "Failed to create a comment.",
          timestamp: Date.now(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully created a comment.",
      timestamp: Date.now(),
    });
  }
);
