import Logo from "@/components//global/Logo";
import Hero from "@/components//landing/Hero";
import React from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-full ">
      <Logo />
      <Hero />
    </main>
  );
}
