"use client";

import { cls } from "@/libs/utils";
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
    <div className="btm-nav">
      <Link href="/" className={cls(isHome ? "active" : "")}>
        {isHome ? (
          <IoHome size={TAB_ICON_SIZE} />
        ) : (
          <IoHomeOutline size={TAB_ICON_SIZE} />
        )}
      </Link>
      <Link href="/upload" className={cls(isUpload ? "active" : "")}>
        {isUpload ? (
          <IoCloudUpload size={TAB_ICON_SIZE} />
        ) : (
          <IoCloudUploadOutline size={TAB_ICON_SIZE} />
        )}
      </Link>
      <Link href="/profile" className={cls(isProfile ? "active" : "")}>
        {isProfile ? (
          <IoPerson size={TAB_ICON_SIZE} />
        ) : (
          <IoPersonOutline size={TAB_ICON_SIZE} />
        )}
      </Link>
    </div>
  );
}
