"use server";

import prisma from "@/libs/db";
import getSession from "@/libs/session";
import { redirect } from "next/navigation";

export async function getProfile() {
  const session = await getSession();
  if (!session.id) return null;
  return await prisma.user.findUnique({
    where: { id: session.id },
    select: { avatar: true, username: true },
  });
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
