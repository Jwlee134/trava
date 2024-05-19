import prisma from "@/libs/db";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const userId = +searchParams.get("userId")!;

  return Response.json(
    Boolean(
      await prisma.like.findUnique({
        where: { id: { photoId: +params.id, userId } },
      })
    )
  );
}
