import { notFound } from "next/navigation";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getPhoto, getPhotoLikeStatus } from "@/libs/api";
import Photo from "./photo";
import getSession from "@/libs/session";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const queryClient = new QueryClient();
  const session = await getSession();

  await queryClient.prefetchQuery({
    queryKey: ["photo", id],
    queryFn: () => getPhoto(id),
  });
  await queryClient.prefetchQuery({
    queryKey: ["photo", id, "like-status"],
    queryFn: () => getPhotoLikeStatus(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Photo session={{ ...session }} />
    </HydrationBoundary>
  );
}
