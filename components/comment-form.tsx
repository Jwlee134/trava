import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { UploadCommentButton } from "./upload-comment-button";
import { useFormState } from "react-dom";
import { createComment, createReply } from "@/app/photos/[id]/actions";

interface CommentFormProps {
  parentId?: string;
  setParentId?: Dispatch<SetStateAction<string>>;
}

export function CommentForm({ parentId, setParentId }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const id = useParams().id as string;
  const [state, action] = useFormState(
    parentId ? createReply : createComment,
    null
  );

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      if (setParentId) setParentId("");
    }
  }, [state?.success, setParentId]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex items-center gap-2 py-3"
    >
      <input type="hidden" name="photoId" value={id} />
      {parentId ? (
        <input type="hidden" name="parentId" value={parentId} />
      ) : null}
      <textarea
        name="content"
        className={`textarea textarea-bordered textarea-xs w-full ${
          state?.errors?.fieldErrors.content ? "textarea-error" : ""
        }`}
        placeholder="Write a comment..."
        required
      ></textarea>
      <UploadCommentButton />
    </form>
  );
}
