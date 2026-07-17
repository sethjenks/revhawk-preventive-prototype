"use client";

import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-center" richColors closeButton />
      {process.env.NODE_ENV === "development" ? (
        <DialRoot position="top-right" defaultOpen={false} />
      ) : null}
    </>
  );
}
