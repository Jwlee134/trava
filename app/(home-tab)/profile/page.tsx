import ProtectedPage from "@/components/protected-page";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile, logout } from "./actions";

async function Profile() {
  const user = await getProfile();
  if (!user) return notFound();

  return (
    <div className="pt-16">
      <div className="flex flex-col items-center gap-4 pb-10">
        <div className="avatar">
          <div className="relative size-32 rounded-full">
            <Image src={user.avatar} alt={user.username} fill />
          </div>
        </div>
        <div className="text-2xl">{user.username}</div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <ul className="menu bg-base-200 rounded-box">
          <li>
            <Link href="/profile/liked-photos">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
              <span>Liked Photos</span>
            </Link>
          </li>
          <li>
            <Link href="/profile/my-photos">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>My Photos</span>
            </Link>
          </li>
        </ul>
        <form action={logout}>
          <button className="btn btn-block rounded-box">Log out</button>
        </form>
      </div>
    </div>
  );
}

export default async function Page() {
  return (
    <ProtectedPage>
      <Profile />
    </ProtectedPage>
  );
}
