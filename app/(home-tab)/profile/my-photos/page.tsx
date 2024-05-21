import Image from "next/image";
import Link from "next/link";
import { getMyPhotos } from "./actions";
import FullScreenPage from "@/components/full-screen-page";

export default async function MyPhotos() {
  const photos = await getMyPhotos();

  if (!photos.length)
    return (
      <FullScreenPage>
        <span className="text-sm">You haven&apos;t uploaded photos.</span>
      </FullScreenPage>
    );
  return (
    <div className="grid grid-cols-3 gap-1">
      {photos.map(({ id, url }) => (
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
