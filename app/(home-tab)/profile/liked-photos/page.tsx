import Image from "next/image";
import Link from "next/link";
import { getLikedPhotos } from "./actions";
import FullScreenPage from "@/components/full-screen-page";

export default async function LikedPhotos() {
  const photos = await getLikedPhotos();

  if (!photos.length)
    return (
      <FullScreenPage>
        <span className="text-sm">You haven&apos;t liked photos.</span>
      </FullScreenPage>
    );
  return (
    <div className="grid grid-cols-3 gap-1">
      {photos.map(({ photo }) => (
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
