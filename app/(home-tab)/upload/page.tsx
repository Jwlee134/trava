import FullScreenPage from "@/components/full-screen-page";
import getSession from "@/libs/session";
import LoginRequired from "@/components/login-required";
import UploadPhotoForm from "@/components/upload-photo-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload",
};

export default async function Page() {
  const session = await getSession();

  return (
    <FullScreenPage>
      {!session.id ? <LoginRequired /> : <UploadPhotoForm />}
    </FullScreenPage>
  );
}
