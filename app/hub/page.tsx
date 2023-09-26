"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Hub = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen h-screen bg-neutral-100 overflow-y-auto">
      <div
        className="max-w-screen-2xl flex flex-col gap-5 justify-center  h-full
        items-center w-full p-5 t:p-10"
      >
        <div className="flex w-full h-full"></div>
      </div>
    </div>
  );
};

export default Hub;
