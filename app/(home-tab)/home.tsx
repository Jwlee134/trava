"use client";

import { getPhotos } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: photos } = useQuery({
    queryKey: ["photos"],
    queryFn: getPhotos,
  });

  return (
    <div className="grid grid-cols-3 gap-1">
      {photos?.map((photo) => (
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
