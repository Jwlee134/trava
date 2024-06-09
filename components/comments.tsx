"use client";

import { CommentForm } from "./comment-form";
import { IronSession } from "iron-session";
import { SessionData } from "@/libs/session";
import {
  GetCommentsReturnType,
  deleteComment,
  updateComment,
} from "@/app/photos/[id]/actions";
import { useEffect, useRef, useState } from "react";
import Comment from "./comment";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import DeleteCommentButton from "./delete-comment-button";
import UpdateButton from "./update-button";

interface CommentsProps {
  session: IronSession<SessionData>;
  data: GetCommentsReturnType;
}

export default function Comments({ session, data }: CommentsProps) {
  const id = useParams().id as string;
  const formRef = useRef<HTMLFormElement>(null);
  const [editCommentData, setEditCommentData] = useState({ id: "", value: "" });
  const [updateState, updateAction] = useFormState(updateComment, null);
  const [deleteState, deleteAction] = useFormState(deleteComment, null);

  useEffect(() => {
    if (updateState?.success || deleteState?.success) {
      if (updateState?.success) {
        formRef.current?.reset();
      }
      (
        document.getElementById("edit_comment_modal") as HTMLDialogElement
      ).close();
    }
  }, [updateState, deleteState]);

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
          setEditCommentData={setEditCommentData}
          {...comment}
        />
      ))}
      <dialog id="edit_comment_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form action={updateAction} ref={formRef}>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-lg">Edit Comment</h3>
              <input type="hidden" name="photoId" value={id} />
              <input
                type="hidden"
                name="commentId"
                value={editCommentData.id}
              />
              <textarea
                name="content"
                placeholder="Content"
                className="textarea textarea-bordered w-full"
                defaultValue={editCommentData.value}
                required
              ></textarea>
              <UpdateButton />
            </div>
            <div className="divider"></div>
          </form>
          <form action={deleteAction}>
            <input type="hidden" name="photoId" value={id} />
            <input type="hidden" name="commentId" value={editCommentData.id} />
            <DeleteCommentButton />
          </form>
        </div>
      </dialog>
    </>
  );
}
