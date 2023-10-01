import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SynchroFlow | Tasks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
