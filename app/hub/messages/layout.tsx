"use client";

import { MessageProvider } from "@/base/src/contexts/messageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessageProvider>{children}</MessageProvider>;
}
