"use client";

import OauthLoader from "@/components/oauth-loader";
import api from "@/libs/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Kakao() {
  const ignore = useRef(false);
  const params = useSearchParams();
  const code = params.get("code");
  const redirectUri = params.get("state");
  const router = useRouter();

  useEffect(() => {
    if (ignore.current) return;
    api(`/oauth/kakao?code=${code}`, { method: "POST" }).then(() => {
      router.replace(redirectUri!);
    });
    return () => {
      ignore.current = true;
    };
  }, [code, router, redirectUri]);

  return <OauthLoader />;
}
