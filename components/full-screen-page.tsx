import { ReactNode } from "react";

export default function FullScreenPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center">
      {children}
    </div>
  );
}
