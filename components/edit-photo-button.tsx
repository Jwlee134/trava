"use client";

import api from "@/libs/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface EditPhotoButtonProps {
  title: string | null;
  caption: string | null;
}

interface Form {
  title: string;
  caption: string;
}

async function updatePhoto(id: number, body: Form) {
  await api(`/photos/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}

async function deletePhoto(id: number) {
  await api(`/photos/${id}`, { method: "DELETE" });
}

export default function EditPhotoButton({
  title,
  caption,
}: EditPhotoButtonProps) {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<Form>({
    defaultValues: { title: title ?? "", caption: caption ?? "" },
  });

  function handleEditClick() {
    (document.getElementById("edit_modal") as HTMLDialogElement).showModal();
  }

  function handleDeleteClick() {
    setIsLoading(true);
    deletePhoto(+params.id).then(() => {
      router.replace("/");
    });
  }

  async function onValid({ title, caption }: Form) {
    await updatePhoto(+params.id, { title, caption });
  }

  return (
    <>
      <button className="btn btn-ghost" onClick={handleEditClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg">Edit</h3>
              <input
                placeholder="Title"
                className="input input-bordered w-full"
                {...register("title")}
              />
              <textarea
                placeholder="Caption"
                className="textarea textarea-bordered w-full"
                {...register("caption")}
              ></textarea>
            </div>
            <div className="divider"></div>
            <button className="btn btn-block mb-3">Update</button>
          </form>
          <button
            onClick={handleDeleteClick}
            className={`btn btn-error btn-block ${isLoading && "btn-disabled"}`}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span> Deleting
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </dialog>
    </>
  );
}
