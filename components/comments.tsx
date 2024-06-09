import {
  BaseResponse,
  deleteComment,
  getComments,
  updateComment,
} from "@/libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Comment from "./comment";
import { CommentForm } from "./comment-form";
import { IronSession } from "iron-session";
import { SessionData } from "@/libs/session";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AxiosError } from "axios";

export interface PostCommentBody {
  content: string;
}

export default function Comments({
  session,
}: {
  session: IronSession<SessionData>;
}) {
  const { id } = useParams();
  const queryKey = ["photo", id, "comments"];
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey,
    queryFn: () => getComments(id as string),
  });
  const [selectedId, setSelectedId] = useState("");
  const { register, handleSubmit, setValue } = useForm<PostCommentBody>();
  const [response, setResponse] = useState<BaseResponse | null>(null);

  function onSuccess(data: BaseResponse) {
    console.log(data);
    setResponse(data);
    queryClient.invalidateQueries({ queryKey });
    setValue("content", "");
    setSelectedId("");
    (
      document.getElementById("edit_comment_modal") as HTMLDialogElement
    ).close();
  }
  function onError(error: Error) {
    if (error instanceof AxiosError) {
      setResponse(error.response?.data);
    }
  }

  const { isPending: isUpdating, mutate: updateFn } = useMutation({
    mutationFn: (data: PostCommentBody) =>
      updateComment(id as string, selectedId, data),
    onSuccess,
    onError: (error, variables, context) => onError(error),
  });
  const { isPending: isDeleting, mutate: deleteFn } = useMutation({
    mutationFn: () => deleteComment(id as string, selectedId),
    onSuccess,
    onError: (error, variables, context) => onError(error),
  });

  function onValid(data: PostCommentBody) {
    updateFn(data);
  }

  if (!data) return null;

  return (
    <>
      <h1 className="text-lg pt-5">
        {data.count} {data.count === 1 ? "comment" : "comments"}
      </h1>
      {session.id && <CommentForm />}
      {data.comments.map((comment) => (
        <Comment
          key={comment.id}
          session={session}
          setSelectedId={setSelectedId}
          setValue={setValue}
          {...comment}
        />
      ))}
      <dialog id="edit_comment_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              aria-label="close modal"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <form onSubmit={handleSubmit(onValid)}>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg">Edit Comment</h3>
              <textarea
                {...register("content")}
                placeholder="Caption"
                className="textarea textarea-bordered w-full"
              ></textarea>
              <button
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
            disabled={isDeleting}
            className={`btn btn-block btn-error ${
              isDeleting ? "btn-disabled" : ""
            }`}
            onClick={() => deleteFn()}
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
