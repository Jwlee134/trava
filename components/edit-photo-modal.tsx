"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BaseResponse,
  UpdatePhotoBody,
  deletePhoto,
  updatePhoto,
} from "@/libs/api";
import { useState } from "react";
import { AxiosError } from "axios";

interface EditPhotoFormProps {
  title: string | null;
  caption: string | null;
}

export default function EditPhotoModal({ title, caption }: EditPhotoFormProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit } = useForm<UpdatePhotoBody>({
    defaultValues: { title: title ?? "", caption: caption ?? "" },
  });
  const [response, setResponse] = useState<BaseResponse | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  function onError(error: AxiosError<BaseResponse>) {
    setResponse(error.response?.data!);
  }

  const { mutate: update, isPending: isUpdating } = useMutation<
    BaseResponse,
    AxiosError<BaseResponse>,
    UpdatePhotoBody
  >({
    mutationFn: (data: UpdatePhotoBody) => updatePhoto(id as string, data),
    onSuccess(data) {
      setResponse(data);
      queryClient.invalidateQueries({ queryKey: ["photo", id] });
      setIsEdit(false);
      (document.getElementById("edit_modal") as HTMLDialogElement).close();
    },
    onError,
  });
  const { mutate, isPending: isDeleting } = useMutation<
    BaseResponse,
    AxiosError<BaseResponse>,
    string
  >({
    mutationFn: deletePhoto,
    onSuccess(data) {
      setResponse(data);
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "my-photos"] });
      router.back();
    },
    onError,
  });

  function onValid(data: UpdatePhotoBody) {
    update(data);
  }

  function handleEditClick() {
    setIsEdit(true);
    (document.getElementById("edit_modal") as HTMLDialogElement).showModal();
  }

  return (
    <>
      <div>
        <button aria-label="edit photo" onClick={handleEditClick}>
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
            <button
              tabIndex={isEdit ? undefined : -1}
              aria-label="close modal"
              onClick={() => setIsEdit(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg">Edit Photo</h3>
              <input
                tabIndex={isEdit ? undefined : -1}
                aria-label="title"
                {...register("title")}
                placeholder="Title"
                className="input input-bordered w-full"
              />
              <textarea
                tabIndex={isEdit ? undefined : -1}
                aria-label="caption"
                {...register("caption")}
                placeholder="Caption"
                className="textarea textarea-bordered w-full"
              ></textarea>
              <button
                tabIndex={isEdit ? undefined : -1}
                disabled={isUpdating}
                className={`btn btn-block ${isUpdating ? "btn-disabled" : ""}`}
              >
                {isUpdating ? (
                  <>
                    <span className="loading loading-spinner"></span> Updating
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
            <div className="divider"></div>
          </form>
          <button
            tabIndex={isEdit ? undefined : -1}
            onClick={() => mutate(id as string)}
            disabled={isDeleting}
            className={`btn btn-block btn-error ${
              isDeleting ? "btn-disabled" : ""
            }`}
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner"></span> Deleting
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </dialog>
      <p
        key={response?.timestamp}
        aria-live="polite"
        className="sr-only"
        role="status"
      >
        {response?.message}
      </p>
    </>
  );
}
