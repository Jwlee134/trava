import HomeTabBar from "@/components/home-tab-bar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HomeTabBar />
      <div className="pb-16 lg:pb-0 lg:pl-48">{children}</div>
    </>
  );
}
