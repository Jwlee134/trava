"use client";

import { useFormStatus } from "react-dom";

export default function DeletePhotoButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className={`btn btn-block btn-error ${pending && "btn-disabled"}`}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner"></span> Deleting
        </>
      ) : (
        "Delete"
      )}
    </button>
  );
}
