import api from "@/libs/api";
import { GetPhotosResponse } from "../api/v1/photos/route";
import Image from "next/image";
import Link from "next/link";

async function getPhotos() {
  return await api<GetPhotosResponse>("/photos", {
    method: "GET",
    next: { tags: ["photos"] },
  });
}

export default async function Home() {
  const photos = await getPhotos();

  return (
    <div className="grid grid-cols-3 gap-1">
      {photos.map((photo) => (
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
