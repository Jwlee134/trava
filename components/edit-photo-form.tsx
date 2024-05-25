"use client";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatePhotoBody, updatePhoto } from "@/libs/api";

interface EditPhotoFormProps {
  title: string | null;
  caption: string | null;
}

export default function EditPhotoForm({ title, caption }: EditPhotoFormProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<UpdatePhotoBody>({
    defaultValues: { title: title ?? "", caption: caption ?? "" },
  });
  const { mutate: update, isPending } = useMutation({
    mutationFn: (data: UpdatePhotoBody) => updatePhoto(id as string, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["photo", id] });
      (document.getElementById("edit_modal") as HTMLDialogElement).close();
    },
  });

  function onValid(data: UpdatePhotoBody) {
    update(data);
  }

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg">Edit</h3>
        <input
          {...register("title")}
          placeholder="Title"
          className="input input-bordered w-full"
        />
        <textarea
          {...register("caption")}
          placeholder="Caption"
          className="textarea textarea-bordered w-full"
        ></textarea>
        <button
          disabled={isPending}
          className={`btn btn-block ${isPending && "btn-disabled"}`}
        >
          {isPending ? (
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
  );
}
