import prisma from "@/libs/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type GetProfileReturnType = Prisma.PromiseReturnType<typeof getProfile>;

async function getProfile(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: { avatar: true, username: true },
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id")!;
  const profile = await getProfile(id);

  return NextResponse.json(profile);
}
