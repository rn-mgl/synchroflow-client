import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Lato } from "next/font/google";
import { AppProvider } from "../context";

const poppins = Poppins({
  display: "auto",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--poppins",
});

export const metadata: Metadata = {
  title: "SynchroFlow",
  description: "Task management tool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <html lang="en">
        <body className={`${poppins.variable} font-body scroll-smooth`}>{children}</body>
      </html>
    </AppProvider>
  );
}
