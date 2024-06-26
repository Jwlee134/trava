import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCommentBody } from "./comments";
import { BaseResponse, postChildComment, postComment } from "@/libs/api";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useState } from "react";
import { AxiosError } from "axios";

interface CommentFormProps {
  parentId?: string;
  setParentId?: Dispatch<SetStateAction<string>>;
}

export function CommentForm({ parentId, setParentId }: CommentFormProps) {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PostCommentBody>();
  const queryClient = useQueryClient();
  const [response, setResponse] = useState<BaseResponse | null>(null);

  const mutationFn = (data: PostCommentBody) =>
    parentId
      ? postChildComment(id as string, parentId, data)
      : postComment(id as string, data);

  const { mutate, isPending } = useMutation<
    BaseResponse,
    AxiosError<BaseResponse>,
    PostCommentBody
  >({
    mutationFn,
    onSuccess: (data) => {
      setResponse(data);
      queryClient.invalidateQueries({ queryKey: ["photo", id, "comments"] });
      setValue("content", "");
      if (setParentId) setParentId("");
    },
    onError: (err) => {
      setResponse(err.response?.data!);
    },
  });

  function onValid(data: PostCommentBody) {
    mutate(data);
  }

  return (
    <form
      className="flex items-center gap-2 py-3"
      onSubmit={handleSubmit(onValid)}
    >
      <textarea
        aria-label={parentId ? "reply" : "comment"}
        className={`textarea textarea-bordered textarea-xs w-full ${
          errors.content?.message ? "textarea-error" : ""
        }`}
        placeholder={`Write a ${parentId ? "reply" : "comment"}...`}
        {...register("content", { required: true })}
      ></textarea>
      <button
        aria-label={`${parentId ? "reply" : "comment"} upload`}
        disabled={isPending}
        className={`btn btn-square ${isPending ? "btn-disabled" : ""}`}
      >
        {isPending ? (
          <>
            <span className="loading loading-spinner"></span>
          </>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}
      </button>
      <p
        key={response?.timestamp}
        aria-live="polite"
        className="sr-only"
        role="status"
      >
        {response?.message}
      </p>
    </form>
  );
}
