"use client";

import { deletePhoto, updatePhoto } from "@/app/photos/[id]/actions";
import { useParams, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import DeletePhotoButton from "./delete-photo-button";
import UpdateButton from "./update-button";
import { useEffect, useRef } from "react";

interface EditPhotoModalProps {
  title: string;
  caption: string;
}

export default function EditPhotoModal({
  title,
  caption,
}: EditPhotoModalProps) {
  const id = useParams().id;
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [updateState, updateAction] = useFormState(updatePhoto, null);
  const [deleteState, deleteAction] = useFormState(deletePhoto, null);

  function handleEditClick() {
    (document.getElementById("edit_modal") as HTMLDialogElement).showModal();
  }

  useEffect(() => {
    if (updateState?.success || deleteState?.success) {
      if (updateState?.success) {
        formRef.current?.reset();
      }
      if (deleteState?.success) {
        router.replace("/");
      }
      (document.getElementById("edit_modal") as HTMLDialogElement).close();
    }
  }, [updateState, deleteState, router]);

  return (
    <>
      <div>
        <button onClick={handleEditClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
          </svg>
        </button>
      </div>
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form ref={formRef} action={updateAction}>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg">Edit Photo</h3>
              <input type="hidden" name="photoId" value={id} />
              <input
                name="title"
                placeholder="Title"
                className="input input-bordered w-full"
                defaultValue={title}
              />
              <textarea
                name="caption"
                placeholder="Caption"
                className="textarea textarea-bordered w-full"
                defaultValue={caption}
              ></textarea>
              <UpdateButton />
            </div>
            <div className="divider"></div>
          </form>
          <form action={deleteAction}>
            <input type="hidden" name="photoId" value={id} />
            <DeletePhotoButton />
          </form>
        </div>
      </dialog>
    </>
  );
}
