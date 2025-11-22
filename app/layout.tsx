"use client";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import { AppProvider } from "@/base/src/contexts/context";
import { SettingsProvider } from "@/base/src/contexts/settingsContext";
import "./globals.css";

const poppins = Poppins({
  display: "auto",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <html lang="en">
        <SessionProvider>
          <SettingsProvider>
            <body className={`${poppins.variable} font-body cstm-scrollbar`}>
              {children}
            </body>
          </SettingsProvider>
        </SessionProvider>
      </html>
    </AppProvider>
  );
}
