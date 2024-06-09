import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { CommentForm } from "./comment-form";
import { IronSession } from "iron-session";
import { SessionData } from "@/libs/session";
import { AnimatePresence, motion } from "framer-motion";
import { GetCommentsReturnType } from "@/app/photos/[id]/actions";
dayjs.extend(relativeTime);

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export default function Comment({
  id,
  user,
  content,
  createdAt,
  replies,
  session,
  setEditCommentData,
}: Optional<GetCommentsReturnType["comments"][number], "replies"> & {
  session: IronSession<SessionData>;
  setEditCommentData: Dispatch<
    SetStateAction<{
      id: string;
      value: string;
    }>
  >;
}) {
  const [parentId, setParentId] = useState("");

  function handleEditClick() {
    (
      document.getElementById("edit_comment_modal") as HTMLDialogElement
    ).showModal();
    setEditCommentData({ id, value: content });
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="chat chat-start"
        >
          <div className="chat-image avatar">
            {user ? (
              <div className="relative size-10 rounded-full overflow-hidden">
                <Image
                  fill
                  src={user.avatar}
                  alt={user.username}
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10">
                  <span className="text-2xl">?</span>
                </div>
              </div>
            )}
          </div>
          {user ? (
            <div className="chat-header space-x-1">
              <span>{user.username}</span>
              <time className="text-xs opacity-50">
                {dayjs(createdAt).from(Date.now())}
              </time>
            </div>
          ) : null}
          <div className="chat-bubble whitespace-pre-line break-words">
            {content}
          </div>
          {session.id && user && (
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
      </AnimatePresence>
      {parentId && (
        <div className="chat-footer w-full pl-14">
          <CommentForm parentId={parentId} setParentId={setParentId} />
        </div>
      )}
      {replies?.length ? (
        <div className="pl-14">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              session={session}
              setEditCommentData={setEditCommentData}
              {...reply}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
