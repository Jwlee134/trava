"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

export default function EditPhotoButton() {
  const { pending } = useFormStatus();
  const submitting = useRef(false);

  useEffect(() => {
    if (pending) submitting.current = true;
    if (submitting.current && !pending)
      (document.getElementById("edit_modal") as HTMLDialogElement).close();
  }, [pending]);

  return (
    <button
      disabled={pending}
      className={`btn btn-block mb-3 ${pending && "btn-disabled"}`}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner"></span> Updating
        </>
      ) : (
        "Update"
      )}
    </button>
  );
}
