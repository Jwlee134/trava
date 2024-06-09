import prisma from "@/libs/db";
import { protectedHandler } from "@/libs/server";
import { NextResponse } from "next/server";

export const POST = protectedHandler(
  async (
    request,
    { params }: { params: { id: string; cid: string } },
    session
  ) => {
    const { content } = await request.json();
    let newComment;

    try {
      newComment = await prisma.comment.create({
        data: {
          content,
          user: { connect: { id: session.id } },
          photo: { connect: { id: params.id } },
          parent: { connect: { id: params.cid } },
        },
      });
    } catch {
      return NextResponse.json(
        { success: false, message: "Failed to create a reply." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully created a reply.",
    });
  }
);

export const PATCH = protectedHandler(
  async (
    request,
    { params }: { params: { id: string; cid: string } },
    session
  ) => {
    const { content } = await request.json();
    let updatedComment;

    try {
      updatedComment = await prisma.comment.update({
        data: { content },
        where: { id: params.cid },
        select: { id: true },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update the comment.",
          timestamp: Date.now(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully updated the comment.",
      timestamp: Date.now(),
    });
  }
);

export const DELETE = protectedHandler(
  async (
    request,
    { params }: { params: { id: string; cid: string } },
    session
  ) => {
    try {
      // check if a comment has replies
      const numOfReplies = await prisma.comment.count({
        where: { photoId: params.id, parentId: params.cid },
      });

      if (numOfReplies > 0) {
        // if true, update parent's user, content to null, Deleted comment
        await prisma.comment.update({
          where: { id: params.cid },
          data: { userId: { set: null }, content: "Deleted comment" },
          select: { id: true },
        });
      } else {
        // else, delete the comment
        // it can be both a parent without replies and a reply
        // if deleted comment was only reply of deleted parent, delete the parent as well
        await prisma.$transaction(async (tx) => {
          const target = await tx.comment.delete({
            where: { id: params.cid },
            select: { id: true },
          });
          await tx.comment.deleteMany({
            where: {
              photoId: params.id,
              userId: null,
              replies: { every: { id: target.id } },
            },
          });
        });
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete the comment.",
          timestamp: Date.now(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully deleted the comment.",
      timestamp: Date.now(),
    });
  }
);
