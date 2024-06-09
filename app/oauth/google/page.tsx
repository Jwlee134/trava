"use client";

import FullScreenPage from "@/components/full-screen-page";
import OauthLoader from "@/components/oauth-loader";
import api, { BaseResponse } from "@/libs/api";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function Component() {
  const ignore = useRef(false);
  const params = useSearchParams();
  const code = params.get("code");
  const redirectUri = params.get("state");
  const router = useRouter();
  const [response, setResponse] = useState<
    (BaseResponse & Partial<{ data: { description: string } }>) | null
  >(null);

  useEffect(() => {
    if (ignore.current) return;
    api<BaseResponse>(`/oauth/google?code=${code}`, {
      method: "POST",
    })
      .then((res) => {
        setResponse(res.data);
        router.replace(redirectUri!);
      })
      .catch(
        (err: AxiosError<BaseResponse & { data: { description: string } }>) => {
          setResponse(err.response?.data!);
        }
      );
    return () => {
      ignore.current = true;
    };
  }, [code, router, redirectUri]);

  return (
    <>
      {response?.success !== false ? (
        <OauthLoader />
      ) : (
        <FullScreenPage>
          <div className="flex flex-col items-center">
            <div>{response.data?.description}</div>
          </div>
        </FullScreenPage>
      )}
      <p
        key={response?.timestamp}
        aria-live="polite"
        className="sr-only"
        role="status"
      >
        {response?.message}
      </p>
    </>
  );
}

export default function Google() {
  return (
    <Suspense>
      <Component />
    </Suspense>
  );
}
