"use client";

import { postPhoto } from "@/libs/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Form {
  photos: FileList;
  title: string;
  caption: string;
}

export default function UploadPhotoForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();
  const { mutate, isPending } = useMutation({
    mutationFn: postPhoto,
    onSettled(data) {
      router.push(`/photos/${data?.id}`);
    },
  });

  function onValid({ photos, title, caption }: Form) {
    const formData = new FormData();
    formData.append("photo", photos[0]);
    formData.append("title", title);
    formData.append("caption", caption);
    mutate(formData);
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col gap-3 items-center"
    >
      <input
        {...register("photos", { required: "Photo is required." })}
        id="file"
        type="file"
        className={`file-input file-input-bordered w-full max-w-sm ${
          errors.photos?.message && "input-error"
        }`}
        accept="image/*"
      />
      <input
        {...register("title")}
        placeholder="Title(optional)"
        className="input input-bordered w-full max-w-sm"
      />
      <textarea
        {...register("caption")}
        placeholder="Caption(optional)"
        className="textarea textarea-bordered w-full max-w-sm"
      ></textarea>
      <button
        disabled={isPending}
        className={`btn w-full max-w-sm ${isPending && "btn-disabled"}`}
      >
        {isPending ? (
          <>
            <span className="loading loading-spinner"></span> Uploading
          </>
        ) : (
          "Upload"
        )}
      </button>
    </form>
  );
}
