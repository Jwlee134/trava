"use client";

import { logout } from "@/app/(home-tab)/profile/actions";
import { useFormState } from "react-dom";
import { IoLogOut } from "react-icons/io5";

export function LogOutButton() {
  const [state, action] = useFormState(logout, null);

  return (
    <form action={action}>
      <button className="flex items-center gap-2">
        <IoLogOut size={24} />
        Log out
      </button>
    </form>
  );
}
