import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SynchroFlow | Associate",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
