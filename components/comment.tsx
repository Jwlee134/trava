import { GetCommentsReturnType } from "@/app/api/v1/photos/[id]/comments/route";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { CommentForm } from "./comment-form";
import { IronSession } from "iron-session";
import { SessionData } from "@/libs/session";
import { PostCommentBody } from "./comments";
import { UseFormSetValue } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
dayjs.extend(relativeTime);

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export default function Comment({
  id,
  user,
  content,
  createdAt,
  replies,
  session,
  setSelectedId,
  setValue,
}: Optional<GetCommentsReturnType["comments"][number], "replies"> & {
  session: IronSession<SessionData>;
  setSelectedId: Dispatch<SetStateAction<string>>;
  setValue: UseFormSetValue<PostCommentBody>;
}) {
  const [parentId, setParentId] = useState("");

  function handleEditClick() {
    (
      document.getElementById("edit_comment_modal") as HTMLDialogElement
    ).showModal();
    setValue("content", content);
    setSelectedId(id);
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring" }}
        className="chat chat-start"
      >
        <div className="chat-image avatar">
          <div className="relative size-10 rounded-full overflow-hidden">
            <Image
              fill
              src={user.avatar}
              alt={user.username}
              className="object-cover"
            />
          </div>
        </div>
        <div className="chat-header space-x-1">
          <span>{user.username}</span>
          <time className="text-xs opacity-50">
            {dayjs(createdAt).from(Date.now())}
          </time>
        </div>
        <div className="chat-bubble whitespace-pre-line break-words">
          {content}
        </div>
        {session.id && (
          <div className="chat-footer *:opacity-50 space-x-2">
            {replies && (
              <button
                onClick={() => (parentId ? setParentId("") : setParentId(id))}
              >
                Reply
              </button>
            )}
            {session.id === user.id && (
              <button onClick={handleEditClick}>Edit</button>
            )}
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {parentId && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="chat-footer w-full pl-14"
          >
            <CommentForm parentId={parentId} setParentId={setParentId} />
          </motion.div>
        )}
      </AnimatePresence>
      {replies?.length ? (
        <div className="pl-14">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              session={session}
              setSelectedId={setSelectedId}
              setValue={setValue}
              {...reply}
            />
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}
