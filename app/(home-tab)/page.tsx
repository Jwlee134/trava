import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getPhotos } from "@/libs/api";
import Home from "./home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["photos"],
    queryFn: getPhotos,
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    pages: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Home />
    </HydrationBoundary>
  );
}
