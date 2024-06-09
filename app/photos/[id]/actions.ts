"use server";

import { deleteAwsPhoto } from "@/libs/aws";
import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export type GetPhotoReturnType = Prisma.PromiseReturnType<typeof getPhoto>;
export type GetLikeStatusReturnType = Prisma.PromiseReturnType<
  typeof getLikeStatus
>;
export type GetCommentsReturnType = Prisma.PromiseReturnType<
  typeof getComments
>;

const title = z.string({
  invalid_type_error: "title must be string.",
  required_error: "title is required.",
});
const caption = z.string({
  invalid_type_error: "Caption must be string.",
  required_error: "Caption is required.",
});
const content = z.string({
  invalid_type_error: "Content must be string.",
  required_error: "Content is required.",
});
const photoId = z.string({
  invalid_type_error: "Photo id must be string.",
  required_error: "Photo id is required.",
});
const commentId = z.string({
  invalid_type_error: "Comment id must be string.",
  required_error: "Comment id is required.",
});

const updatePhotoSchema = z.object({ photoId, title, caption });
const deletePhotoSchema = z.object({ photoId });
const createCommentSchema = z.object({ content, photoId });
const createReplyUpdateCommentSchema = z.object({
  content,
  photoId,
  commentId,
});
const deleteCommentSchema = z.object({ photoId, commentId });

export async function getPhoto(id: string) {
  console.log("GETPHOTO HIT");
  return await prisma.photo.findUnique({
    where: { id },
    include: {
      user: { select: { avatar: true, id: true, username: true } },
    },
  });
}

export async function updatePhoto(prevState: any, formData: FormData) {
  const result = updatePhotoSchema.safeParse({
    photoId: formData.get("photoId"),
    title: formData.get("title"),
    caption: formData.get("caption"),
  });

  if (!result.success) {
    return { errors: result.error.flatten() };
  }

  try {
    await prisma.photo.update({
      data: { title: result.data.title, caption: result.data.caption },
      where: { id: result.data.photoId },
    });
  } catch {
    return { success: false, message: "Failed to update the photo." };
  }

  revalidateTag(`photo-${result.data.photoId}`);
  return { success: true, message: "Photo has updated successfully." };
}

export async function deletePhoto(prevState: any, formData: FormData) {
  const result = deletePhotoSchema.safeParse({
    photoId: formData.get("photoId"),
  });

  if (!result.success) {
    return { errors: result.error.flatten() };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const photo = await tx.photo.delete({
        where: { id: result.data.photoId },
        select: { url: true },
      });
      await deleteAwsPhoto(photo.url.split("amazonaws.com/")[1]);
    });
  } catch {
    return { success: false, message: "Failed to delete the photo." };
  }

  revalidateTag("photos");
  return { success: true, message: "Photo has deleted successfully." };
}

export async function getLikeStatus(id: string, userId?: string) {
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

export async function createLike(id: string) {
  const session = await getSession();

  try {
    await prisma.like.create({
      data: { photoId: id, userId: session.id! },
    });
  } catch {
    return { success: false, message: "Failed to like the photo." };
  }

  revalidateTag(`photo-${id}-likeStatus`);
  return { success: true, message: "Successfully liked the photo." };
}

export async function deleteLike(id: string) {
  const session = await getSession();

  try {
    await prisma.like.deleteMany({
      where: { photoId: id, userId: session.id },
    });
  } catch {
    return { success: false, message: "Failed to dislike the photo." };
  }

  revalidateTag(`photo-${id}-likeStatus`);
  return { success: true, message: "Successfully disliked the photo." };
}

export async function getComments(id: string) {
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

export async function createComment(prevState: any, formData: FormData) {
  const result = createCommentSchema.safeParse({
    content: formData.get("content"),
    photoId: formData.get("photoId"),
  });

  if (!result.success) {
    return { errors: result.error.flatten() };
  }

  const session = await getSession();

  try {
    await prisma.comment.create({
      data: {
        content: result.data.content,
        user: { connect: { id: session.id } },
        photo: { connect: { id: result.data.photoId } },
      },
    });
  } catch {
    return { success: false, message: "Failed to create a comment." };
  }

  revalidateTag(`photo-${result.data.photoId}-comments`);
  return { success: true, message: "Comment has created successfully." };
}

export async function createReply(prevState: any, formData: FormData) {
  const result = createReplyUpdateCommentSchema.safeParse({
    content: formData.get("content"),
    photoId: formData.get("photoId"),
    commentId: formData.get("parentId"),
  });

  if (!result.success) {
    return { errors: result.error.flatten() };
  }

  const session = await getSession();

  try {
    await prisma.comment.create({
      data: {
        content: result.data.content,
        user: { connect: { id: session.id } },
        photo: { connect: { id: result.data.photoId } },
        parent: { connect: { id: result.data.commentId } },
      },
    });
  } catch {
    return { success: false, message: "Failed to create a reply." };
  }

  revalidateTag(`photo-${result.data.photoId}-comments`);
  return { success: true, message: "Reply has created successfully." };
}

export async function updateComment(prevState: any, formData: FormData) {
  const result = createReplyUpdateCommentSchema.safeParse({
    content: formData.get("content"),
    photoId: formData.get("photoId"),
    commentId: formData.get("commentId"),
  });

  if (!result.success) {
    return { errors: result.error.flatten() };
  }

  try {
    await prisma.comment.update({
      data: { content: result.data.content },
      where: { id: result.data.commentId },
    });
  } catch {
    return { success: false, message: "Failed to update the comment." };
  }

  revalidateTag(`photo-${result.data.photoId}-comments`);
  return { success: true, message: "Comment has updated successfully." };
}

export async function deleteComment(prevState: any, formData: FormData) {
  const result = deleteCommentSchema.safeParse({
    photoId: formData.get("photoId"),
    commentId: formData.get("commentId"),
  });

  if (!result.success) {
    return { errors: result.error.flatten() };
  }

  try {
    let target;

    // check if a comment has replies
    const numOfReplies = await prisma.comment.count({
      where: { photoId: result.data.photoId, parentId: result.data.commentId },
    });

    if (numOfReplies > 0) {
      // if true, update parent's user, content to null, Deleted comment
      target = await prisma.comment.update({
        where: { id: result.data.commentId },
        data: { userId: { set: null }, content: "Deleted comment" },
        select: { id: true },
      });
    } else {
      // else, delete the comment
      // it can be both a parent without replies and a reply
      // if deleted comment was only reply of deleted parent, delete the parent as well
      await prisma.$transaction(async (tx) => {
        target = await tx.comment.delete({
          where: { id: result.data.commentId },
          select: { id: true },
        });
        await tx.comment.deleteMany({
          where: {
            photoId: result.data.photoId,
            userId: null,
            replies: { every: { id: target.id } },
          },
        });
      });
    }
  } catch {
    return { success: false, message: "Failed to delete the comment." };
  }

  revalidateTag(`photo-${result.data.photoId}-comments`);
  return { success: true, message: "Comment has deleted successfully." };
}
