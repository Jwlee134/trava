import { notFound } from "next/navigation";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getPhoto, getPhotoLikeStatus } from "@/libs/api";
import Photo from "./photo";
import getSession from "@/libs/session";
import { Metadata, ResolvingMetadata } from "next";
import { GetPhotoMetadataReturnType } from "@/app/api/v1/photos/[id]/metadata/route";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const photo: GetPhotoMetadataReturnType = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/photos/${id}/metadata`,
    {
      method: "GET",
      next: { tags: [`photo-metadata-${id}`] },
    }
  ).then((res) => res.json());

  return {
    title: photo?.title || "No title",
    openGraph: {
      images: photo?.url,
      title: photo?.title || "No title",
      description: photo?.caption || "No caption",
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
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
