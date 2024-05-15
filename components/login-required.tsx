"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoLogoGoogle } from "react-icons/io5";
import { RiKakaoTalkFill } from "react-icons/ri";

export default function LoginRequired() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-lg mb-8">
        Sign in to use the full features of Trava.
      </h1>
      <div className="flex flex-col gap-2">
        <Link
          href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process
            .env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}&redirect_uri=${process.env
            .NEXT_PUBLIC_GOOGLE_REDIRECT_URI!}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&state=${pathname}`}
          className="btn btn-wide"
        >
          <IoLogoGoogle size={24} />
          <span className="ml-2">Continue with Google</span>
        </Link>
        <Link
          href={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env
            .NEXT_PUBLIC_KAKAO_REST_API_KEY!}&redirect_uri=${process.env
            .NEXT_PUBLIC_KAKAO_REDIRECT_URL!}&response_type=code&state=${pathname}`}
          className="btn btn-wide"
        >
          <RiKakaoTalkFill size={24} />
          <span className="ml-2">Continue with Kakao</span>
        </Link>
      </div>
    </div>
  );
}
