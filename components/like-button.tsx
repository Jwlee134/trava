"use client";

import { deleteLike, getPhotoLikeStatus, postLike } from "@/libs/api";
import { SessionData } from "@/libs/session";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IronSession } from "iron-session";
import { useParams } from "next/navigation";

interface LikeButtonProps {
  session: IronSession<SessionData>;
}

export default function LikeButton({ session }: LikeButtonProps) {
  const { id } = useParams();
  const queryKey = ["photo", id, "like-status"];
  const { data } = useQuery({
    queryKey,
    queryFn: () => getPhotoLikeStatus(id as string, session.id),
  });

  const queryClient = useQueryClient();

  async function onMutate(isPostLike: boolean) {
    await queryClient.cancelQueries({ queryKey });
    const prevState = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(
      queryKey,
      ({ isLiked, likeCount }: { isLiked: boolean; likeCount: number }) => ({
        isLiked: !isLiked,
        likeCount: isPostLike ? likeCount + 1 : likeCount - 1,
      })
    );
    return prevState;
  }
  function onError(c: any) {
    queryClient.setQueryData(queryKey, c.prevState);
  }
  function onSuccess() {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["profile", "liked-photos"] });
  }

  const { mutate: likePhoto } = useMutation({
    mutationFn: postLike,
    onMutate: () => onMutate(true),
    onError: (err, newData, context: any) => onError(context),
    onSuccess,
  });
  const { mutate: dislikePhoto } = useMutation({
    mutationFn: deleteLike,
    onMutate: () => onMutate(false),
    onError: (err, newData, context: any) => onError(context),
    onSuccess,
  });

  async function handleClick() {
    if (data?.isLiked) dislikePhoto(id as string);
    else likePhoto(id as string);
  }

  return (
    <div className="flex flex-col items-center">
      <button disabled={!session.id} onClick={handleClick}>
        {data?.isLiked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        )}
      </button>
      <span className="text-xs">{data?.likeCount}</span>
    </div>
  );
}
