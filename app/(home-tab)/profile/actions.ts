"use server";

import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { Prisma } from "@prisma/client";

export type GetProfileReturnType = Prisma.PromiseReturnType<typeof getProfile>;

export async function getProfile(id: string) {
  const session = await getSession();

  return await prisma.user.findUnique({
    where: { id },
    select: { avatar: true, username: true },
  });
}

export async function logout() {
  const session = await getSession();
  session.destroy();

  return { success: true, message: "Successfully logged out." };
}
