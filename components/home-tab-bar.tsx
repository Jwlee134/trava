"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoHome,
  IoHomeOutline,
  IoCloudUpload,
  IoCloudUploadOutline,
  IoPerson,
  IoPersonOutline,
} from "react-icons/io5";

const TAB_ICON_SIZE = 22;

export default function HomeTabBar() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isUpload = pathname === "/upload";
  const isProfile = pathname === "/profile";

  return (
    <div
      className="max-[1024px]:z-50 max-[1024px]:btm-nav
      max-[1024px]:max-w-screen-lg max-[1024px]:mx-auto
      lg:p-1.5 lg:fixed lg:w-48"
    >
      <Link
        href="/"
        className="flex items-center lg:hover:bg-base-200 lg:transition-colors
        lg:rounded-md lg:p-3"
      >
        {isHome ? (
          <IoHome size={TAB_ICON_SIZE} />
        ) : (
          <IoHomeOutline size={TAB_ICON_SIZE} />
        )}
        <span className="hidden lg:block lg:ml-2">Home</span>
      </Link>
      <Link
        href="/upload"
        className="flex items-center lg:hover:bg-base-200 lg:transition-colors
        lg:rounded-md lg:p-3"
      >
        {isUpload ? (
          <IoCloudUpload size={TAB_ICON_SIZE} />
        ) : (
          <IoCloudUploadOutline size={TAB_ICON_SIZE} />
        )}
        <span className="hidden lg:block lg:ml-2">Upload</span>
      </Link>
      <Link
        href="/profile"
        className="flex items-center lg:hover:bg-base-200 lg:transition-colors
        lg:rounded-md lg:p-3"
      >
        {isProfile ? (
          <IoPerson size={TAB_ICON_SIZE} />
        ) : (
          <IoPersonOutline size={TAB_ICON_SIZE} />
        )}
        <span className="hidden lg:block lg:ml-2">Profile</span>
      </Link>
    </div>
  );
}
