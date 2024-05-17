import FullScreenPage from "@/components/full-screen-page";
import ProtectedPage from "@/components/protected-page";
import UploadPhotoForm from "@/components/upload-photo-form";

export default function Upload() {
  return (
    <ProtectedPage>
      <FullScreenPage>
        <UploadPhotoForm />
      </FullScreenPage>
    </ProtectedPage>
  );
}
