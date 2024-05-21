import Image from "next/image";
import Link from "next/link";
import { getPhotos } from "./actions";
import { unstable_cache } from "next/cache";

const getCachedPhotos = unstable_cache(getPhotos, ["photos"], {
  tags: ["photos"],
});

export default async function Home() {
  const photos = await getCachedPhotos();

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
