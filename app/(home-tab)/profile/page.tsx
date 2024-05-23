import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getProfile } from "@/libs/api";
import { Profile } from "./profile";
import getSession from "@/libs/session";
import FullScreenPage from "@/components/full-screen-page";
import LoginRequired from "@/components/login-required";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page() {
  const queryClient = new QueryClient();
  const session = await getSession();

  if (!session.id)
    return (
      <FullScreenPage>
        <LoginRequired />
      </FullScreenPage>
    );

  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(session.id!),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile id={session.id} />
    </HydrationBoundary>
  );
}
