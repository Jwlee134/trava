import FullScreenPage from "@/components/full-screen-page";
import getSession from "@/libs/session";
import LoginRequired from "@/components/login-required";
import UploadPhotoForm from "@/components/upload-photo-form";

export default async function Page() {
  const session = await getSession();

  return (
    <FullScreenPage>
      {!session.id ? <LoginRequired /> : <UploadPhotoForm />}
    </FullScreenPage>
  );
}
