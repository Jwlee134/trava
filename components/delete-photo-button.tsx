"use client";

import { deletePhoto } from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export default function DeletePhotoButton() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deletePhoto,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "my-photos"] });
      router.back();
    },
  });

  function handleClick() {
    mutate(id as string);
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`btn btn-block btn-error ${isPending && "btn-disabled"}`}
    >
      {isPending ? (
        <>
          <span className="loading loading-spinner"></span> Deleting
        </>
      ) : (
        "Delete"
      )}
    </button>
  );
}
