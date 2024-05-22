import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getMyPhotos } from "@/libs/api";
import { MyPhotos } from "./my-photos";
import getSession from "@/libs/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const queryClient = new QueryClient();
  const session = await getSession();
  if (!session.id) return redirect("/");

  await queryClient.prefetchQuery({
    queryKey: ["profile", "my-photos"],
    queryFn: () => getMyPhotos(session.id!),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPhotos id={session.id} />
    </HydrationBoundary>
  );
}
