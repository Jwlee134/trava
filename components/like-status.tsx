"use client";

import { dislikePhoto, likePhoto } from "@/app/photos/[id]/actions";
import { useOptimistic } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";

interface LikeStatusProps {
  id: number;
  isLiked: boolean;
}

export default function LikeStatus({ id, isLiked }: LikeStatusProps) {
  const [state, dispatch] = useOptimistic(
    isLiked,
    (currentState) => !currentState
  );

  async function action() {
    dispatch(null);
    if (isLiked) await dislikePhoto(id);
    else await likePhoto(id);
  }

  return (
    <form
      action={action}
      className="flex flex-col items-center justify-center gap-1"
    >
      <button className="active:scale-90 transition-transform size-12 flex items-center justify-center">
        {state ? <BsHeartFill size={24} /> : <BsHeart size={24} />}
      </button>
    </form>
  );
}
