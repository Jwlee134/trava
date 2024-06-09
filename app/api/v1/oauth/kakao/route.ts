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
      url: "https://kauth.kakao.com/oauth/token",
      method: "POST",
      params: {
        client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL,
      },
    });

    const { data } = await axios.get<{
      id: number;
      properties: { nickname: string; profile_image: string };
    }>("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let user = await prisma.user.findFirst({
      where: { kakaoId: String(data.id) },
      select: { id: true, isAdmin: true },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          kakaoId: String(data.id),
          username: data.properties.nickname,
          avatar: data.properties.profile_image,
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
          data: {
            description: error.response?.data.error_description,
            code: error.response?.data.error_code,
          },
          timestamp: Date.now(),
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
