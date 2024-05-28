import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getComments, getPhoto, getPhotoLikeStatus } from "@/libs/api";
import Photo from "./photo";
import getSession from "@/libs/session";
import { Metadata } from "next";
import prisma from "@/libs/db";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const id = params.id;

  const photo = await prisma.photo.findUnique({
    where: { id },
    select: { id: true, url: true, title: true, caption: true },
  });

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
  await queryClient.prefetchQuery({
    queryKey: ["photo", id, "comments"],
    queryFn: () => getComments(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Photo session={{ ...session }} />
    </HydrationBoundary>
  );
}
