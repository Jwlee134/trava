"use client";

import { uploadPhoto } from "@/app/(home-tab)/upload/actions";
import { useFormState } from "react-dom";
import UploadPhotoButton from "./upload-photo-button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPhotoForm() {
  const [state, action] = useFormState(uploadPhoto, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.push(`/photos/${state.data?.id}`);
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-3 items-center p-3">
      <input
        name="photo"
        type="file"
        className={`file-input file-input-bordered w-full max-w-xs ${
          state?.errors?.fieldErrors.photo ? "input-error" : ""
        }`}
        accept="image/*"
        required
      />
      {state?.errors?.fieldErrors.photo && (
        <span className="text-sm text-error">
          {state.errors.fieldErrors.photo[0]}
        </span>
      )}
      <input
        name="title"
        placeholder="Title(optional)"
        className="input input-bordered w-full max-w-xs"
      />
      <textarea
        name="caption"
        placeholder="Caption(optional)"
        className="textarea textarea-bordered w-full max-w-xs"
      ></textarea>
      <UploadPhotoButton />
    </form>
  );
}
