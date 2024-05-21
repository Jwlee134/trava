import FullScreenPage from "@/components/full-screen-page";
import ProtectedPage from "@/components/protected-page";
import UploadPhotoButton from "@/components/upload-photo-button";
import { upload } from "./actions";

export default function Upload() {
  return (
    <ProtectedPage>
      <FullScreenPage>
        <form action={upload} className="flex flex-col gap-3 items-center">
          <input
            id="file"
            name="photo"
            type="file"
            className={`file-input file-input-bordered w-full max-w-sm`}
            accept="image/*"
            required
          />
          <input
            name="title"
            placeholder="Title(optional)"
            className="input input-bordered w-full max-w-sm"
          />
          <textarea
            name="caption"
            placeholder="Caption(optional)"
            className="textarea textarea-bordered w-full max-w-sm"
          ></textarea>
          <UploadPhotoButton />
        </form>
      </FullScreenPage>
    </ProtectedPage>
  );
}
