"use client";

import FullScreenPage from "@/components/full-screen-page";
import { getLikedPhotos } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export function LikedPhotos({ id }: { id: number }) {
  const { data } = useQuery({
    queryKey: ["profile", "liked-photos"],
    queryFn: () => getLikedPhotos(id),
  });

  if (data && !data.length)
    return (
      <FullScreenPage>
        <span className="text-sm">You haven&apos;t liked photos.</span>
      </FullScreenPage>
    );
  return (
    <div className="grid grid-cols-3 gap-1">
      {data?.map(({ photo }) => (
        <Link
          key={photo.id}
          href={`/photos/${photo.id}`}
          className="relative aspect-square"
        >
          <Image
            src={photo.url}
            alt="photo"
            fill
            className="object-cover"
            sizes="33vw"
          />
        </Link>
      ))}
    </div>
  );
}
