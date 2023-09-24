"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Hub = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen h-screen bg-white">
      <div
        className="max-w-screen-2xl flex flex-col gap-5 justify-center bg-neutral-100 h-full
        items-center w-full p-5 t:p-10"
      ></div>
    </div>
  );
};

export default Hub;
