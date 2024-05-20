"use client";

import { useFormStatus } from "react-dom";

export default function UploadPhotoButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className={`btn w-full max-w-sm ${pending && "btn-disabled"}`}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner"></span> Uploading
        </>
      ) : (
        "Upload"
      )}
    </button>
  );
}
