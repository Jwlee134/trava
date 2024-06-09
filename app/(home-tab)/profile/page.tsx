import FullScreenPage from "@/components/full-screen-page";
import LoginRequired from "@/components/login-required";
import { Metadata } from "next";
import Image from "next/image";
import { getProfile } from "./actions";
import { LogOutButton } from "@/components/log-out-button";
import getSession from "@/libs/session";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page() {
  const session = await getSession();

  if (!session.id) {
    return (
      <FullScreenPage>
        <LoginRequired />
      </FullScreenPage>
    );
  }

  const user = await getProfile(session.id);

  return (
    <div className="pt-16">
      <div className="flex flex-col items-center gap-4 pb-10">
        <div className="avatar">
          <div className="relative size-32 rounded-full">
            {user && <Image src={user.avatar} alt={user.username} fill />}
          </div>
        </div>
        <div className="text-2xl">{user?.username}</div>
      </div>
      <div className="p-4 flex flex-col gap-4 max-w-screen-sm mx-auto">
        <ul className="menu bg-base-200 rounded-box">
          <li>
            <LogOutButton />
          </li>
        </ul>
      </div>
    </div>
  );
}
