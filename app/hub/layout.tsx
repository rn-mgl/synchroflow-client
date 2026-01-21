"use client";

import { NotificationProvider } from "@/base/src/contexts/notificationContext";
import { SettingsProvider } from "@/base/src/contexts/settingsContext";
import Nav from "@/components//global/Nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <NotificationProvider>
        <div className="fixed top-0 left-0 w-full h-screen min-h-screen">
          <Nav>{children}</Nav>
        </div>
      </NotificationProvider>
    </SettingsProvider>
  );
}
