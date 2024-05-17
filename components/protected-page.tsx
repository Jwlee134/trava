import getSession from "@/libs/session";
import { ReactNode } from "react";
import LoginRequired from "./login-required";
import FullScreenPage from "./full-screen-page";

export default async function ProtectedPage({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  return (
    <>
      {!session.id ? (
        <FullScreenPage>
          <LoginRequired />
        </FullScreenPage>
      ) : (
        children
      )}
    </>
  );
}
