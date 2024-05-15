import getSession from "@/libs/session";
import { ReactNode } from "react";
import LoginRequired from "./login-required";

export default async function ProtectedPage({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  return (
    <>
      {!session.id ? (
        <div className="min-h-[100dvh] flex items-center justify-center">
          <LoginRequired />
        </div>
      ) : (
        children
      )}
    </>
  );
}
