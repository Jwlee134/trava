"use client";

import OauthLoader from "@/components/oauth-loader";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Component() {
  const ignore = useRef(false);
  const params = useSearchParams();
  const code = params.get("code");
  const redirectUri = params.get("state");
  const router = useRouter();

  useEffect(() => {
    if (ignore.current) return;
    fetch(`/api/v1/oauth/kakao?code=${code}`, { method: "POST" }).then(() => {
      router.replace(redirectUri!);
    });
    return () => {
      ignore.current = true;
    };
  }, [code, router, redirectUri]);

  return <OauthLoader />;
}

export default function Kakao() {
  return (
    <Suspense>
      <Component />
    </Suspense>
  );
}
