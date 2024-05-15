import HomeTabBar from "@/components/home-tab-bar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <HomeTabBar />
    </div>
  );
}
