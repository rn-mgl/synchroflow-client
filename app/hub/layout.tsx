import Nav from "@/components//global/Nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SynchroFlow | Hub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col">
      <Nav>{children}</Nav>
    </div>
  );
}
