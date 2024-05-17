"use client";

import api from "@/libs/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Form {
  photo: FileList;
  title?: string;
  caption?: string;
}

export default function UploadPhotoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onValid(data: Form) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("photo", data.photo[0]);
    if (data.title) formData.append("title", data.title);
    if (data.caption) formData.append("caption", data.caption);
    api<{ id: number }>("/photo", { method: "POST", body: formData })
      .then(({ id }) => {
        router.push(`/photos/${id}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col gap-3 items-center"
    >
      <input
        id="file"
        type="file"
        className={`file-input file-input-bordered w-full max-w-sm ${
          errors.photo && "input-error"
        }`}
        accept="image/*"
        {...register("photo", { required: true })}
      />
      <input
        placeholder="Title(optional)"
        className="input input-bordered w-full max-w-sm"
        {...register("title")}
      />
      <textarea
        placeholder="Caption(optional)"
        className="textarea textarea-bordered w-full max-w-sm"
        {...register("caption")}
      ></textarea>
      <button className={`btn w-full max-w-sm ${isLoading && "btn-disabled"}`}>
        {isLoading ? (
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
