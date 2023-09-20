import Logo from "@/components//global/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SynchroFlow | Login",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Logo />
      {children}
    </>
  );
}
