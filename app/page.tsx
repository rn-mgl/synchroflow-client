import Logo from "@/components//global/Logo";
import Hero from "@/components//landing/Hero";
import Offers from "@/components//landing/Offers";
import CallToAction from "@/components//landing/CallToAction";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SynchroFlow",
  description: "Task management tool",
};

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-full ">
      <Logo />
      <Hero />
      <Offers />
      <CallToAction />
    </main>
  );
};

export default Home;
