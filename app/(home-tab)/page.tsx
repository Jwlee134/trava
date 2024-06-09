import { Metadata } from "next";
import { getPhotos } from "./actions";
import Photos from "./photos";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
  title: "Home",
};

const getCachedPhotos = unstable_cache(getPhotos, ["photos"], {
  tags: ["photos"],
});

export default async function Home() {
  const photos = await getCachedPhotos();

  return <Photos initialPhotos={photos} fetchMorePhotos={getPhotos} />;
}
