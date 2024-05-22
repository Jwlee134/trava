"use client";

import FullScreenPage from "@/components/full-screen-page";
import { getMyPhotos } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export function MyPhotos({ id }: { id: number }) {
  const { data } = useQuery({
    queryKey: ["profile", "my-photos"],
    queryFn: () => getMyPhotos(id),
  });

  if (data && !data.length)
    return (
      <FullScreenPage>
        <span className="text-sm">You haven&apos;t uploaded photos.</span>
      </FullScreenPage>
    );
  return (
    <div className="grid grid-cols-3 gap-1">
      {data?.map(({ id, url }) => (
        <Link
          key={id}
          href={`/photos/${id}`}
          className="relative aspect-square"
        >
          <Image
            src={url}
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
