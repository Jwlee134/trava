import prisma from "@/libs/db";
import { setSession } from "@/libs/session";
import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  try {
    const {
      data: { access_token },
    } = await axios<{ access_token: string }>({
      url: "https://oauth2.googleapis.com/token",
      method: "POST",
      params: {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      },
    });

    const { data } = await axios.get<{
      id: string;
      name: string;
      picture: string;
    }>("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let user = await prisma.user.findFirst({
      where: { googleId: data.id },
      select: { id: true, isAdmin: true },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: data.id,
          username: data.name,
          avatar: data.picture,
        },
        select: { id: true, isAdmin: true },
      });
    }

    await setSession(user.id, user.isAdmin);
  } catch (error) {
    if (error instanceof AxiosError) {
      return Response.json(
        {
          success: false,
          message: "Failed to login.",
          timestamp: Date.now(),
          data: { description: error.response?.data.error_description },
        },
        { status: 500 }
      );
    }
  }

  return Response.json({
    success: true,
    message: "You are logged in successfully.",
    timestamp: Date.now(),
  });
}
