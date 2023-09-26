import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SynchroFlow | Settings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
