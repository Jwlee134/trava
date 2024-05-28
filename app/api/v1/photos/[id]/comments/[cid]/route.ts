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

    const newComment = await prisma.comment.create({
      data: {
        content,
        user: { connect: { id: session.id } },
        photo: { connect: { id: params.id } },
        parent: { connect: { id: params.cid } },
      },
    });

    return NextResponse.json({ id: newComment.id });
  }
);

export const PATCH = protectedHandler(
  async (
    request,
    { params }: { params: { id: string; cid: string } },
    session
  ) => {
    const { content } = await request.json();

    const updatedComment = await prisma.comment.update({
      data: { content },
      where: { id: params.id },
      select: { id: true },
    });

    return NextResponse.json({ id: updatedComment.id });
  }
);

export const DELETE = protectedHandler(
  async (
    request,
    { params }: { params: { id: string; cid: string } },
    session
  ) => {
    const deletedComment = await prisma.comment.delete({
      where: { id: params.id },
      select: { id: true },
    });

    return NextResponse.json({ id: deletedComment.id });
  }
);
