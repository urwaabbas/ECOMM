"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import NotificationManager from "@/components/NotificationManager";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <NotificationManager />
      {children}
    </SessionProvider>
  );
}