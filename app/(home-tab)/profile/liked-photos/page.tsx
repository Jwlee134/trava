import { getLikedPhotos } from "@/libs/api";
import getSession from "@/libs/session";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { LikedPhotos } from "./liked-photos";

export default async function Page() {
  const queryClient = new QueryClient();
  const session = await getSession();
  if (!session.id) return redirect("/");

  await queryClient.prefetchQuery({
    queryKey: ["profile", "liked-photos"],
    queryFn: () => getLikedPhotos(session.id!),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LikedPhotos id={session.id} />
    </HydrationBoundary>
  );
}
