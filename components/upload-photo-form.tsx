"use client";

import { postPhoto } from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

interface Form {
  photo: File;
  title: string;
  caption: string;
}

export default function UploadPhotoForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm<Form>();
  const { mutate, isPending } = useMutation({
    mutationFn: postPhoto,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      router.push(`/photos/${data?.id}`);
    },
  });

  function onValid({ photo, title, caption }: Form) {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("title", title);
    formData.append("caption", caption);
    mutate(formData);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file.size > 5_242_880) {
      setError("photo", { message: "Photo size should be less than 5MB." });
      e.target.value = "";
    } else {
      if (errors.photo?.message) clearErrors("photo");
      setValue("photo", file);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col gap-3 items-center p-3"
    >
      <input
        id="file"
        type="file"
        className={`file-input file-input-bordered w-full max-w-xs ${
          errors.photo?.message ? "input-error" : ""
        }`}
        accept="image/*"
        onChange={handleChange}
        required
      />
      {errors.photo?.message && (
        <span className="text-sm text-error">{errors.photo.message}</span>
      )}
      <input
        {...register("title")}
        placeholder="Title(optional)"
        className="input input-bordered w-full max-w-xs"
      />
      <textarea
        {...register("caption")}
        placeholder="Caption(optional)"
        className="textarea textarea-bordered w-full max-w-xs"
      ></textarea>
      <button
        disabled={isPending}
        className={`btn w-full max-w-xs ${isPending && "btn-disabled"}`}
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
