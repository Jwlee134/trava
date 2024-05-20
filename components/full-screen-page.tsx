import { ReactNode } from "react";

export default function FullScreenPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-128px)] flex items-center justify-center">
      {children}
    </div>
  );
}
